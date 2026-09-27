import { input } from "@/components/admin/styles";
import { dayOptions, timeOptions, todayKey } from "@/lib/admin-options";
import { freeSlots } from "@/lib/booking/service";
import { isDayKey, jalali } from "@/lib/time";
import { NewBookingForm } from "./NewBookingForm";

export const metadata = { title: "نوبت جدید" };

export default async function NewBookingPage({ searchParams }: { searchParams: Promise<{ d?: string; t?: string }> }) {
  const sp = await searchParams;
  const today = todayKey();
  const day = isDayKey(sp.d) && sp.d >= today ? sp.d : today;
  const slots = await freeSlots(day);
  const days = dayOptions(today, 60);

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-semibold">نوبت جدید</h1>
        <p className="text-sm text-muted">برای بیمارانی که تلفنی تماس می‌گیرند.</p>
      </div>
      {/* Changing the day reloads the free times (works without JavaScript too). */}
      <form method="get" className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="d" className="text-sm font-medium">
            روز
          </label>
          <select id="d" name="d" defaultValue={day} className={input}>
            {days.map((o) => (
              <option key={o.day} value={o.day}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="h-11 rounded-pill border border-primary px-4 text-sm text-primary">
          نمایش ساعت‌های آزاد
        </button>
      </form>
      <NewBookingForm
        day={day}
        dayLabel={`${jalali.weekday(day)} ${jalali.dayNumber(day)} ${jalali.month(day)}`}
        slots={slots.map((s) => ({ value: s.time, label: jalali.time(s.start) }))}
        preselect={sp.t}
        customTimes={timeOptions()}
      />
    </>
  );
}
