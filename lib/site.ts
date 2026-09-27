// Clinic facts shown across the site. Final content from BUILD-SPEC.md section 12
// and docs/decisions.md; never add unverified claims here.

export const site = {
  name: "دکتر ندا جعفری",
  clinicName: "کلینیک دکتر ندا جعفری",
  tagline: "دندانپزشکی زیبایی شیراز",
  phones: [
    { display: "۰۹۰۲ ۳۰۲ ۳۱۲۰", tel: "+989023023120" },
    { display: "۰۹۰۲ ۳۰۲ ۳۱۱۰", tel: "+989023023110" },
  ],
  address:
    "شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌ی چهارم",
  hours: "شنبه تا چهارشنبه، ساعت ۱۰ تا ۱۹",
  closedDays: "پنجشنبه و جمعه تعطیل",
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
