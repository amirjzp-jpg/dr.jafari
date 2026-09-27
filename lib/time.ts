// All times are stored in UTC and shown in Asia/Tehran. Offsets come from the
// runtime's tz database, so a future DST change needs no code change.

export const TZ = "Asia/Tehran";

/** Current time in ms. A named helper so server components can read the clock per request. */
export const nowMs = () => Date.now();

/** A calendar day in Tehran, as "YYYY-MM-DD" (Gregorian). Used as a stable key. */
export type DayKey = string;

const partsFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
});

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function tehranParts(date: Date) {
  const p: Record<string, string> = {};
  for (const { type, value } of partsFmt.formatToParts(date)) p[type] = value;
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    weekday: WEEKDAYS[p.weekday], // 0 = Sunday … 6 = Saturday
  };
}

function offsetMinutes(date: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")!.value; // e.g. "GMT+03:30"
  const m = name.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** Tehran wall-clock time → UTC instant. */
export function tehranToUtc(day: DayKey, hhmm: string): Date {
  const [y, mo, d] = day.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let result = guess - offsetMinutes(new Date(guess)) * 60_000;
  // Re-check with the offset at the result, in case the guess crossed a transition.
  result = guess - offsetMinutes(new Date(result)) * 60_000;
  return new Date(result);
}

export function dayKeyOf(date: Date): DayKey {
  const p = tehranParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function addDays(day: DayKey, n: number): DayKey {
  const [y, m, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

export function weekdayOf(day: DayKey): number {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isDayKey(v: unknown): v is DayKey {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

/** "HH:MM" in Tehran. */
export function tehranHHMM(date: Date): string {
  const p = tehranParts(date);
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function hhmmOf(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

// ---- Jalali display (Intl has the Persian calendar and Persian digits built in) ----

const fa = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", { timeZone: TZ, ...opts });

const fmtWeekday = fa({ weekday: "long" });
const fmtDayNum = fa({ day: "numeric" });
const fmtMonth = fa({ month: "long" });
const fmtMonthYear = fa({ month: "long", year: "numeric" });
const fmtDayMonth = fa({ day: "numeric", month: "long" });
const fmtYear = fa({ year: "numeric" });
const fmtTime = fa({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Noon avoids any edge effects when formatting a whole day. */
const dayDate = (day: DayKey) => tehranToUtc(day, "12:00");

export const jalali = {
  weekday: (day: DayKey) => fmtWeekday.format(dayDate(day)),
  dayNumber: (day: DayKey) => fmtDayNum.format(dayDate(day)),
  month: (day: DayKey) => fmtMonth.format(dayDate(day)),
  monthYear: (day: DayKey) => fmtMonthYear.format(dayDate(day)),
  /** «۵ مهر» */
  dayMonth: (d: Date) => fmtDayMonth.format(d),
  /** «یکشنبه ۵ مهر ۱۴۰۵» */
  full: (d: Date) => `${fmtWeekday.format(d)} ${fmtDayMonth.format(d)} ${fmtYear.format(d).replace(/\s*ه\.ش\.?/, "")}`,
  /** «۱۰:۳۰» */
  time: (d: Date) => fmtTime.format(d),
  /** «یکشنبه ۵ مهر، ساعت ۱۰:۳۰» — the slot label used in booking. */
  slot: (d: Date) => `${fmtWeekday.format(d)} ${fmtDayMonth.format(d)}، ساعت ${fmtTime.format(d)}`,
};
