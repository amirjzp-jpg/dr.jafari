// Before/after cases. Real clinical photos supplied by the clinic. Photos are cropped to the mouth at matched scale and
// midline (3:2); only geometry was changed, never the teeth themselves.

export type Case = {
  title: string;
  label: string;
  before?: string;
  after?: string;
  /** e.g. «۶ دندان» — to be filled with the real case. */
  teeth?: string;
  sessions?: string;
};

export const cases: Case[] = [
  {
    title: "کامپوزیت ونیر",
    label: "نمونه‌ی ۱",
    before: "/images/cases/case-1-before.webp",
    after: "/images/cases/case-1-after.webp",
  },
  {
    title: "لمینت سرامیکی",
    label: "نمونه‌ی ۲",
    before: "/images/cases/case-2-before.webp",
    after: "/images/cases/case-2-after.webp",
  },
  {
    title: "طراحی لبخند",
    label: "نمونه‌ی ۳",
    before: "/images/cases/case-3-before.webp",
    after: "/images/cases/case-3-after.webp",
  },
];
