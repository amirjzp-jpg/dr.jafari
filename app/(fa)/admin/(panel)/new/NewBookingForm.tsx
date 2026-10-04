"use client";

import { useActionState, useState } from "react";
import { createBooking, type FormState } from "@/app/(fa)/admin/actions";
import { btnPrimary, input } from "@/components/admin/styles";
import { toFaDigits } from "@/lib/digits";

type Props = {
  day: string;
  dayLabel: string;
  slots: { value: string; label: string }[];
  preselect?: string;
  customTimes: string[];
  minutes: number;
  minutesLabel: string;
};

export function NewBookingForm({ day, dayLabel, slots, preselect, customTimes, minutes, minutesLabel }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(createBooking, {});
  const [custom, setCustom] = useState(false);

  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="duration" value={minutes} />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          ساعت شروع · {dayLabel} · {minutesLabel}
        </legend>
        {!custom && (
          <>
            {slots.length === 0 ? (
              <p className="text-sm text-muted">
                در این روز ساعت کاری آزادی برای جلسه‌ای به این مدت نمانده است. روز یا مدت دیگری را انتخاب کنید، یا ساعت خارج از ساعت کاری را بزنید.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((s) => (
                  <label key={s.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="time"
                      value={s.value}
                      defaultChecked={s.value === preselect}
                      required={!custom}
                      className="peer sr-only"
                    />
                    <span className="flex h-10 items-center justify-center rounded-pill border border-line text-sm peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-primary">
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}
        {custom && (
          <select name="custom_time" required className={input} defaultValue="">
            <option value="" disabled>
              انتخاب ساعت
            </option>
            {customTimes.map((t) => (
              <option key={t} value={t}>
                {toFaDigits(t)}
              </option>
            ))}
          </select>
        )}
        <button type="button" onClick={() => setCustom((v) => !v)} className="self-start text-sm text-primary">
          {custom ? "انتخاب از ساعت‌های کاری" : "ساعت خارج از ساعت کاری"}
        </button>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          شماره موبایل بیمار
        </label>
        <input id="phone" name="phone" type="tel" inputMode="numeric" dir="ltr" required className={`${input} text-left`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          نام و نام خانوادگی
        </label>
        <input id="name" name="name" required maxLength={80} className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reason" className="text-sm font-medium">
          دلیل مراجعه
        </label>
        <select id="reason" name="reason" className={input} defaultValue="composite">
          <option value="composite">کامپوزیت</option>
          <option value="veneer">لمینت</option>
          <option value="other">سایر</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium">
          توضیحات <span className="font-normal text-muted">(اختیاری)</span>
        </label>
        <textarea id="note" name="note" rows={2} maxLength={500} className="rounded-xl border border-line bg-surface px-3 py-2 text-base" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="sms" defaultChecked className="size-4 accent-primary" />
        ارسال پیامک تأیید برای بیمار
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} self-start disabled:cursor-not-allowed disabled:bg-muted`}>
        {pending ? "در حال ثبت…" : "ثبت نوبت"}
      </button>
    </form>
  );
}
