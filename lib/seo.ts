import type { Metadata } from "next";
import { COPY_APPROVED, services, type Service } from "@/content/services";
import { INTL_UPDATED, type ServiceContent } from "@/content/i18n/services";
import { facts } from "@/content/i18n/ui";
import { displayTitle } from "./title-case";
import { intlOnlyPaths, intlLocales, isTranslated, localePath, locales, ogLocale, splitLocale, type IntlLocale, type Locale } from "./i18n";
import { site } from "./site";

/** Absolute site URL for canonical links, sitemap and structured data. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const abs = (path: string) => `${siteUrl}${path}`;

/**
 * Search engines may index the site only where SITE_INDEXABLE=true (the real
 * domain). Every other deployment (Vercel test, previews, local) is noindex, both
 * in the page and in the X-Robots-Tag header (next.config.ts). robots.txt stays
 * open on purpose: a blocked page can never show its noindex.
 */
export const indexable = process.env.SITE_INDEXABLE === "true";

export const robotsMeta: Metadata["robots"] = indexable
  ? {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    }
  : { index: false, follow: false };

export const defaultTitle = "دندانپزشک زیبایی در شیراز، معالی‌آباد | دکتر فاطمه جعفری";
export const defaultDescription =
  "دکتر فاطمه جعفری، دندانپزشک زیبایی با بیش از ۱۰ سال تجربه در شیراز، معالی‌آباد: کامپوزیت دندان، لمینت سرامیکی و طراحی لبخند. رزرو آنلاین نوبت.";

type ShareImage = { url: string; width: number; height: number; alt: string };
const defaultImage: ShareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز",
};

const imageAlt: Record<Locale, string> = {
  fa: defaultImage.alt,
  ar: "عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز",
  en: "Dr. Fatemeh Jafari's cosmetic dental clinic in Shiraz",
};

/** hreflang links between the language versions of a page, once it has been translated. */
function languageAlternates(path: string): Record<string, string> | undefined {
  const base = splitLocale(path).path;
  if (intlOnlyPaths.includes(base)) {
    return { ...Object.fromEntries(intlLocales.map((l) => [l, abs(localePath(l, base))])), "x-default": abs(localePath("en", base)) };
  }
  if (!isTranslated(base)) return undefined;
  return {
    ...Object.fromEntries(locales.map((l) => [l, abs(localePath(l, base))])),
    "x-default": abs(localePath("fa", base)),
  };
}

/**
 * Metadata for one page: title, description, canonical, and its own Open Graph
 * and Twitter tags. A page's openGraph replaces the layout's completely, so every
 * page must go through this, or it shares the home page's preview.
 */
export function buildMetadata(o: {
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: "website" | "article";
  image?: ShareImage;
  publishedTime?: string;
  modifiedTime?: string;
  /** Article authors; defaults to the doctor's page. */
  authors?: string[];
  /** Language of the page; defaults to Persian. */
  lang?: Locale;
}): Metadata {
  const lang = o.lang ?? "fa";
  const title = typeof o.title === "string" ? displayTitle(lang, o.title) : { absolute: displayTitle(lang, o.title.absolute) };
  const plain = typeof title === "string" ? title : title.absolute;
  const img = o.image ?? { ...defaultImage, alt: imageAlt[lang] };
  const languages = languageAlternates(o.path);
  return {
    title,
    description: o.description,
    alternates: { canonical: o.path, ...(languages ? { languages } : {}) },
    openGraph: {
      type: o.type ?? "website",
      locale: ogLocale[lang],
      ...(languages ? { alternateLocale: locales.filter((l) => l !== lang && l in languages).map((l) => ogLocale[l]) } : {}),
      siteName: facts[lang].clinicName,
      title: plain,
      description: o.description,
      url: abs(o.path),
      images: [img],
      ...(o.type === "article"
        ? { publishedTime: o.publishedTime, modifiedTime: o.modifiedTime ?? o.publishedTime, authors: o.authors ?? [abs("/about")] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: plain, description: o.description, images: [img.url] },
  };
}

const shirazNames: Record<Locale, { city: string; province: string }> = {
  fa: { city: "شیراز", province: "استان فارس" },
  ar: { city: "شيراز", province: "محافظة فارس" },
  en: { city: "Shiraz", province: "Fars Province" },
};

/** Structured-data node ids, one set per language so the localized names never clash (Persian ids are the original ones). */
export const clinicId = (lang: Locale = "fa") => abs(`${localePath(lang, "/")}#clinic`);
export const doctorId = (lang: Locale = "fa") => abs(`${localePath(lang, "/about")}#doctor`);
export const websiteId = (lang: Locale = "fa") => abs(`${localePath(lang, "/")}#website`);

const shirazArea = (lang: Locale) => ({
  "@type": "City",
  name: shirazNames[lang].city,
  containedInPlace: { "@type": "AdministrativeArea", name: shirazNames[lang].province },
});

/**
 * Dentist (a LocalBusiness subtype). geo and hasMap come from the clinic's Google Maps pin
 * (lib/site.ts); no priceRange, because no prices are published (decision D3).
 */
export function dentistSchema(lang: Locale = "fa") {
  const f = facts[lang];
  const intl = lang !== "fa";
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": clinicId(lang),
    name: f.clinicName,
    // Finglish (Persian in Latin letters): many people search this way, e.g. "dandanpezeshki zibayi shiraz".
    ...(intl ? {} : { alternateName: ["Dandanpezeshki Zibayi Shiraz", "Clinic Doctor Fatemeh Jafari Shiraz", "Kelinik Dr Jafari Shiraz"] }),
    url: siteUrl,
    image: abs("/opengraph-image.jpg"),
    telephone: site.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: f.address.replace(/^(شیراز|شيراز)،\s*/, "").replace(/,?\s*Shiraz, Iran$/, ""),
      addressLocality: intl ? (lang === "ar" ? "شيراز" : "Shiraz") : "شیراز",
      addressRegion: intl ? (lang === "ar" ? "فارس" : "Fars") : "فارس",
      addressCountry: "IR",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    hasMap: site.mapUrl,
    areaServed: shirazArea(lang),
    medicalSpecialty: "https://schema.org/Dentistry",
    knowsLanguage: "fa",
    // Staff speak Persian only (docs/decisions.md), so every contact point lists fa. Patients abroad reach the clinic on WhatsApp.
    contactPoint: [
      { "@type": "ContactPoint", contactType: "reservations", telephone: site.phone.tel, availableLanguage: ["fa"] },
      ...(intl
        ? [{ "@type": "ContactPoint", contactType: "customer support", url: site.whatsapp.url, telephone: "+989177203937", availableLanguage: ["fa"] }]
        : []),
    ],
    openingHoursSpecification: site.openPeriods.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...site.openDays],
      opens,
      closes,
    })),
    // Instalments, service names and the booking action are for Persian-speaking patients; the other languages describe the clinic only.
    ...(intl
      ? {}
      : {
          paymentAccepted: "اقساطی برای درمان‌های زیبایی",
          availableService: services.map((s) => ({
            "@type": s.slug === "consultation" ? "Service" : "MedicalProcedure",
            name: s.name,
            url: abs(s.href),
          })),
          potentialAction: {
            "@type": "ReserveAction",
            name: "رزرو نوبت معاینه و مشاوره",
            target: {
              "@type": "EntryPoint",
              urlTemplate: abs("/booking"),
              actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
              inLanguage: "fa",
            },
          },
        }),
    employee: { "@id": doctorId(lang) },
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}

const personText: Record<Locale, { name: string; alt: string; job: string; knows: string[] }> = {
  fa: { name: "دکتر فاطمه جعفری", alt: "دکتر ندا جعفری", job: "دندانپزشک زیبایی", knows: ["کامپوزیت دندان", "لمینت سرامیکی", "طراحی لبخند"] },
  ar: { name: "د. فاطمة جعفري", alt: "د. ندا جعفري", job: "طبيبة أسنان تجميلية", knows: ["الكومبوزيت التجميلي", "الفينير الخزفي", "تصميم الابتسامة"] },
  en: { name: "Dr. Fatemeh Jafari", alt: "Dr. Neda Jafari", job: "Cosmetic dentist", knows: ["Composite bonding", "Ceramic veneers", "Smile design"] },
};

export function personSchema(lang: Locale = "fa") {
  const p = personText[lang];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": doctorId(lang),
    name: p.name,
    // Known publicly as Neda (her Instagram); Fatemeh is her registered name.
    alternateName: lang === "fa" ? [p.alt, "Dr Fatemeh Jafari", "Dr Neda Jafari", "Doktor Jafari Dandanpezesh Shiraz"] : p.alt,
    jobTitle: p.job,
    hasOccupation: { "@type": "Occupation", name: p.job },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "IRIMC",
      name: lang === "fa" ? "شماره نظام پزشکی" : lang === "ar" ? "رقم نظام الأطباء (إيران)" : "Iran Medical Council number",
      value: "169473",
    },
    knowsAbout: p.knows,
    knowsLanguage: "fa",
    worksFor: { "@id": clinicId(lang) },
    workLocation: { "@id": clinicId(lang) },
    url: abs("/about"),
    image: abs("/images/doctor/dr-hero.webp"),
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}

export function websiteSchema(lang: Locale = "fa") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(lang),
    name: facts[lang].clinicName,
    url: lang === "fa" ? siteUrl : abs(localePath(lang, "/")),
    inLanguage: lang,
    publisher: { "@id": clinicId(lang) },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(faq: { q: string; a: string; noSchema?: boolean }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.filter((f) => !f.noSchema).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/**
 * A service page as a medical web page, reviewed by the doctor whose copy it is.
 * `intl` gives the Arabic or English version of the page: translated, never marked as reviewed.
 */
export function medicalWebPageSchema(service: Service, intl?: { lang: IntlLocale; text: ServiceContent }) {
  // Only claim a doctor's review when she actually reviewed the current text.
  const reviewed = !intl && service.doctorReviewed !== false;
  const path = intl ? localePath(intl.lang, service.href) : service.href;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": abs(`${path}#page`),
    url: abs(path),
    name: intl ? intl.text.title : service.title,
    description: intl ? intl.text.metaDescription : service.metaDescription,
    inLanguage: intl ? intl.lang : "fa",
    about: { "@type": service.slug === "consultation" ? "Service" : "MedicalProcedure", name: intl ? intl.text.name : service.name },
    ...(reviewed
      ? { reviewedBy: { "@id": doctorId() }, lastReviewed: service.reviewedAt ?? COPY_APPROVED }
      : {}),
    ...(intl ? { dateModified: INTL_UPDATED } : service.updatedAt ? { dateModified: service.updatedAt } : {}),
    isPartOf: { "@id": websiteId(intl?.lang ?? "fa") },
    publisher: { "@id": clinicId(intl?.lang ?? "fa") },
  };
}
