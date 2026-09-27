// Before/after cases. Real clinical photos only, with written patient consent
// (TODO-content.md). Until then the frames show labelled placeholders.

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
  { title: "کامپوزیت ونیر", label: "نمونه‌ی ۱" },
  { title: "لمینت سرامیکی", label: "نمونه‌ی ۲" },
  { title: "طراحی لبخند", label: "نمونه‌ی ۳" },
];
