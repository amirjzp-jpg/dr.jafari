import { expect, it } from "vitest";
import { jalali, tehranToUtc } from "@/lib/time";

it("formats Jalali dates with Persian digits", () => {
  const d = tehranToUtc("2026-09-28", "10:30");
  expect(jalali.full(d)).toBe("دوشنبه ۶ مهر ۱۴۰۵");
  expect(jalali.slot(d)).toBe("دوشنبه ۶ مهر، ساعت ۱۰:۳۰");
  expect(jalali.monthYear("2026-09-28")).toContain("مهر");
});
