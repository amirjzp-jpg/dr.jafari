import { gallery, treatments, type GalleryItem, type Treatment } from "@/content/gallery";
import { toFaDigits } from "@/lib/digits";
import type { Locale } from "@/lib/i18n";

// Labels for the gallery in each language, and translated treatment names and
// photo descriptions. The Persian entries repeat the strings the gallery always used.

export type GalleryWords = {
  all: string;
  filterLabel: string;
  hint: string;
  allExamples: string;
  beforeAfter: string;
  close: string;
  viewer: string;
  prev: string;
  next: string;
  dragHint: string;
  carousel: string;
  zoom: (alt: string, pair: boolean) => string;
  of: (i: number, n: number) => string;
  example: (i: number) => string;
  num: (n: number) => string;
};

export const galleryWords: Record<Locale, GalleryWords> = {
  fa: {
    all: "همه",
    filterLabel: "نمایش بر اساس درمان",
    hint: "روی هر تصویر بزنید تا بزرگ‌تر ببینید.",
    allExamples: "همه‌ی نمونه‌ها",
    beforeAfter: "قبل و بعد",
    close: "بستن",
    viewer: "نمایش تصویر",
    prev: "تصویر قبلی",
    next: "تصویر بعدی",
    dragHint: "خط وسط را بکشید تا قبل و بعد را ببینید.",
    carousel: "نمونه‌کارها",
    zoom: (alt, pair) => `${alt}${pair ? " (قبل و بعد)" : ""}، بزرگ‌نمایی`,
    of: (i, n) => `${toFaDigits(i)} از ${toFaDigits(n)}`,
    example: (i) => `نمونه‌ی ${toFaDigits(i)}`,
    num: (n) => toFaDigits(n),
  },
  ar: {
    all: "الكل",
    filterLabel: "عرض بحسب العلاج",
    hint: "اضغط على أي صورة لتراها أكبر.",
    allExamples: "كل النماذج",
    beforeAfter: "قبل وبعد",
    close: "إغلاق",
    viewer: "عرض الصورة",
    prev: "الصورة السابقة",
    next: "الصورة التالية",
    dragHint: "اسحب الخط في المنتصف لترى الحالة قبل العلاج وبعده.",
    carousel: "نماذج من أعمالنا",
    zoom: (alt, pair) => `${alt}${pair ? " (قبل وبعد)" : ""}، تكبير`,
    of: (i, n) => `${i} من ${n}`,
    example: (i) => `النموذج ${i}`,
    num: (n) => String(n),
  },
  en: {
    all: "All",
    filterLabel: "Filter by treatment",
    hint: "Tap any photo to see it larger.",
    allExamples: "All examples",
    beforeAfter: "Before and after",
    close: "Close",
    viewer: "Image viewer",
    prev: "Previous image",
    next: "Next image",
    dragHint: "Drag the line in the middle to see before and after.",
    carousel: "Our work",
    zoom: (alt, pair) => `${alt}${pair ? " (before and after)" : ""}, enlarge`,
    of: (i, n) => `${i} of ${n}`,
    example: (i) => `Example ${i}`,
    num: (n) => String(n),
  },
};

const treatmentNames: Record<"ar" | "en", Record<Treatment, string>> = {
  ar: { composite: "فينير الكومبوزيت", veneer: "الفينير الخزفي", smile: "تصميم الابتسامة", whitening: "التبييض" },
  en: { composite: "Composite veneers", veneer: "Ceramic veneers", smile: "Smile design", whitening: "Whitening" },
};

export const treatmentLabelFor = (lang: Locale, t: Treatment) =>
  lang === "fa" ? treatments.find((x) => x.key === t)!.label : treatmentNames[lang][t];

const altText: Record<"ar" | "en", Record<string, string>> = {
  ar: {
    "smile-1": "قبل وبعد تصميم الابتسامة؛ أسنان أمامية مكسورة ومتغيّرة اللون، أصبحت بعد العلاج متناسقة وبيضاء",
    "veneer-1": "ابتسامة بفينير خزفي لامع وطبيعي، من الجانب",
    "composite-1": "قبل وبعد فينير الكومبوزيت في الفك العلوي والسفلي",
    "veneer-2": "لقطة قريبة للفينير الخزفي في الفك العلوي والسفلي بشفافية طبيعية للحواف",
    "case-1": "قبل وبعد فينير الكومبوزيت؛ أُصلحت الحواف المتشظية للأسنان الأمامية",
    "whitening-1": "تبييض الأسنان في العيادة: الأعلى قبل العلاج، والأسفل أثناء العلاج مع واقي اللثة",
    "composite-2": "ابتسامة بفينير الكومبوزيت، من الجانب",
    "case-2": "قبل وبعد الفينير الخزفي",
    "veneer-3": "لقطة قريبة للفينير في الفك العلوي",
    "composite-3": "فينير الكومبوزيت في الفك العلوي والسفلي، من الأمام",
    "case-3": "قبل وبعد تصميم الابتسامة",
  },
  en: {
    "smile-1": "Before and after smile design: broken, discoloured front teeth, even and white after treatment",
    "veneer-1": "A smile with glossy, natural-looking ceramic veneers, side view",
    "composite-1": "Before and after composite veneers on the upper and lower jaw",
    "veneer-2": "Close-up of ceramic veneers on the upper and lower jaw, with natural translucency at the edges",
    "case-1": "Before and after composite veneers: the chipped edges of the front teeth repaired",
    "whitening-1": "In-clinic whitening: top before treatment, bottom during treatment with a gum guard",
    "composite-2": "A smile with composite veneers, side view",
    "case-2": "Before and after ceramic veneers",
    "veneer-3": "Close-up of veneers on the upper jaw",
    "composite-3": "Composite veneers on the upper and lower jaw, front view",
    "case-3": "Before and after smile design",
  },
};

/** The gallery with each photo's description and treatment translated (the photos themselves are shared). */
export function galleryFor(lang: Locale): GalleryItem[] {
  if (lang === "fa") return gallery;
  return gallery.map((g) => ({ ...g, alt: altText[lang][g.id] ?? g.alt }));
}
