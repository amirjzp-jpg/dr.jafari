import { site, mainNav } from "@/lib/site";
import { isTranslated, type Locale } from "@/lib/i18n";

// Interface text and clinic facts per language. The Persian values are the
// strings the site always had (lib/site.ts stays their single source); Arabic and
// English are drafts written from the approved Persian copy for a native reader to
// proofread. Nothing here is a new clinical claim.

export type NavItem = { href: string; label: string };

export type Ui = {
  skip: string;
  mainMenu: string;
  menu: string;
  closeMenu: string;
  book: string;
  bookWhatsapp: string;
  callClinic: string;
  directions: string;
  directionsAria: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  language: string;
  footer: {
    council: string;
    gallery: string;
    location: string;
    privacy: string;
    policy: string;
    instagramAria: (handle: string) => string;
  };
  arrow: string;
};

export type Facts = {
  name: string;
  clinicName: string;
  tagline: string;
  address: string;
  /** Persian address, kept on foreign-language pages so a taxi driver can read it. */
  addressFa: string;
  hours: string;
  closedDays: string;
  phoneDisplay: string;
  council: string;
  experience: string;
};

export const ui: Record<Locale, Ui> = {
  fa: {
    skip: "پرش به محتوای اصلی",
    mainMenu: "منوی اصلی",
    menu: "منو",
    closeMenu: "بستن منو",
    book: "رزرو نوبت",
    bookWhatsapp: "رزرو نوبت",
    callClinic: "تماس با کلینیک",
    directions: "مسیریابی",
    directionsAria: "مسیریابی تا کلینیک روی نقشه",
    phone: "تلفن",
    whatsapp: "واتساپ",
    address: "نشانی",
    hours: "ساعات کاری",
    instagram: "اینستاگرام",
    language: "زبان",
    footer: {
      council: "شماره نظام پزشکی",
      gallery: "نمونه‌کارها",
      location: "دندانپزشکی در معالی‌آباد",
      privacy: "حریم خصوصی",
      policy: "قوانین نوبت‌دهی",
      instagramAria: (h) => `اینستاگرام ${h}`,
    },
    arrow: "←",
  },
  ar: {
    skip: "تخطَّ إلى المحتوى الرئيسي",
    mainMenu: "القائمة الرئيسية",
    menu: "القائمة",
    closeMenu: "إغلاق القائمة",
    book: "احجز موعدًا",
    bookWhatsapp: "احجز عبر واتساب",
    callClinic: "الاتصال بالعيادة",
    directions: "الاتجاهات",
    directionsAria: "الاتجاهات إلى العيادة على الخريطة",
    phone: "الهاتف",
    whatsapp: "واتساب",
    address: "العنوان",
    hours: "ساعات العمل",
    instagram: "إنستغرام",
    language: "اللغة",
    footer: {
      council: "رقم نظام الأطباء (إيران)",
      gallery: "نماذج من أعمالنا",
      location: "طب الأسنان في معالي‌آباد",
      privacy: "الخصوصية",
      policy: "شروط الحجز",
      instagramAria: (h) => `إنستغرام ${h}`,
    },
    arrow: "←",
  },
  en: {
    skip: "Skip to main content",
    mainMenu: "Main menu",
    menu: "Menu",
    closeMenu: "Close menu",
    book: "Book an appointment",
    bookWhatsapp: "Book on WhatsApp",
    callClinic: "Call the clinic",
    directions: "Directions",
    directionsAria: "Directions to the clinic on the map",
    phone: "Phone",
    whatsapp: "WhatsApp",
    address: "Address",
    hours: "Opening hours",
    instagram: "Instagram",
    language: "Language",
    footer: {
      council: "Iran Medical Council no.",
      gallery: "Our work",
      location: "Dentist in Maaliabad",
      privacy: "Privacy",
      policy: "Booking policy",
      instagramAria: (h) => `Instagram ${h}`,
    },
    arrow: "→",
  },
};

export const facts: Record<Locale, Facts> = {
  fa: {
    name: site.name,
    clinicName: site.clinicName,
    tagline: site.tagline,
    address: site.address,
    addressFa: site.address,
    hours: site.hours,
    closedDays: site.closedDays,
    phoneDisplay: site.phone.display,
    council: site.councilNumber,
    experience: "بیش از ۱۰ سال تجربه",
  },
  ar: {
    name: "د. فاطمة جعفري",
    clinicName: "عيادة الدكتورة فاطمة جعفري",
    tagline: "طب الأسنان التجميلي في شيراز",
    address: "شيراز، جسر معالي‌آباد، بداية شارع تاچارا، مقابل الجسر، بجوار بنك تجارت، مبنى «موجودي»، الطابق الرابع",
    addressFa: site.address,
    hours: "السبت إلى الأربعاء، من 10:00 إلى 13:00 ومن 14:00 إلى 19:00 (بتوقيت إيران)",
    closedDays: "الخميس والجمعة عطلة",
    phoneDisplay: "+98 902 302 3120",
    council: "169473",
    experience: "أكثر من 10 سنوات من الخبرة",
  },
  en: {
    name: "Dr. Fatemeh Jafari",
    clinicName: "Dr. Fatemeh Jafari's Clinic",
    tagline: "Cosmetic dentistry in Shiraz",
    address: "Maaliabad Bridge, start of Tachara Street, opposite the bridge, next to Bank Tejarat, Mojoodi Building, 4th floor, Shiraz, Iran",
    addressFa: site.address,
    hours: "Saturday to Wednesday, 10:00–13:00 and 14:00–19:00 (Iran time, UTC+3:30)",
    closedDays: "Closed on Thursday and Friday",
    phoneDisplay: "+98 902 302 3120",
    council: "169473",
    experience: "More than 10 years of experience",
  },
};

const intlNav: Record<"ar" | "en", { path: string; label: string }[]> = {
  ar: [
    { path: "/composite", label: "الكومبوزيت" },
    { path: "/veneers", label: "الفينير" },
    { path: "/gallery", label: "نماذج الأعمال" },
    { path: "/services", label: "الخدمات" },
  ],
  en: [
    { path: "/composite", label: "Composite" },
    { path: "/veneers", label: "Veneers" },
    { path: "/gallery", label: "Our work" },
    { path: "/services", label: "Services" },
  ],
};

const contactLabel = { ar: "تواصل معنا", en: "Contact" } as const;

/** Header menu for a language. Other languages list only pages that exist in that language. */
export function navFor(lang: Locale): readonly NavItem[] {
  if (lang === "fa") return mainNav;
  return [
    ...intlNav[lang].filter((i) => isTranslated(i.path)).map((i) => ({ href: `/${lang}${i.path}`, label: i.label })),
    { href: `/${lang}#contact`, label: contactLabel[lang] },
  ];
}

const waText = {
  ar: "السلام عليكم، أرغب في حجز موعد في عيادة الدكتورة فاطمة جعفري في شيراز.",
  en: "Hello, I would like to book an appointment at Dr. Fatemeh Jafari's clinic in Shiraz.",
} as const;

/**
 * Where the booking button goes. Persian: the SMS-code booking flow. Arabic and
 * English: that language's contact page once it exists, until then WhatsApp with a
 * ready first message (patients abroad cannot receive the Iranian SMS code).
 */
export function bookingFor(lang: Locale): { href: string; external: boolean; label: string } {
  const t = ui[lang];
  if (lang === "fa") return { href: "/booking", external: false, label: t.book };
  if (isTranslated("/booking")) return { href: `/${lang}/booking`, external: false, label: t.book };
  return { href: waLink(lang), external: true, label: t.bookWhatsapp };
}

/** WhatsApp chat with the clinic, opened with a ready first message in the visitor's language. */
export function waLink(lang: "ar" | "en"): string {
  return `${site.whatsapp.url}?text=${encodeURIComponent(waText[lang])}`;
}

/** Extra props for a link that leaves the site. */
export const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;
