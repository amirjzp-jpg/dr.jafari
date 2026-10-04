"use server";

import {
  attachPhone,
  confirmBooking,
  createHold,
  getAvailability,
  getLiveHold,
  REASON_LABELS,
  REASONS,
  releaseHolds,
  upcomingForPhone,
  type Reason,
} from "@/lib/booking/service";
import {
  bookingSessionId,
  clientIp,
  forgetVerifiedPhone,
  rememberVerifiedPhone,
  verifiedPhone,
} from "@/lib/auth/session";
import { toEnDigits } from "@/lib/digits";
import { requestOtp, verifyOtp } from "@/lib/otp";
import { maskPhone, normalizePhone, PHONE_ERROR } from "@/lib/phone";
import { jalali } from "@/lib/time";

// Every rule is enforced here on the server; the client only mirrors them for UX.

export type DayView = {
  day: string;
  weekday: string;
  dayNumber: string;
  month: string;
  monthYear: string;
  open: boolean;
  slots: { start: string; label: string; period: "am" | "pm"; state: "free" | "taken" | "mine" }[];
};

export type HoldView = { id: string; start: string; label: string; expiresAt: number };

async function daysView(sessionId: string | null): Promise<DayView[]> {
  const days = await getAvailability(sessionId);
  return days.map((d) => ({
    day: d.day,
    weekday: jalali.weekday(d.day),
    dayNumber: jalali.dayNumber(d.day),
    month: jalali.month(d.day),
    monthYear: jalali.monthYear(d.day),
    open: d.open,
    slots: d.slots.map((s) => ({ start: s.start, label: jalali.time(new Date(s.start)), period: s.period, state: s.state })),
  }));
}

const holdView = (h: { id: string; start_at: Date; hold_expires_at: Date }): HoldView => ({
  id: h.id,
  start: new Date(h.start_at).toISOString(),
  label: jalali.slot(new Date(h.start_at)),
  expiresAt: new Date(h.hold_expires_at).getTime(),
});

export async function loadBooking() {
  const sessionId = await bookingSessionId(false);
  const [days, hold, phone] = await Promise.all([
    daysView(sessionId),
    sessionId ? getLiveHold(sessionId) : null,
    verifiedPhone(),
  ]);
  return {
    days,
    hold: hold ? holdView(hold) : null,
    verifiedMasked: phone ? maskPhone(phone) : null,
    serverNow: Date.now(),
  };
}

export async function refreshDays(): Promise<DayView[]> {
  return daysView(await bookingSessionId(false));
}

type Fail = { ok: false; error: string };

export async function startHold(
  startIso: string,
): Promise<{ ok: true; hold: HoldView; verifiedMasked: string | null; serverNow: number } | (Fail & { days?: DayView[] })> {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return { ok: false, error: "یک ساعت را انتخاب کنید." };
  const sessionId = (await bookingSessionId())!;
  const r = await createHold({ sessionId, start, ip: await clientIp() });
  if (!r.ok) {
    const msg = {
      taken: "این ساعت همین حالا رزرو شد. لطفاً ساعت دیگری انتخاب کنید.",
      invalid: "این ساعت دیگر قابل رزرو نیست. لطفاً ساعت دیگری انتخاب کنید.",
      rate_limited: "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید یا تماس بگیرید.",
    }[r.error];
    return { ok: false, error: msg, days: r.error === "rate_limited" ? undefined : await daysView(sessionId) };
  }

  const phone = await verifiedPhone();
  if (phone) await attachPhone(sessionId, phone);
  return {
    ok: true,
    hold: holdView({ id: r.holdId, start_at: r.start, hold_expires_at: r.expiresAt }),
    verifiedMasked: phone ? maskPhone(phone) : null,
    serverNow: Date.now(),
  };
}

export async function sendCode(phoneInput: string): Promise<{ ok: true; resendIn: number; masked: string } | Fail> {
  const phone = normalizePhone(phoneInput);
  if (!phone) return { ok: false, error: PHONE_ERROR };
  const r = await requestOtp({ phone, purpose: "booking", ip: await clientIp() });
  if (r.ok) return { ok: true, resendIn: r.resendIn, masked: maskPhone(phone) };
  if (r.error === "wait") return { ok: true, resendIn: r.resendIn, masked: maskPhone(phone) }; // a code is already on its way
  if (r.error === "too_many") return { ok: false, error: "تعداد درخواست کد زیاد است. لطفاً نیم ساعت بعد دوباره تلاش کنید یا تماس بگیرید." };
  return { ok: false, error: "ارسال پیامک ممکن نشد. لطفاً دوباره تلاش کنید یا تماس بگیرید." };
}

export async function verifyCode(phoneInput: string, codeInput: string): Promise<{ ok: true } | Fail> {
  const phone = normalizePhone(phoneInput);
  if (!phone) return { ok: false, error: PHONE_ERROR };
  const code = toEnDigits(codeInput).replace(/\D/g, "");
  if (code.length !== 5) return { ok: false, error: "کد ۵ رقمی را کامل وارد کنید." };

  const r = await verifyOtp({ phone, purpose: "booking", code, ip: await clientIp() });
  if (!r.ok) {
    const msg = {
      wrong: "کد وارد شده درست نیست.",
      expired: "این کد منقضی شده است. کد تازه‌ای دریافت کنید.",
      locked: "تعداد تلاش‌ها زیاد بود. کد تازه‌ای دریافت کنید.",
      too_many: "تعداد تلاش‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
    }[r.error];
    return { ok: false, error: msg };
  }

  await rememberVerifiedPhone(phone);
  const sessionId = await bookingSessionId();
  if (sessionId) await attachPhone(sessionId, phone);

  // Tell them now rather than after they fill in the details.
  const active = await upcomingForPhone(phone);
  if (active) {
    return {
      ok: false,
      error: `شما یک نوبت فعال دارید (${jalali.slot(new Date(active.start_at))}). برای تغییر آن با کلینیک تماس بگیرید.`,
    };
  }
  return { ok: true };
}

export async function changePhone(): Promise<void> {
  await forgetVerifiedPhone();
}

export type Summary = { slot: string; reason: string; start: string; smsSent: boolean };

export async function submitBooking(input: {
  holdId: string;
  name: string;
  reason: string;
  note: string;
  website: string; // honeypot
}): Promise<{ ok: true; summary: Summary } | (Fail & { expired?: boolean; needsPhone?: boolean })> {
  if (input.website) return { ok: false, error: "ثبت نوبت ممکن نشد." };
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "نام و نام خانوادگی را وارد کنید." };
  if (name.length > 80) return { ok: false, error: "نام وارد شده خیلی طولانی است." };
  const reason = (REASONS as string[]).includes(input.reason) ? (input.reason as Reason) : "other";

  const sessionId = await bookingSessionId(false);
  const phone = await verifiedPhone();
  if (!sessionId) return { ok: false, error: "زمان نگهداری این نوبت تمام شد.", expired: true };
  if (!phone) return { ok: false, error: "لطفاً شماره موبایل خود را دوباره تأیید کنید.", needsPhone: true };

  const r = await confirmBooking({ sessionId, holdId: input.holdId, phone, name, reason, note: input.note });
  if (!r.ok) {
    if (r.error === "expired") return { ok: false, error: "زمان نگهداری این نوبت تمام شد.", expired: true };
    if (r.error === "has_active") {
      const a = await upcomingForPhone(phone);
      const when = a ? ` (${jalali.slot(new Date(a.start_at))})` : "";
      return {
        ok: false,
        error: `شما یک نوبت فعال دارید${when}. برای تغییر آن با کلینیک تماس بگیرید.`,
      };
    }
    return { ok: false, error: "اطلاعات وارد شده کامل نیست." };
  }
  const start = new Date(r.appointment.start_at);
  return {
    ok: true,
    summary: { slot: jalali.slot(start), reason: REASON_LABELS[reason], start: start.toISOString(), smsSent: r.sms },
  };
}

export async function releaseMyHold(): Promise<void> {
  const sessionId = await bookingSessionId(false);
  if (sessionId) await releaseHolds(sessionId);
}
