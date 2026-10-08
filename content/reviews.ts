import type { Locale } from "@/lib/i18n";

// Real patient comments supplied by the clinic (2026-10-08), lightly edited for spelling only.
// Each review is shown in every language; `original` marks the language the patient wrote in,
// and other versions are labelled as translations. «بهترین» is reworded per CLAUDE.md.
// No Review/AggregateRating markup: Google does not show stars for a business's own reviews.
// TODO-content.md: confirm each patient agreed to their comment being shown.

export type PatientReview = {
  original: Locale;
  /** Treatment, only when the patient named it. */
  treatment?: Record<Locale, string>;
  text: Record<Locale, string>;
};

export const reviews: PatientReview[] = [
  {
    original: "fa",
    text: {
      fa: "مشاوره‌های دکتر کمک کرد مناسب‌ترین انتخاب را داشته باشم و حالا دندان‌های جدیدم به من اعتمادبه‌نفس تازه‌ای داده‌اند.",
      ar: "ساعدتني استشارات الطبيبة على اتخاذ القرار الأنسب، وأسناني الجديدة منحتني ثقة جديدة بنفسي.",
      en: "The doctor's consultations helped me make the right choice, and my new teeth have given me new confidence.",
    },
  },
  {
    original: "fa",
    text: {
      fa: "دکتر و همکارانشان بسیار حرفه‌ای و محترم هستند و من تجربه‌ی خیلی خوبی داشتم.",
      ar: "الطبيبة وفريقها محترفون ومحترمون جداً، وكانت تجربتي جيدة جداً.",
      en: "The doctor and her staff are very professional and respectful, and I had a very good experience.",
    },
  },
  {
    original: "en",
    treatment: { fa: "لمینت سرامیکی", ar: "فينير خزفي", en: "Ceramic veneers" },
    text: {
      fa: "به‌شدت پیشنهاد می‌کنم. در سفرم به شیراز لمینت سرامیکی انجام دادم؛ در هر مرحله کمکم کردند و راهنمایی‌ام کردند و تجربه‌ی بسیار خوبی داشتم.",
      ar: "أنصح بها بشدة. أجريت فينير خزفي خلال زيارتي إلى شيراز، وقد ساعدوني ورافقوني في كل خطوة. كانت تجربة رائعة.",
      en: "Highly recommended. I had ceramic veneers during my visit to Shiraz, and they helped me and guided me through each step. I had a great experience.",
    },
  },
  {
    original: "fa",
    text: {
      fa: "بسیار عالی، تمیز و حرفه‌ای، با دستگاه‌های به‌روز دنیا.",
      ar: "ممتازة ونظيفة واحترافية، بأجهزة حديثة.",
      en: "Excellent, clean and professional, with up-to-date equipment.",
    },
  },
  {
    original: "fa",
    text: {
      fa: "دکتر جعفری خوش‌اخلاق و باتجربه هستند و کمکتان می‌کنند مناسب‌ترین راه را انتخاب کنید.",
      ar: "الدكتورة جعفري لطيفة وذات خبرة، وتساعدك على اختيار الطريقة الأنسب.",
      en: "Dr. Jafari is kind and experienced, and helps you choose the right option.",
    },
  },
];

export const reviewsCopy: Record<Locale, { eyebrow: string; title: string; patient: string; translated: string }> = {
  fa: { eyebrow: "نظر بیماران", title: "تجربه‌ی بیماران کلینیک", patient: "بیمار کلینیک", translated: "ترجمه از انگلیسی" },
  ar: { eyebrow: "آراء المرضى", title: "تجارب مرضى العيادة", patient: "مريض في العيادة", translated: "مترجم" },
  en: { eyebrow: "Patient reviews", title: "What patients say about the clinic", patient: "Clinic patient", translated: "Translated from Persian" },
};
