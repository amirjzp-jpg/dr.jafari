import Link from "next/link";
import { cancelAppointment, setOutcome } from "@/app/(fa)/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { btnDanger, btnOutline } from "@/components/admin/styles";
import { REASON_LABELS, type AppointmentRow } from "@/lib/booking/service";
import { durationLabel } from "@/lib/admin-options";
import { formatPhone } from "@/lib/phone";
import { jalali } from "@/lib/time";

export const FLASH: Record<string, { text: string; tone: "ok" | "warn" | "error" }> = {
  saved: { text: "ذخیره شد.", tone: "ok" },
  booked: { text: "نوبت ثبت شد و پیامک تأیید ارسال شد.", tone: "ok" },
  booked_nosms: { text: "نوبت ثبت شد. پیامک ارسال نشد.", tone: "warn" },
  moved: { text: "نوبت جابه‌جا شد و پیامک برای بیمار ارسال شد.", tone: "ok" },
  moved_nosms: { text: "نوبت جابه‌جا شد. پیامک ارسال نشد.", tone: "warn" },
  cancelled: { text: "نوبت لغو شد.", tone: "ok" },
  cancelled_nosms: { text: "نوبت لغو شد، اما پیامک ارسال نشد.", tone: "warn" },
  blocked: { text: "زمان بسته شد.", tone: "ok" },
  unblocked: { text: "زمان باز شد.", tone: "ok" },
  taken: { text: "این زمان با نوبت دیگری هم‌پوشانی دارد.", tone: "error" },
  pick_time: { text: "یک ساعت را انتخاب کنید.", tone: "error" },
  error: { text: "انجام نشد. صفحه را تازه کنید و دوباره تلاش کنید.", tone: "error" },
};

export function Flash({ m }: { m?: string }) {
  const f = m ? FLASH[m] : undefined;
  if (!f) return null;
  const tone =
    f.tone === "ok" ? "bg-tint text-primary" : f.tone === "warn" ? "bg-[#F3EDE3] text-[#6B4F24]" : "bg-[#F6E3E2] text-danger";
  return (
    <p role="status" className={`rounded-xl px-4 py-3 text-sm ${tone}`}>
      {f.text}
    </p>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "ثبت‌شده", cls: "bg-tint text-primary" },
  held: { label: "در حال رزرو آنلاین", cls: "bg-[#F3EDE3] text-[#6B4F24]" },
  completed: { label: "انجام شد", cls: "bg-[#E3F0E6] text-[#24583A]" },
  no_show: { label: "نیامد", cls: "bg-[#F6E3E2] text-danger" },
  cancelled: { label: "لغو شد", cls: "bg-[#EEEBE5] text-muted" },
};

export function StatusBadge({ a }: { a: AppointmentRow }) {
  if (a.source === "block") return <span className="rounded-pill bg-[#EEEBE5] px-2.5 py-0.5 text-xs text-muted-2">زمان بسته</span>;
  const s = STATUS[a.status];
  return <span className={`rounded-pill px-2.5 py-0.5 text-xs ${s.cls}`}>{s.label}</span>;
}


export function AppointmentCard({ a, back }: { a: AppointmentRow; back: string }) {
  const start = new Date(a.start_at);
  const end = new Date(a.end_at);
  const isBlock = a.source === "block";
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="ltr-nums text-lg font-medium">
          {jalali.time(start)}
          {(isBlock || end.getTime() - start.getTime() > 30 * 60_000) && ` – ${jalali.time(end)}`}
        </span>
        {!isBlock && end.getTime() - start.getTime() > 30 * 60_000 && (
          <span className="rounded-pill bg-tint px-2.5 py-0.5 text-xs text-primary">
            {durationLabel(Math.round((end.getTime() - start.getTime()) / 60_000))}
          </span>
        )}
        <StatusBadge a={a} />
        {a.source === "staff" && <span className="text-xs text-muted">ثبت توسط کلینیک</span>}
      </div>

      {isBlock ? (
        <p className="text-sm text-muted-2">{a.label ?? "بدون توضیح"}</p>
      ) : a.status === "held" ? (
        <p className="text-sm text-muted-2">
          یک بیمار در حال رزرو این ساعت است (تا {jalali.time(new Date(a.hold_expires_at!))}).
        </p>
      ) : (
        <div className="flex flex-col gap-1 text-[15px]">
          <Link href={`/admin/appointments/${a.id}`} className="font-medium text-ink">
            {a.name}
          </Link>
          <a href={`tel:${a.phone}`} className="ltr-nums self-start text-primary">
            {formatPhone(a.phone!)}
          </a>
          <span className="text-sm text-muted-2">
            {end.getTime() - start.getTime() > 30 * 60_000 ? "جلسه‌ی درمان" : "معاینه و مشاوره"} · {a.reason ? REASON_LABELS[a.reason] : "—"}
          </span>
          {a.note && <p className="rounded-lg bg-ivory px-3 py-2 text-sm text-muted-2">{a.note}</p>}
        </div>
      )}

      {a.status !== "held" && (
        <div className="flex flex-wrap gap-2">
          {!isBlock && a.status === "confirmed" && (
            <>
              <form action={setOutcome}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="outcome" value="completed" />
                <input type="hidden" name="back" value={back} />
                <ConfirmSubmit className={btnOutline}>انجام شد</ConfirmSubmit>
              </form>
              <form action={setOutcome}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="outcome" value="no_show" />
                <input type="hidden" name="back" value={back} />
                <ConfirmSubmit className={btnOutline}>نیامد</ConfirmSubmit>
              </form>
              <Link href={`/admin/appointments/${a.id}`} className={`${btnOutline} inline-flex items-center no-underline`}>
                جابه‌جایی
              </Link>
            </>
          )}
          {!isBlock && (a.status === "completed" || a.status === "no_show") && (
            <form action={setOutcome}>
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="outcome" value="confirmed" />
              <input type="hidden" name="back" value={back} />
              <ConfirmSubmit className={btnOutline}>برگرداندن</ConfirmSubmit>
            </form>
          )}
          {a.status === "confirmed" && (
            <form action={cancelAppointment} className="flex items-center gap-2">
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="back" value={back} />
              {!isBlock && <input type="hidden" name="notify" value="on" />}
              <ConfirmSubmit
                className={btnDanger}
                message={isBlock ? "این زمان باز شود؟" : `نوبت ${a.name} لغو شود؟ پیامک لغو برای بیمار ارسال می‌شود.`}
              >
                {isBlock ? "بازکردن" : "لغو"}
              </ConfirmSubmit>
            </form>
          )}
        </div>
      )}
    </li>
  );
}
