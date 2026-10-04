"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { blockTime, type FormState } from "@/app/(fa)/admin/actions";
import { btnPrimary, input } from "@/components/admin/styles";
import { toFaDigits } from "@/lib/digits";

export function BlockForm({ days, times }: { days: { day: string; label: string }[]; times: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(blockTime, {});
  const [mode, setMode] = useState<"day" | "range">("day");

  return (
    <form action={action} className="flex max-w-[560px] flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="day" className="text-sm font-medium">
          روز
        </label>
        <select id="day" name="day" className={input}>
          {days.map((d) => (
            <option key={d.day} value={d.day}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="flex gap-4 text-sm">
        <legend className="mb-2 text-sm font-medium">بازه</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="day" checked={mode === "day"} onChange={() => setMode("day")} className="accent-primary" />
          کل روز
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="range" checked={mode === "range"} onChange={() => setMode("range")} className="accent-primary" />
          چند ساعت یا یک نوبت
        </label>
      </fieldset>
      {mode === "range" && (
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="from" className="text-sm">
              از ساعت
            </label>
            <select id="from" name="from" className={input} defaultValue="10:00">
              {times.slice(0, -1).map((t) => (
                <option key={t} value={t}>
                  {toFaDigits(t)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="to" className="text-sm">
              تا ساعت
            </label>
            <select id="to" name="to" className={input} defaultValue="10:30">
              {times.slice(1).map((t) => (
                <option key={t} value={t}>
                  {toFaDigits(t)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="label" className="text-sm font-medium">
          توضیح <span className="font-normal text-muted">(اختیاری، مثلاً «تعطیلی رسمی»)</span>
        </label>
        <input id="label" name="label" maxLength={80} className={input} />
      </div>
      {state.error && (
        <div role="alert" className="flex flex-col gap-2 text-sm text-danger">
          <p>{state.error}</p>
          {state.conflicts && (
            <ul className="list-inside list-disc text-ink">
              {state.conflicts.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/appointments/${c.id}`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} self-start disabled:cursor-not-allowed disabled:bg-muted`}>
        {pending ? "…" : "بستن این زمان"}
      </button>
    </form>
  );
}
