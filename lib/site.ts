// Clinic facts shown across the site. Final content from BUILD-SPEC.md section 12
// and docs/decisions.md; never add unverified claims here.

export const site = {
  name: "دکتر فاطمه جعفری",
  clinicName: "کلینیک دکتر فاطمه جعفری",
  tagline: "دندانپزشکی زیبایی شیراز",
  phone: { display: "۰۹۰۲ ۳۰۲ ۳۱۲۰", tel: "+989023023120" },
  address:
    "شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌چهار",
  // Shown text and structured data both come from these lines; change hours here only.
  hours: "شنبه تا چهارشنبه، ۱۰ تا ۱۳ و ۱۴ تا ۱۹",
  closedDays: "پنجشنبه و جمعه تعطیل",
  openDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
  openPeriods: [
    ["10:00", "13:00"],
    ["14:00", "19:00"],
  ],
  // WhatsApp for patients abroad (Arabic and English pages), who cannot use the SMS-code booking.
  whatsapp: { display: "+98 917 720 3937", url: "https://wa.me/989177203937" },
  councilNumber: "۱۶۹۴۷۳", // شماره نظام پزشکی
  // Exact pin of the clinic's building (ساختمان موجودی), from the clinic's Google Maps link
  // https://maps.app.goo.gl/RBviRFDAiBidWmaf8 (2026-10-08). Used by the «مسیریابی» link and structured data.
  geo: { latitude: 29.6885153, longitude: 52.4724134 },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=29.6885153%2C52.4724134&query_place_id=ChIJEWrUf1IRsj8RO0pXnmNMjXQ",
  // The doctor's own account; she is known publicly as Neda (docs/decisions.md).
  instagram: "https://www.instagram.com/dr_nedajafarii/" as string | null,
  instagramHandle: "@dr_nedajafarii",
} as const;

export const mainNav = [
  { href: "/composite", label: "کامپوزیت" },
  { href: "/veneers", label: "لمینت" },
  { href: "/gallery", label: "نمونه‌کارها" },
  { href: "/services", label: "خدمات" },
  { href: "/journal", label: "مجله" },
  { href: "/#contact", label: "تماس" },
] as const;

export const bookingHref = "/booking";
export const bookingLabel = "رزرو نوبت";
