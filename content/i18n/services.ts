import type { Faq } from "@/content/services";
import type { IntlLocale } from "@/lib/i18n";
import { servicesAr } from "./services-ar";
import { servicesEn } from "./services-en";

/** Translated text of one service page. Everything else (icon, address, case photos) comes from content/services.ts. */
export type ServiceContent = {
  name: string;
  /** Page H1. */
  title: string;
  short: string;
  metaDescription: string;
  intro: string[];
  detail?: {
    whatTitle: string;
    whoTitle: string;
    longevityTitle: string;
    whatItIs: string[];
    whoItSuits: string[];
    process: { title: string; body: string }[];
    benefits: string[];
    limitations: string[];
    longevity: string[];
    aftercare: string[];
    faq: Faq[];
  };
  /** Short FAQ for pages without a detail section. */
  faq?: Faq[];
};

export const serviceContent: Record<IntlLocale, Record<string, ServiceContent>> = {
  ar: servicesAr,
  en: servicesEn,
};

/** Date the Arabic and English service text was last changed (sitemap and structured data). */
export const INTL_UPDATED = "2026-10-04";

/** Section headings and labels shared by every translated service page. */
export const serviceLabels = {
  ar: {
    process: "مراحل العلاج",
    benefits: "المزايا",
    limits: "القيود",
    aftercare: "العناية بعد العلاج",
    faq: "أسئلة شائعة",
    cases: "نماذج من أعمالنا",
    bookingNote: "لفحص حالة أسنانك ومناقشة هذا العلاج، احجز جلسة فحص واستشارة.",
    servicesTitle: "خدمات العيادة",
    servicesLead: [
      "يتركّز عمل العيادة على الكومبوزيت والفينير الخزفي، إلى جانب خدمات طب الأسنان الشاملة.",
      "تقدّم عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز، معالي‌آباد، الخدمات التالية. للبدء، احجز جلسة فحص واستشارة لتُفحص حالة أسنانك ونراجع معًا خيارات العلاج.",
    ],
    servicesMeta:
      "خدمات عيادة الدكتورة فاطمة جعفري لطب الأسنان التجميلي في شيراز، معالي‌آباد: الكومبوزيت والفينير الخزفي وتصميم الابتسامة والتبييض وزراعة الأسنان والترميم وعلاج العصب وجراحة الفم وتقويم الأسنان.",
    servicesMetaTitle: "خدمات طب الأسنان في شيراز، معالي‌آباد",
    more: "اعرف المزيد",
  },
  en: {
    process: "The treatment process",
    benefits: "Benefits",
    limits: "Limitations",
    aftercare: "Aftercare",
    faq: "Frequently asked questions",
    cases: "Our work",
    bookingNote: "To have your teeth examined and to talk about this treatment, book an examination and consultation.",
    servicesTitle: "Clinic services",
    servicesLead: [
      "The clinic focuses on composite bonding and ceramic veneers, alongside a full range of dental services.",
      "Dr. Fatemeh Jafari's cosmetic dental clinic in Maaliabad, Shiraz, offers the services below. To start, book an examination and consultation so that your teeth can be checked and we can go through the treatment options together.",
    ],
    servicesMeta:
      "Services at Dr. Fatemeh Jafari's cosmetic dental clinic in Maaliabad, Shiraz: composite bonding, ceramic veneers, smile design, whitening, implants, restorations, root canal treatment, oral surgery and orthodontics.",
    servicesMetaTitle: "Dental services in Shiraz, Maaliabad",
    more: "Learn more",
  },
} as const;
