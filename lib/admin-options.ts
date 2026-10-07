import { toFaDigits } from "./digits";
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

/** «۳۰ دقیقه», «۱ ساعت», «۱ ساعت و ۳۰ دقیقه», «۲ ساعت» … */
export function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${toFaDigits(m)} دقیقه`;
  return m ? `${toFaDigits(h)} ساعت و ${toFaDigits(m)} دقیقه` : `${toFaDigits(h)} ساعت`;
}

/** Minutes between an appointment's start and end. */
export const lengthOf = (a: { start_at: Date | string; end_at: Date | string }) =>
  Math.round((new Date(a.end_at).getTime() - new Date(a.start_at).getTime()) / 60_000);
