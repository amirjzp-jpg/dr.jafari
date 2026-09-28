"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { track } from "@/lib/analytics";
import { toEnDigits, toFaDigits } from "@/lib/digits";
import { appointmentIcs } from "@/lib/ics";
import { site } from "@/lib/site";
import {
  changePhone,
  refreshDays,
  sendCode,
  startHold,
  submitBooking,
  verifyCode,
  type DayView,
  type HoldView,
  type Summary,
} from "./actions";

type Step = 1 | 2 | 3 | 4 | 5;
type Props = {
  initialDays: DayView[];
  initialHold: HoldView | null;
  initialVerified: string | null;
  serverNow: number;
};

const REASONS = [
  { value: "composite", label: "کامپوزیت" },
  { value: "veneer", label: "لمینت" },
  { value: "other", label: "سایر" },
] as const;

const LABELS: Record<Step, string> = {
  1: "ادامه",
  2: "دریافت کد تأیید",
  3: "تأیید کد",
  4: "ثبت نوبت",
  5: "بازگشت به صفحه‌ی اصلی",
};

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (secs: number) => toFaDigits(`${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`);

export function BookingFlow({ initialDays, initialHold, initialVerified, serverNow }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [days, setDays] = useState(initialDays);
  const firstOpen = Math.max(0, initialDays.findIndex((d) => d.slots.some((s) => s.state !== "taken")));
  const [dayIdx, setDayIdx] = useState(() => {
    const i = initialHold ? initialDays.findIndex((d) => d.slots.some((s) => s.start === initialHold.start)) : -1;
    return i >= 0 ? i : firstOpen;
  });
  const [selected, setSelected] = useState<string | null>(initialHold?.start ?? null);
  const [hold, setHold] = useState<HoldView | null>(null);
  const [verified, setVerified] = useState<string | null>(initialVerified);
  const [phone, setPhone] = useState("");
  const [masked, setMasked] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState<string>("composite");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [err, setErr] = useState("");
  const [serverExpired, setExpired] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  // Server clock offset, so the countdown is right even if the device clock isn't.
  const offset = useRef(0);
  const [now, setNow] = useState(serverNow);
  const [resendAt, setResendAt] = useState(0);

  useEffect(() => {
    offset.current = serverNow - Date.now();
    const t = setInterval(() => setNow(Date.now() + offset.current), 1000);
    return () => clearInterval(t);
  }, [serverNow]);

  const holdSecs = hold ? Math.max(0, Math.floor((hold.expiresAt - now) / 1000)) : 0;
  // Hold expiry sends the patient back to the time picker with phone and name kept.
  const expired = serverExpired || (hold !== null && step >= 2 && step <= 4 && holdSecs === 0);
  const holdActive = step >= 2 && step <= 4 && !expired && hold !== null;
  const resendSecs = Math.max(0, Math.ceil((resendAt - now) / 1000));

  // Leaving the flow releases the hold (best effort; it also expires on its own).
  useEffect(() => {
    const onHide = () => {
      if (hold && step < 5) navigator.sendBeacon("/api/booking/release");
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [hold, step]);

  const errRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // Move focus to the new step's heading for screen-reader and keyboard users.
    headingRef.current?.focus();
  }, [step, expired]);

  const day = days[dayIdx];
  const am = day?.slots.filter((s) => s.period === "am") ?? [];
  const pm = day?.slots.filter((s) => s.period === "pm") ?? [];
  const noneFree = day?.open && day.slots.every((s) => s.state === "taken");

  const goto = useCallback((s: Step) => {
    setErr("");
    setStep(s);
    track("booking_step", { step: s });
  }, []);

  const reloadDays = useCallback(async () => {
    const fresh = await refreshDays();
    setDays(fresh);
  }, []);

  function onPrimary() {
    setErr("");
    if (expired) {
      track("booking_hold_expired");
      startTransition(async () => {
        await reloadDays();
        setExpired(false);
        setHold(null);
        setSelected(null);
        goto(1);
      });
      return;
    }
    if (step === 1) {
      if (!selected) return setErr("یک ساعت را انتخاب کنید.");
      startTransition(async () => {
        const r = await startHold(selected);
        if (!r.ok) {
          setErr(r.error);
          if (r.days) {
            setDays(r.days);
            setSelected(null);
          }
          return;
        }
        offset.current = r.serverNow - Date.now();
        setHold(r.hold);
        setVerified(r.verifiedMasked);
        goto(r.verifiedMasked ? 4 : 2);
      });
    } else if (step === 2) {
      const p = toEnDigits(phone).replace(/[\s-]/g, "");
      if (!/^(\+98|0098|98|0)?9\d{9}$/.test(p)) return setErr("شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.");
      startTransition(async () => {
        const r = await sendCode(phone);
        if (!r.ok) return setErr(r.error);
        setMasked(r.masked);
        setResendAt(Date.now() + offset.current + r.resendIn * 1000);
        setCode("");
        track("booking_code_sent");
        goto(3);
      });
    } else if (step === 3) {
      if (!/^\d{5}$/.test(toEnDigits(code))) return setErr("کد ۵ رقمی را کامل وارد کنید.");
      startTransition(async () => {
        const r = await verifyCode(phone, code);
        if (!r.ok) return setErr(r.error);
        setVerified(masked);
        goto(4);
      });
    } else if (step === 4) {
      if (name.trim().length < 2) return setErr("نام و نام خانوادگی را وارد کنید.");
      if (!hold) return goto(1);
      startTransition(async () => {
        const r = await submitBooking({ holdId: hold.id, name, reason, note, website });
        if (!r.ok) {
          if (r.expired) {
            setExpired(true);
            return;
          }
          if (r.needsPhone) {
            setVerified(null);
            goto(2);
          }
          return setErr(r.error);
        }
        setSummary(r.summary);
        track("booking_completed", { reason });
        goto(5);
      });
    } else {
      router.push("/");
    }
  }

  function onBack() {
    if (step === 3) return goto(2);
    if (step === 4) return goto(verified ? 1 : 3);
    if (step > 1 && step < 5) goto((step - 1) as Step);
  }

  function resend() {
    startTransition(async () => {
      const r = await sendCode(phone);
      if (!r.ok) return setErr(r.error);
      setErr("");
      setResendAt(Date.now() + offset.current + r.resendIn * 1000);
    });
  }

  function onChangePhone() {
    startTransition(async () => {
      await changePhone();
      setVerified(null);
      setCode("");
      goto(2);
    });
  }

  const icsHref = useMemo(
    () => (summary ? `data:text/calendar;charset=utf-8,${encodeURIComponent(appointmentIcs(summary.start))}` : "#"),
    [summary],
  );

  const segs = [1, 2, 3, 4].map((n) => n <= Math.min(step, 4));
  const inputBorder = err ? "border-danger" : "border-line";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-ivory">
      <header className="flex h-[60px] shrink-0 items-center gap-1 px-3">
        {step === 1 || step === 5 ? (
          <Link href="/" aria-label="بازگشت به صفحه‌ی اصلی" className="flex size-11 items-center justify-center text-ink">
            <ChevronStart />
          </Link>
        ) : (
          <button type="button" onClick={onBack} aria-label="بازگشت" className="flex size-11 items-center justify-center text-ink">
            <ChevronStart />
          </button>
        )}
        <span className="grow text-base font-medium">رزرو نوبت</span>
        {step < 5 && <span className="ps-2 pe-2 text-[13px] text-muted">مرحله‌ی {toFaDigits(Math.min(step, 4))} از ۴</span>}
      </header>

      {step < 5 && (
        <div className="flex shrink-0 gap-1.5 px-5" aria-hidden="true">
          {segs.map((on, i) => (
            <span key={i} className={`h-[3px] grow rounded-[3px] ${on ? "bg-primary" : "bg-[#E2DDD4]"}`} />
          ))}
        </div>
      )}

      {holdActive && (
        <div className="mx-5 mt-3.5 flex shrink-0 items-center gap-2.5 rounded-xl bg-tint px-3.5 py-2.5 text-[13px] text-primary">
          <ClockIcon />
          <span className="grow">{hold!.label} برای شما نگه داشته شده است</span>
          <span className="ltr-nums font-medium" aria-live="off">
            {clock(holdSecs)}
          </span>
        </div>
      )}

      <main className="flex grow flex-col gap-5 px-5 pt-6 pb-5">
        {expired ? (
          <div role="alert" className="mt-14 flex flex-col items-center gap-3.5 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#F3EDE3] text-[#8A6A3A]">
              <ClockIcon size={28} />
            </div>
            <h1 ref={headingRef} tabIndex={-1} className="font-display text-[22px] font-semibold outline-none">
              زمان نگهداری این نوبت تمام شد
            </h1>
            <p className="text-[15px] leading-[1.9] text-muted">
              اطلاعاتی که وارد کرده‌اید حفظ شده است. فقط یک زمان جدید انتخاب کنید.
            </p>
          </div>
        ) : step === 1 ? (
          <>
            <StepTitle ref={headingRef} title="زمان مراجعه را انتخاب کنید" sub="نوبت‌های آنلاین برای جلسه‌ی معاینه و مشاوره است." />
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-medium">{day?.monthYear}</span>
              <div role="group" aria-label="روز" className="-mx-5 flex gap-2 overflow-x-auto px-5 pt-0.5 pb-1.5">
                {days.map((d, i) => {
                  const sel = i === dayIdx;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      disabled={!d.open}
                      aria-pressed={sel}
                      aria-label={`${d.weekday} ${d.dayNumber} ${d.month}${d.open ? "" : "، تعطیل"}`}
                      onClick={() => {
                        setDayIdx(i);
                        setErr("");
                      }}
                      className={`flex h-[78px] w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border transition-colors disabled:opacity-45 ${
                        sel ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink"
                      }`}
                    >
                      <span className="text-xs leading-none">{d.weekday}</span>
                      <span className="text-xl leading-none font-medium">{d.dayNumber}</span>
                      <span className="text-xs leading-none">{d.open ? d.month : "تعطیل"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {day && !day.open ? (
              <p className="text-sm text-muted">کلینیک در این روز تعطیل است.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {noneFree && <p className="text-sm text-muted">برای این روز زمان خالی نمانده است. روز دیگری را انتخاب کنید.</p>}
                {am.length > 0 && <TimeGroup title="صبح" slots={am} selected={selected} onPick={setSelected} clearErr={() => setErr("")} />}
                {pm.length > 0 && (
                  <TimeGroup title="بعدازظهر" slots={pm} selected={selected} onPick={setSelected} clearErr={() => setErr("")} />
                )}
                <span className="text-xs text-muted">ساعت‌های خط‌خورده رزرو شده‌اند.</span>
              </div>
            )}
          </>
        ) : step === 2 ? (
          <>
            <StepTitle ref={headingRef} title="شماره موبایل شما" sub="کد تأیید و پیامک نوبت به این شماره ارسال می‌شود." />
            <Field id="phone" label="شماره موبایل">
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && onPrimary()}
                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                aria-invalid={!!err}
                aria-describedby={err ? "form-error" : undefined}
                className={`h-14 rounded-[14px] border bg-surface px-4 text-left text-lg text-ink ${inputBorder}`}
              />
            </Field>
          </>
        ) : step === 3 ? (
          <>
            <StepTitle
              ref={headingRef}
              title="کد تأیید را وارد کنید"
              sub={
                <>
                  کد ۵ رقمی به شماره‌ی <span className="ltr-nums">{masked}</span> پیامک شد.
                </>
              }
            />
            <Field id="otp" label="کد تأیید">
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={5}
                dir="ltr"
                value={code}
                onChange={(e) => {
                  setCode(toEnDigits(e.target.value).replace(/\D/g, "").slice(0, 5));
                  setErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && onPrimary()}
                placeholder="—————"
                aria-invalid={!!err}
                aria-describedby={err ? "form-error" : undefined}
                className={`h-[60px] rounded-[14px] border bg-surface px-4 text-center text-[26px] tracking-[14px] text-ink ${inputBorder}`}
              />
            </Field>
            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => goto(2)} className="py-2 text-primary">
                تغییر شماره
              </button>
              {resendSecs > 0 ? (
                <span className="py-2 text-muted">ارسال دوباره‌ی کد ({clock(resendSecs)})</span>
              ) : (
                <button type="button" onClick={resend} disabled={pending} className="py-2 text-primary">
                  ارسال دوباره‌ی کد
                </button>
              )}
            </div>
          </>
        ) : step === 4 ? (
          <>
            <StepTitle ref={headingRef} title="مشخصات شما" />
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
              <CalendarIcon />
              <span className="grow text-sm">{hold?.label}</span>
              <button type="button" onClick={() => goto(1)} className="py-2 text-[13px] text-primary">
                تغییر
              </button>
            </div>
            {verified && (
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="grow">
                  شماره‌ی تأییدشده: <span className="ltr-nums text-ink">{verified}</span>
                </span>
                <button type="button" onClick={onChangePhone} className="py-2 text-[13px] text-primary">
                  تغییر شماره
                </button>
              </div>
            )}
            <Field id="name" label="نام و نام خانوادگی">
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                maxLength={80}
                onChange={(e) => {
                  setName(e.target.value);
                  setErr("");
                }}
                placeholder="مریم احمدی"
                aria-invalid={!!err && name.trim().length < 2}
                aria-describedby={err ? "form-error" : undefined}
                className={`h-14 rounded-[14px] border bg-surface px-4 text-base text-ink ${
                  err && name.trim().length < 2 ? "border-danger" : "border-line"
                }`}
              />
            </Field>
            <div role="radiogroup" aria-labelledby="reason-label" className="flex flex-col gap-2.5">
              <span id="reason-label" className="text-sm font-medium">
                دلیل مراجعه
              </span>
              <div className="flex gap-2.5">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    role="radio"
                    aria-checked={reason === r.value}
                    onClick={() => setReason(r.value)}
                    className={`h-12 grow rounded-pill border text-[15px] transition-colors ${
                      reason === r.value ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <Field
              id="note"
              label={
                <>
                  توضیحات <span className="font-normal text-muted">(اختیاری)</span>
                </>
              }
            >
              <textarea
                id="note"
                rows={3}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="اگر نکته‌ای هست که بهتر است بدانیم، اینجا بنویسید."
                className="resize-none rounded-[14px] border border-line bg-surface px-4 py-3 text-[15px] leading-[1.8] text-ink"
              />
            </Field>
            {/* Honeypot: hidden from people, tempting for bots. */}
            <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
              <label htmlFor="website">وب‌سایت</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </>
        ) : (
          summary && (
            <>
              <div className="mt-9 flex flex-col items-center gap-3.5 text-center">
                <div className="flex size-[72px] items-center justify-center rounded-full bg-tint text-primary">
                  <CheckIcon />
                </div>
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-[26px] font-semibold outline-none">
                  نوبت شما ثبت شد
                </h1>
                <p className="text-[15px] leading-[1.9] text-muted">
                  {summary.smsSent ? "پیامک تأیید برای شما ارسال شد." : "نوبت شما ثبت شده است. برای اطمینان، این صفحه را نگه دارید."}
                </p>
              </div>
              <dl className="flex flex-col rounded-[20px] border border-line bg-surface px-[18px] py-1.5 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#EFEBE4] py-3.5">
                  <dt className="text-muted">زمان</dt>
                  <dd>{summary.slot}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#EFEBE4] py-3.5">
                  <dt className="text-muted">نوع مراجعه</dt>
                  <dd>معاینه و مشاوره · {summary.reason}</dd>
                </div>
                <div className="flex flex-col gap-1 border-b border-[#EFEBE4] py-3.5">
                  <dt className="text-muted">نشانی</dt>
                  <dd className="leading-[1.8]">{site.address}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3.5">
                  <dt className="text-muted">تماس</dt>
                  <dd>
                    <PhoneLink />
                  </dd>
                </div>
              </dl>
              <div className="flex gap-2.5">
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 grow items-center justify-center rounded-pill border border-primary text-sm text-primary no-underline"
                >
                  مسیریابی
                </a>
                <a
                  href={icsHref}
                  download="nobat-dr-jafari.ics"
                  className="flex h-12 grow items-center justify-center rounded-pill border border-primary text-sm text-primary no-underline"
                >
                  افزودن به تقویم
                </a>
              </div>
            </>
          )
        )}

        <div aria-live="assertive" className="contents">
          {err && (
            <p ref={errRef} id="form-error" role="alert" className="flex items-center gap-2 text-sm text-danger">
              <ErrorIcon />
              {err}
            </p>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 shrink-0 border-t border-line bg-ivory px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onPrimary}
          disabled={pending}
          aria-busy={pending}
          className="h-14 w-full rounded-pill bg-primary text-[17px] font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
        >
          {pending ? "لطفاً صبر کنید…" : expired ? "انتخاب زمان جدید" : LABELS[step]}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- pieces

function StepTitle({
  title,
  sub,
  ref,
}: {
  title: string;
  sub?: React.ReactNode;
  ref: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 ref={ref} tabIndex={-1} className="font-display text-[26px] leading-normal font-semibold outline-none">
        {title}
      </h1>
      {sub && <p className="text-sm leading-[1.8] text-muted">{sub}</p>}
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function TimeGroup({
  title,
  slots,
  selected,
  onPick,
  clearErr,
}: {
  title: string;
  slots: DayView["slots"];
  selected: string | null;
  onPick: (s: string) => void;
  clearErr: () => void;
}) {
  return (
    <>
      <span className="mt-1.5 text-sm font-medium first:mt-0">{title}</span>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((s) => {
          const taken = s.state === "taken";
          const sel = selected === s.start;
          return (
            <button
              key={s.start}
              type="button"
              disabled={taken}
              aria-pressed={sel}
              aria-label={taken ? `${s.label}، رزرو شده` : s.label}
              onClick={() => {
                onPick(s.start);
                clearErr();
              }}
              className={`h-[46px] rounded-pill border text-sm transition-colors ${
                taken
                  ? "border-[#F3F1EC] bg-[#F3F1EC] text-muted line-through"
                  : sel
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface text-ink hover:border-primary"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

const svg = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

function ChevronStart() {
  // Points to the inline-start side (right in RTL): "back".
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.6" {...svg}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function ClockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" {...svg}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.6" className="text-primary" {...svg}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.8" {...svg}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.8" className="shrink-0" {...svg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.1" />
    </svg>
  );
}
