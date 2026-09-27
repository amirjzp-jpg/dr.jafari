import Link from "next/link";
import { slotsForDay, SLOT_MINUTES } from "@/lib/booking/schedule";
import { listRange } from "@/lib/booking/service";
import { getSettings } from "@/lib/settings";
import { addDays, dayKeyOf, isDayKey, jalali, minutesOf, nowMs, tehranToUtc } from "@/lib/time";
import { toFaDigits } from "@/lib/digits";

export const metadata = { title: "هفته" };

export default async function WeekPage({ searchParams }: { searchParams: Promise<{ start?: string }> }) {
  const sp = await searchParams;
  const today = dayKeyOf(new Date());
  const first = isDayKey(sp.start) ? sp.start : today;
  const days = Array.from({ length: 7 }, (_, i) => addDays(first, i));
  const settings = await getSettings();
  const rows = await listRange(tehranToUtc(first, "00:00"), tehranToUtc(addDays(first, 7), "00:00"));

  // Rows: every working half-hour of the week. Bookings outside hours show on the day view.
  const times = new Set<string>();
  for (const d of days) for (const s of slotsForDay(d, settings)) times.add(s.time);
  const grid = [...times].sort((a, b) => minutesOf(a) - minutesOf(b));
  const now = nowMs(); // server component: rendered per request

  const cell = (day: string, time: string) => {
    const start = tehranToUtc(day, time);
    const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
    const open = slotsForDay(day, settings).some((s) => s.time === time);
    const hit = rows.find((r) => new Date(r.start_at) < end && new Date(r.end_at) > start);
    if (hit?.source === "block") return <span className="block rounded-md bg-[#EEEBE5] px-1.5 py-1 text-xs text-muted-2">بسته</span>;
    if (hit?.status === "held") return <span className="block rounded-md bg-[#F3EDE3] px-1.5 py-1 text-xs text-[#6B4F24]">نگه‌داشته</span>;
    if (hit)
      return (
        <Link
          href={`/admin/a/${hit.id}`}
          className={`block truncate rounded-md px-1.5 py-1 text-xs no-underline ${
            hit.status === "confirmed" ? "bg-primary text-white hover:text-white" : "bg-tint text-primary"
          }`}
        >
          {hit.name}
        </Link>
      );
    if (!open) return <span className="block px-1.5 py-1 text-xs text-muted">—</span>;
    if (start.getTime() < now) return <span className="block px-1.5 py-1 text-xs text-muted">گذشته</span>;
    return (
      <Link
        href={`/admin/new?d=${day}&t=${time}`}
        className="block rounded-md border border-dashed border-line px-1.5 py-1 text-xs text-muted no-underline hover:border-primary hover:text-primary"
      >
        آزاد
      </Link>
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">هفته</h1>
        <nav aria-label="هفته" className="flex gap-2 text-sm">
          <Link href={`/admin/week?start=${addDays(first, -7)}`} className="rounded-pill border border-line px-3 py-2 no-underline">
            هفته‌ی قبل
          </Link>
          <Link href={`/admin/week?start=${addDays(first, 7)}`} className="rounded-pill border border-line px-3 py-2 no-underline">
            هفته‌ی بعد
          </Link>
        </nav>
      </div>
      <p className="flex flex-wrap gap-3 text-xs text-muted-2">
        <span>
          <span className="inline-block size-3 rounded-sm bg-primary align-middle" /> ثبت‌شده
        </span>
        <span>
          <span className="inline-block size-3 rounded-sm bg-[#F3EDE3] align-middle" /> نگه‌داشته
        </span>
        <span>
          <span className="inline-block size-3 rounded-sm bg-[#EEEBE5] align-middle" /> بسته
        </span>
        <span>روی «آزاد» بزنید تا نوبت ثبت کنید.</span>
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky start-0 bg-surface p-2 text-start text-xs font-normal text-muted">ساعت</th>
              {days.map((d) => (
                <th key={d} className="p-2 text-center font-medium">
                  <Link href={`/admin?d=${d}`} className="text-ink no-underline">
                    <span className="block text-xs text-muted">{jalali.weekday(d)}</span>
                    {jalali.dayNumber(d)} {jalali.month(d)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted">
                  در این هفته ساعت کاری تعریف نشده است.
                </td>
              </tr>
            )}
            {grid.map((t) => (
              <tr key={t} className="border-t border-line">
                <th scope="row" className="sticky start-0 bg-surface p-2 text-start text-xs font-normal text-muted">
                  {toFaDigits(t)}
                </th>
                {days.map((d) => (
                  <td key={d} className="p-1 align-top">
                    {cell(d, t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        نوبت‌های خارج از ساعت کاری در صفحه‌ی «امروز» هر روز دیده می‌شوند.
      </p>
    </>
  );
}
