import Link from "next/link";
import { AppointmentCard, Flash } from "@/components/admin/ui";
import { listRange } from "@/lib/booking/service";
import { toFaDigits } from "@/lib/digits";
import { addDays, dayKeyOf, isDayKey, jalali, tehranToUtc } from "@/lib/time";

export const metadata = { title: "امروز" };

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ d?: string; m?: string }> }) {
  const sp = await searchParams;
  const today = dayKeyOf(new Date());
  const day = isDayKey(sp.d) ? sp.d : today;
  const rows = await listRange(tehranToUtc(day, "00:00"), tehranToUtc(addDays(day, 1), "00:00"), true);
  const patients = rows.filter((r) => r.source !== "block" && r.status !== "held");
  const active = patients.filter((r) => r.status === "confirmed").length;
  const back = `/admin?d=${day}`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{day === today ? "امروز" : jalali.weekday(day)}</h1>
          <p className="text-sm text-muted">
            {jalali.full(tehranToUtc(day, "12:00"))} · {toFaDigits(active)} نوبت فعال
          </p>
        </div>
        <nav aria-label="روز" className="flex items-center gap-2 text-sm">
          <Link href={`/admin?d=${addDays(day, -1)}`} className="rounded-pill border border-line px-3 py-2 no-underline">
            روز قبل
          </Link>
          {day !== today && (
            <Link href="/admin" className="rounded-pill border border-line px-3 py-2 no-underline">
              امروز
            </Link>
          )}
          <Link href={`/admin?d=${addDays(day, 1)}`} className="rounded-pill border border-line px-3 py-2 no-underline">
            روز بعد
          </Link>
        </nav>
      </div>
      <Flash m={sp.m} />
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">برای این روز نوبتی ثبت نشده است.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((a) => (
            <AppointmentCard key={a.id} a={a} back={back} />
          ))}
        </ul>
      )}
      <Link href={`/admin/new?d=${day}`} className="self-start text-sm">
        + نوبت جدید برای این روز
      </Link>
    </>
  );
}
