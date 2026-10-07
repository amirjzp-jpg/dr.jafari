"use client";

import { useActionState, useState } from "react";
import { updateSettings, type FormState } from "@/app/(fa)/admin/actions";
import { btnPrimary, input } from "@/components/admin/styles";
import type { ScheduleSettings } from "@/lib/booking/schedule";
import { toFaDigits } from "@/lib/digits";

// Saturday first, as in the Iranian week.
const WEEK = [
  { d: 6, name: "شنبه" },
  { d: 0, name: "یکشنبه" },
  { d: 1, name: "دوشنبه" },
  { d: 2, name: "سه‌شنبه" },
  { d: 3, name: "چهارشنبه" },
  { d: 4, name: "پنجشنبه" },
  { d: 5, name: "جمعه" },
];

export function SettingsForm({ settings, times }: { settings: ScheduleSettings; times: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateSettings, {});
  const [open, setOpen] = useState<Record<number, boolean>>(
    Object.fromEntries(WEEK.map(({ d }) => [d, (settings.weekly[String(d)] ?? []).length > 0])),
  );

  const sel = (name: string, value: string | undefined, label: string) => (
    <select name={name} defaultValue={value ?? ""} aria-label={label} className={`${input} h-10 px-2 text-sm`}>
      <option value="">—</option>
      {times.map((t) => (
        <option key={t} value={t}>
          {toFaDigits(t)}
        </option>
      ))}
    </select>
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-lg font-medium">روزها و ساعت‌های کاری</legend>
        <p className="text-sm text-muted">برای هر روز تا دو بازه (پیش و پس از استراحت ظهر). ساعت‌ها روی نیم‌ساعت.</p>
        {WEEK.map(({ d, name }) => {
          const iv = settings.weekly[String(d)] ?? [];
          return (
            <div key={d} className="flex flex-wrap items-center gap-2 border-t border-line pt-2">
              <label className="flex w-28 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={`open_${d}`}
                  checked={open[d]}
                  onChange={(e) => setOpen((o) => ({ ...o, [d]: e.target.checked }))}
                  className="size-4 accent-primary"
                />
                {name}
              </label>
              {open[d] ? (
                <div className="flex flex-wrap items-center gap-1.5 text-sm">
                  {sel(`s1_${d}`, iv[0]?.start ?? "10:00", `${name}، شروع بازه‌ی اول`)}
                  <span>تا</span>
                  {sel(`e1_${d}`, iv[0]?.end ?? "13:00", `${name}، پایان بازه‌ی اول`)}
                  <span className="mx-2 text-muted">و</span>
                  {sel(`s2_${d}`, iv[1]?.start ?? (iv[0] ? undefined : "14:00"), `${name}، شروع بازه‌ی دوم`)}
                  <span>تا</span>
                  {sel(`e2_${d}`, iv[1]?.end ?? (iv[0] ? undefined : "19:00"), `${name}، پایان بازه‌ی دوم`)}
                </div>
              ) : (
                <span className="text-sm text-muted">تعطیل</span>
              )}
            </div>
          );
        })}
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <legend className="px-1 text-lg font-medium">رزرو آنلاین</legend>
        <label className="flex flex-wrap items-center gap-2 text-sm">
          بیماران می‌توانند تا
          <input name="daysAhead" type="number" min={1} max={90} defaultValue={settings.daysAhead} className={`${input} h-10 w-20`} />
          روز آینده نوبت بگیرند.
        </label>
        <label className="flex flex-wrap items-center gap-2 text-sm">
          کمترین فاصله تا نوبت:
          <select name="minLeadMinutes" defaultValue={settings.minLeadMinutes} className={`${input} h-10`}>
            {[0, 30, 60, 120, 180, 240, 720, 1440].map((m) => (
              <option key={m} value={m}>
                {m === 0 ? "بدون محدودیت" : m < 60 ? `${toFaDigits(m)} دقیقه` : `${toFaDigits(m / 60)} ساعت`}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-wrap items-center gap-2 text-sm">
          مدت نگه‌داشتن نوبت هنگام رزرو:
          <select name="holdMinutes" defaultValue={settings.holdMinutes} className={`${input} h-10`}>
            {[5, 10, 15, 20].map((m) => (
              <option key={m} value={m}>
                {toFaDigits(m)} دقیقه
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} self-start disabled:cursor-not-allowed disabled:bg-muted`}>
        {pending ? "…" : "ذخیره‌ی تنظیمات"}
      </button>
    </form>
  );
}
