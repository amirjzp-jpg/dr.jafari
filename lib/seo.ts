import type { Metadata } from "next";
import { COPY_APPROVED, services, type Service } from "@/content/services";
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

export const defaultTitle = "دکتر فاطمه جعفری | دندانپزشکی زیبایی در شیراز";
export const defaultDescription =
  "کامپوزیت دندان، لمینت سرامیکی و طراحی لبخند در شیراز با دکتر فاطمه جعفری، دندانپزشک زیبایی با بیش از ۱۰ سال تجربه. امکان پرداخت اقساطی و رزرو آنلاین نوبت.";

type ShareImage = { url: string; width: number; height: number; alt: string };
const defaultImage: ShareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز",
};

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
}): Metadata {
  const plain = typeof o.title === "string" ? o.title : o.title.absolute;
  const img = o.image ?? defaultImage;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: {
      type: o.type ?? "website",
      locale: "fa_IR",
      siteName: site.clinicName,
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

const shiraz = {
  "@type": "City",
  name: "شیراز",
  containedInPlace: { "@type": "AdministrativeArea", name: "استان فارس" },
};

/**
 * Dentist (a LocalBusiness subtype). No geo, hasMap or priceRange: the exact pin
 * and prices are not confirmed (TODO-content.md).
 */
export function dentistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": abs("/#clinic"),
    name: site.clinicName,
    url: siteUrl,
    image: abs("/opengraph-image.jpg"),
    telephone: site.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.replace(/^شیراز،\s*/, ""),
      addressLocality: "شیراز",
      addressRegion: "فارس",
      addressCountry: "IR",
    },
    areaServed: shiraz,
    knowsLanguage: "fa",
    openingHoursSpecification: site.openPeriods.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...site.openDays],
      opens,
      closes,
    })),
    paymentAccepted: "اقساطی برای درمان‌های زیبایی",
    availableService: services.map((s) => ({
      "@type": s.slug === "consultation" ? "Service" : "MedicalProcedure",
      name: s.name,
      url: abs(s.href),
    })),
    potentialAction: {
      "@type": "ReserveAction",
      name: "رزرو نوبت معاینه و مشاوره",
      target: abs("/booking"),
    },
    employee: { "@id": abs("/about#doctor") },
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": abs("/about#doctor"),
    name: "دکتر فاطمه جعفری",
    // Known publicly as Neda (her Instagram); Fatemeh is her registered name.
    alternateName: "دکتر ندا جعفری",
    jobTitle: "دندانپزشک زیبایی",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "IRIMC",
      name: "شماره نظام پزشکی",
      value: "169473",
    },
    knowsAbout: ["کامپوزیت دندان", "لمینت سرامیکی", "طراحی لبخند"],
    knowsLanguage: "fa",
    worksFor: { "@id": abs("/#clinic") },
    workLocation: { "@id": abs("/#clinic") },
    url: abs("/about"),
    image: abs("/images/doctor/dr-hero.webp"),
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: site.clinicName,
    url: siteUrl,
    inLanguage: "fa",
    publisher: { "@id": abs("/#clinic") },
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

/** A service page as a medical web page, reviewed by the doctor whose copy it is. */
export function medicalWebPageSchema(service: Service) {
  // Only claim a doctor's review when she actually reviewed the current text.
  const reviewed = service.doctorReviewed !== false;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": abs(`${service.href}#page`),
    url: abs(service.href),
    name: service.title,
    description: service.metaDescription,
    inLanguage: "fa",
    about: { "@type": service.slug === "consultation" ? "Service" : "MedicalProcedure", name: service.name },
    ...(reviewed
      ? { reviewedBy: { "@id": abs("/about#doctor") }, lastReviewed: service.reviewedAt ?? COPY_APPROVED }
      : {}),
    ...(service.updatedAt ? { dateModified: service.updatedAt } : {}),
    isPartOf: { "@id": abs("/#website") },
    publisher: { "@id": abs("/#clinic") },
  };
}
