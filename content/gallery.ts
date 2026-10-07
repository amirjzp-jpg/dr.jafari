// The /gallery page. Real photos supplied by the clinic; only geometry and whole-image
// colour were adjusted (crop, rotate, straighten, remove watermarks and faces), never
// the teeth themselves. Treatment labels were identified from the photos and approved
// (docs/decisions.md).

export type Treatment = "composite" | "veneer" | "smile" | "whitening";

export const treatments: { key: Treatment; label: string }[] = [
  { key: "composite", label: "کامپوزیت ونیر" },
  { key: "veneer", label: "لمینت سرامیکی" },
  { key: "smile", label: "طراحی لبخند" },
  { key: "whitening", label: "بلیچینگ" },
];

export const treatmentLabel = (t: Treatment) => treatments.find((x) => x.key === t)!.label;

type Base = { id: string; treatment: Treatment; alt: string };

/** A before/after pair (3:2, matched framing), shown with the comparison slider. */
export type PairItem = Base & { kind: "pair"; before: string; after: string; w: number; h: number };

/** A single result photo. */
export type PhotoItem = Base & { kind: "photo"; src: string; w: number; h: number };

export type GalleryItem = PairItem | PhotoItem;

/** The image a card shows: the "after" of a pair, or the photo itself. */
export const cover = (it: GalleryItem) => (it.kind === "pair" ? it.after : it.src);

export const gallery: GalleryItem[] = [
  {
    id: "smile-1",
    kind: "pair",
    treatment: "smile",
    before: "/images/gallery/smile-1-before.webp",
    after: "/images/gallery/smile-1-after.webp",
    w: 741,
    h: 494,
    alt: "قبل و بعد از طراحی لبخند؛ دندان‌های جلوی شکسته و تغییر رنگ داده، پس از درمان یکدست و سفید",
  },
  {
    id: "veneer-1",
    kind: "photo",
    treatment: "veneer",
    src: "/images/gallery/veneer-1.webp",
    w: 863,
    h: 950,
    alt: "لبخند با لمینت سرامیکی براق و طبیعی، نمای نیم‌رخ",
  },
  {
    id: "composite-1",
    kind: "pair",
    treatment: "composite",
    before: "/images/gallery/composite-1-before.webp",
    after: "/images/gallery/composite-1-after.webp",
    w: 664,
    h: 443,
    alt: "قبل و بعد از کامپوزیت ونیر در فک بالا و پایین",
  },
  {
    id: "veneer-2",
    kind: "photo",
    treatment: "veneer",
    src: "/images/gallery/veneer-2.webp",
    w: 732,
    h: 789,
    alt: "نمای نزدیک لمینت سرامیکی در فک بالا و پایین با شفافیت طبیعی لبه‌ها",
  },
  {
    id: "case-1",
    kind: "pair",
    treatment: "composite",
    before: "/images/cases/case-1-before.webp",
    after: "/images/cases/case-1-after.webp",
    w: 1200,
    h: 800,
    alt: "قبل و بعد از کامپوزیت ونیر؛ لبه‌های پریده‌ی دندان‌های جلو ترمیم شده",
  },
  {
    id: "whitening-1",
    kind: "photo",
    treatment: "whitening",
    src: "/images/gallery/whitening-1.webp",
    w: 1000,
    h: 1000,
    alt: "بلیچینگ در مطب: بالا پیش از درمان، پایین هنگام درمان با محافظ لثه",
  },
  {
    id: "composite-2",
    kind: "photo",
    treatment: "composite",
    src: "/images/gallery/composite-2.webp",
    w: 1000,
    h: 950,
    alt: "لبخند با کامپوزیت ونیر، نمای نیم‌رخ",
  },
  {
    id: "case-2",
    kind: "pair",
    treatment: "veneer",
    before: "/images/cases/case-2-before.webp",
    after: "/images/cases/case-2-after.webp",
    w: 1200,
    h: 800,
    alt: "قبل و بعد از لمینت سرامیکی",
  },
  {
    id: "veneer-3",
    kind: "photo",
    treatment: "veneer",
    src: "/images/gallery/veneer-3.webp",
    w: 1200,
    h: 1200,
    alt: "نمای نزدیک لمینت‌های فک بالا",
  },
  {
    id: "composite-3",
    kind: "photo",
    treatment: "composite",
    src: "/images/gallery/composite-3.webp",
    w: 610,
    h: 540,
    alt: "کامپوزیت ونیر در فک بالا و پایین، نمای روبه‌رو",
  },
  {
    id: "case-3",
    kind: "pair",
    treatment: "smile",
    before: "/images/cases/case-3-before.webp",
    after: "/images/cases/case-3-after.webp",
    w: 1200,
    h: 800,
    alt: "قبل و بعد از طراحی لبخند",
  },
];

/** The photo on the homepage's services section (desktop only). */
export const featuredPhoto = gallery.find((g) => g.id === "veneer-1") as PhotoItem;
