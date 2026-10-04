import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelAppointment, moveAppointment } from "@/app/(fa)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { btnDanger, btnPrimary, input } from "@/components/admin/styles";
import { Flash, StatusBadge } from "@/components/admin/ui";
import { dayOptions, durationLabel, lengthOf, todayKey } from "@/lib/admin-options";
import { freeSlots, getAppointment, REASON_LABELS } from "@/lib/booking/service";
import { formatPhone } from "@/lib/phone";
import { dayKeyOf, isDayKey, jalali } from "@/lib/time";

export const metadata = { title: "جزئیات نوبت" };

export default async function AppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ d?: string; m?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const a = await getAppointment(id);
  if (!a || a.source === "block") notFound();

  const start = new Date(a.start_at);
  const today = todayKey();
  const moveDay = isDayKey(sp.d) && sp.d >= today ? sp.d : dayKeyOf(start) >= today ? dayKeyOf(start) : today;
  const canChange = a.status === "confirmed";
  const minutes = lengthOf(a);
  const slots = canChange ? await freeSlots(moveDay, a.id, minutes) : [];
  const back = `/admin?d=${dayKeyOf(start)}`;

  return (
    <>
      <Link href={back} className="self-start text-sm">
        → بازگشت به روز
      </Link>
      <Flash m={sp.m} />
      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold">{a.name}</h1>
          <StatusBadge a={a} />
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
          <dt className="text-muted">زمان</dt>
          <dd>
            {jalali.slot(start)}
            {minutes > 30 && ` تا ${jalali.time(new Date(a.end_at))}`}
          </dd>
          <dt className="text-muted">مدت</dt>
          <dd>{durationLabel(minutes)}</dd>
          <dt className="text-muted">تلفن</dt>
          <dd>
            <a href={`tel:${a.phone}`} className="ltr-nums">
              {formatPhone(a.phone!)}
            </a>
          </dd>
          <dt className="text-muted">دلیل مراجعه</dt>
          <dd>{minutes > 30 ? "جلسه‌ی درمان" : "معاینه و مشاوره"} · {a.reason ? REASON_LABELS[a.reason] : "—"}</dd>
          <dt className="text-muted">ثبت</dt>
          <dd>{a.source === "staff" ? "توسط کلینیک" : "آنلاین"} · {jalali.slot(new Date(a.created_at))}</dd>
          {a.note && (
            <>
              <dt className="text-muted">توضیحات</dt>
              <dd>{a.note}</dd>
            </>
          )}
        </dl>
      </section>

      {canChange && (
        <>
          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-lg font-medium">جابه‌جایی نوبت</h2>
            <form method="get" className="flex flex-wrap items-end gap-2">
              <label htmlFor="d" className="sr-only">
                روز جدید
              </label>
              <select id="d" name="d" defaultValue={moveDay} className={input}>
                {dayOptions(today, 60).map((o) => (
                  <option key={o.day} value={o.day}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="h-11 rounded-pill border border-primary px-4 text-sm text-primary">
                نمایش ساعت‌های آزاد
              </button>
            </form>
            <form action={moveAppointment} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={a.id} />
              {slots.length === 0 ? (
                <p className="text-sm text-muted">ساعت آزادی در این روز نیست.</p>
              ) : (
                <fieldset>
                  <legend className="sr-only">ساعت جدید</legend>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {slots.map((s) => (
                      <label key={s.start.toISOString()} className="cursor-pointer">
                        <input type="radio" name="start" value={s.start.toISOString()} required className="peer sr-only" />
                        <span className="flex h-10 items-center justify-center rounded-pill border border-line text-sm peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-primary">
                          {jalali.time(s.start)}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="notify" defaultChecked className="size-4 accent-primary" />
                ارسال پیامک تغییر زمان برای بیمار
              </label>
              <ConfirmSubmit className={`${btnPrimary} self-start`} message="نوبت به ساعت انتخاب‌شده منتقل شود؟">
                جابه‌جا کن
              </ConfirmSubmit>
            </form>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-lg font-medium">لغو نوبت</h2>
            <form action={cancelAppointment} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="back" value={back} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="notify" defaultChecked className="size-4 accent-primary" />
                ارسال پیامک لغو برای بیمار
              </label>
              <ConfirmSubmit className={`${btnDanger} self-start`} message={`نوبت ${a.name} لغو شود؟`}>
                لغو نوبت
              </ConfirmSubmit>
            </form>
          </section>
        </>
      )}
    </>
  );
}
