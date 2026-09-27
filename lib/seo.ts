import { site } from "./site";

/** Absolute site URL for canonical links, sitemap and structured data. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const abs = (path: string) => `${siteUrl}${path}`;

/** Dentist (a LocalBusiness subtype). No geo until the exact pin is confirmed (TODO-content.md). */
export function dentistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": abs("/#clinic"),
    name: site.clinicName,
    url: siteUrl,
    image: abs("/opengraph-image.png"),
    telephone: site.phones.map((p) => p.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: "پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌ی چهارم",
      addressLocality: "شیراز",
      addressRegion: "فارس",
      addressCountry: "IR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        opens: "10:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        opens: "14:00",
        closes: "19:00",
      },
    ],
    paymentAccepted: "اقساطی برای درمان‌های زیبایی",
    employee: { "@id": abs("/about#doctor") },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": abs("/about#doctor"),
    name: "دکتر ندا جعفری",
    jobTitle: "دندانپزشک زیبایی",
    worksFor: { "@id": abs("/#clinic") },
    url: abs("/about"),
    image: abs("/images/doctor/dr-hero.webp"),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
