// Clinic facts shown across the site. Final content from BUILD-SPEC.md section 12
// and docs/decisions.md; never add unverified claims here.

export const site = {
  name: "دکتر فاطمه جعفری",
  clinicName: "کلینیک دکتر فاطمه جعفری",
  tagline: "دندانپزشکی زیبایی شیراز",
  phone: { display: "۰۹۰۲ ۳۰۲ ۳۱۲۰", tel: "+989023023120" },
  address:
    "شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌ی چهارم",
  hours: "شنبه تا چهارشنبه، ساعت ۱۰ تا ۱۹",
  closedDays: "پنجشنبه و جمعه تعطیل",
  councilNumber: "۱۶۹۴۷۳", // شماره نظام پزشکی
  // TODO-content.md: exact map pins (Neshan, Balad, Google) are still missing; this searches the address.
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("شیراز، پل معالی‌آباد، ساختمان موجودی"),
  // TODO-content.md: Instagram URL is still missing.
  instagram: null as string | null,
} as const;

export const mainNav = [
  { href: "/composite", label: "کامپوزیت" },
  { href: "/veneers", label: "لمینت" },
  { href: "/services", label: "خدمات" },
  { href: "/journal", label: "مجله" },
  { href: "/#contact", label: "تماس" },
] as const;

export const bookingHref = "/booking";
export const bookingLabel = "رزرو نوبت";
