// Pure scheduling rules: which slots exist and which start times are valid.
// No database access here, so the rules are easy to test.

import { addDays, dayKeyOf, hhmmOf, minutesOf, tehranHHMM, tehranToUtc, weekdayOf, type DayKey } from "../time";

/** Appointments are always 30 minutes (docs/decisions.md). */
export const SLOT_MINUTES = 30;

export type Interval = { start: string; end: string }; // "HH:MM", Tehran time

export type ScheduleSettings = {
  /** Working intervals per weekday; 0 = Sunday … 6 = Saturday. Empty = closed. */
  weekly: Record<string, Interval[]>;
  /** How many days ahead patients can book, starting today. */
  daysAhead: number;
  /** Minimum notice for an online booking, in minutes. */
  minLeadMinutes: number;
  /** How long a hold lasts, in minutes. */
  holdMinutes: number;
};

const open: Interval[] = [
  { start: "10:00", end: "13:00" },
  { start: "14:00", end: "19:00" },
];

export const DEFAULT_SETTINGS: ScheduleSettings = {
  // Saturday to Wednesday open with a 13:00–14:00 break; Thursday and Friday closed.
  weekly: { "6": open, "0": open, "1": open, "2": open, "3": open, "4": [], "5": [] },
  daysAhead: 14,
  minLeadMinutes: 120,
  holdMinutes: 10,
};

export type Slot = {
  start: Date;
  end: Date;
  /** "HH:MM" Tehran */
  time: string;
  period: "am" | "pm";
};

export function intervalsFor(day: DayKey, s: ScheduleSettings): Interval[] {
  return s.weekly[String(weekdayOf(day))] ?? [];
}

/** Every 30-minute slot that fits inside the day's working intervals. */
export function slotsForDay(day: DayKey, s: ScheduleSettings): Slot[] {
  const slots: Slot[] = [];
  for (const iv of intervalsFor(day, s)) {
    for (let m = minutesOf(iv.start); m + SLOT_MINUTES <= minutesOf(iv.end); m += SLOT_MINUTES) {
      const time = hhmmOf(m);
      const start = tehranToUtc(day, time);
      slots.push({
        start,
        end: new Date(start.getTime() + SLOT_MINUTES * 60_000),
        time,
        // صبح up to 12:30, بعدازظهر from 13:00 (the break is 13–14).
        period: m < 13 * 60 ? "am" : "pm",
      });
    }
  }
  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** The bookable window of days, starting today in Tehran. */
export function bookableDays(now: Date, s: ScheduleSettings): DayKey[] {
  const today = dayKeyOf(now);
  return Array.from({ length: s.daysAhead }, (_, i) => addDays(today, i));
}

export type SlotCheck =
  | { ok: true; slot: Slot }
  | { ok: false; reason: "not_a_slot" | "too_soon" | "too_far" };

/** Is this an exact slot start that a patient may book right now? */
export function checkPatientSlot(start: Date, now: Date, s: ScheduleSettings): SlotCheck {
  const day = dayKeyOf(start);
  const slot = slotsForDay(day, s).find((x) => x.start.getTime() === start.getTime());
  if (!slot) return { ok: false, reason: "not_a_slot" };
  if (!bookableDays(now, s).includes(day)) return { ok: false, reason: "too_far" };
  if (start.getTime() < now.getTime() + s.minLeadMinutes * 60_000) return { ok: false, reason: "too_soon" };
  return { ok: true, slot };
}

/** Staff may book outside working hours, but only on the 30-minute grid and not in the past. */
export function checkStaffSlot(start: Date, now: Date): boolean {
  const mins = minutesOf(tehranHHMM(start));
  return mins % SLOT_MINUTES === 0 && start.getUTCSeconds() === 0 && start.getTime() > now.getTime();
}

export function validateSettings(input: unknown): ScheduleSettings | null {
  if (!input || typeof input !== "object") return null;
  const v = input as Partial<ScheduleSettings>;
  const hhmm = /^([01]\d|2[0-3]):(00|30)$/;
  if (!v.weekly || typeof v.weekly !== "object") return null;
  const weekly: Record<string, Interval[]> = {};
  for (let d = 0; d < 7; d++) {
    const list = (v.weekly as Record<string, Interval[]>)[String(d)] ?? [];
    if (!Array.isArray(list)) return null;
    const clean: Interval[] = [];
    for (const iv of list) {
      if (!iv || !hhmm.test(iv.start) || !hhmm.test(iv.end)) return null;
      if (minutesOf(iv.end) <= minutesOf(iv.start)) return null;
      clean.push({ start: iv.start, end: iv.end });
    }
    clean.sort((a, b) => minutesOf(a.start) - minutesOf(b.start));
    for (let i = 1; i < clean.length; i++) {
      if (minutesOf(clean[i].start) < minutesOf(clean[i - 1].end)) return null; // overlapping intervals
    }
    weekly[String(d)] = clean;
  }
  const int = (x: unknown, min: number, max: number) =>
    typeof x === "number" && Number.isInteger(x) && x >= min && x <= max;
  if (!int(v.daysAhead, 1, 90) || !int(v.minLeadMinutes, 0, 7 * 24 * 60) || !int(v.holdMinutes, 5, 30)) {
    return null;
  }
  return {
    weekly,
    daysAhead: v.daysAhead!,
    minLeadMinutes: v.minLeadMinutes!,
    holdMinutes: v.holdMinutes!,
  };
}
