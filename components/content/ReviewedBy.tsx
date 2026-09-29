import { site } from "@/lib/site";
import { jalali, tehranToUtc } from "@/lib/time";

/**
 * Who stands behind a medical page. Shown once the doctor has approved the copy
 * (`reviewed`), with the date of that review; the same date feeds the page's
 * structured data. The date is Gregorian ISO in the markup, Jalali on screen.
 */
export function ReviewedBy({ reviewed, date }: { reviewed: boolean; date: string }) {
  if (!reviewed) return null;
  return (
    <p className="text-[13px] leading-[1.9] text-muted">
      بازبینی‌شده توسط {site.name}، دندانپزشک زیبایی، نظام پزشکی {site.councilNumber} · آخرین بازبینی:{" "}
      <time dateTime={date}>{jalali.full(tehranToUtc(date, "12:00"))}</time>
    </p>
  );
}
