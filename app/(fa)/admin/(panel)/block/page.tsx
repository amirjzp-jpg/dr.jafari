import { AppointmentCard, Flash } from "@/components/admin/ui";
import { dayOptions, timeOptions, todayKey } from "@/lib/admin-options";
import { query } from "@/lib/db";
import type { AppointmentRow } from "@/lib/booking/service";
import { BlockForm } from "./BlockForm";

export const metadata = { title: "بستن زمان" };

export default async function BlockPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const sp = await searchParams;
  const { rows } = await query<AppointmentRow>(
    `SELECT * FROM appointments WHERE source = 'block' AND status = 'confirmed' AND end_at > now()
     ORDER BY start_at LIMIT 100`,
  );
  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-semibold">بستن زمان</h1>
        <p className="text-sm text-muted">برای تعطیلی، مرخصی یا کارهای کلینیک. در زمان بسته، رزرو آنلاین ممکن نیست.</p>
      </div>
      <Flash m={sp.m} />
      <BlockForm days={dayOptions(todayKey(), 120)} times={timeOptions(0, 24)} />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">زمان‌های بسته‌ی پیش رو</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted">زمان بسته‌ای ثبت نشده است.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((a) => (
              <AppointmentCard key={a.id} a={a} back="/admin/block" />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
