import { addDays, dayKeyOf, hhmmOf, jalali, type DayKey } from "./time";

/** Day choices for staff pickers, with Jalali labels. */
export function dayOptions(from: DayKey, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const day = addDays(from, i);
    return { day, label: `${jalali.weekday(day)} ${jalali.dayNumber(day)} ${jalali.month(day)}` };
  });
}

/** Half-hour times across the day, for staff forms. */
export function timeOptions(fromHour = 7, toHour = 23) {
  const out: string[] = [];
  for (let m = fromHour * 60; m <= toHour * 60; m += 30) out.push(hhmmOf(m));
  return out;
}

export const todayKey = () => dayKeyOf(new Date());
