"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import {
  endAdminSession,
  clientIp,
  requireAdmin,
  startAdminSession,
} from "@/lib/auth/session";
import { validateSettings } from "@/lib/booking/schedule";
import {
  REASONS,
  staffBlock,
  staffBook,
  staffCancel,
  staffMove,
  staffSetOutcome,
  type AppointmentRow,
  type Reason,
} from "@/lib/booking/service";
import { adminPhones } from "@/lib/config";
import { toEnDigits, toFaDigits } from "@/lib/digits";
import { requestOtp, verifyOtp } from "@/lib/otp";
import { normalizePhone, PHONE_ERROR } from "@/lib/phone";
import { saveSettings } from "@/lib/settings";
import { addDays, dayKeyOf, isDayKey, jalali, tehranToUtc } from "@/lib/time";

// Every action re-checks the staff session; never rely on the page having done it.

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

// ---------------------------------------------------------------- login

export type LoginState = { step: "phone" | "code"; phone: string; error?: string; info?: string };

export async function adminLogin(prev: LoginState, form: FormData): Promise<LoginState> {
  try {
    return await adminLoginStep(prev, form);
  } catch (err) {
    // redirect() works by throwing; let it through.
    if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) throw err;
    console.error("[admin login]", err);
    return { ...prev, error: "خطای سرور. لطفاً دوباره تلاش کنید؛ اگر تکرار شد، Logs را در Vercel ببینید." };
  }
}

async function adminLoginStep(prev: LoginState, form: FormData): Promise<LoginState> {
  const ip = await clientIp();
  if (prev.step === "phone" || form.get("resend")) {
    const phone = normalizePhone(str(form, "phone") || prev.phone);
    if (!phone) return { step: "phone", phone: "", error: PHONE_ERROR };
    // Same response whether or not the number is on the staff list.
    const r = await requestOtp({ phone, purpose: "admin", ip, deliver: adminPhones().has(phone) });
    if (!r.ok && r.error === "too_many") {
      return { step: "phone", phone, error: "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید." };
    }
    if (!r.ok && r.error === "sms_failed") return { step: "phone", phone, error: "ارسال پیامک ممکن نشد." };
    if (!r.ok && r.error === "wait") {
      return {
        step: "code",
        phone,
        info: `کدی که کمی پیش فرستاده شد را وارد کنید، یا ${toFaDigits(r.resendIn)} ثانیه‌ی دیگر کد تازه بخواهید.`,
      };
    }
    return { step: "code", phone, info: "اگر این شماره در فهرست کارکنان باشد، کد ورود پیامک می‌شود." };
  }

  const phone = normalizePhone(prev.phone);
  const code = toEnDigits(str(form, "code")).replace(/\D/g, "");
  if (!phone) return { step: "phone", phone: "", error: PHONE_ERROR };
  if (code.length !== 5) return { ...prev, error: "کد ۵ رقمی را کامل وارد کنید." };
  const r = await verifyOtp({ phone, purpose: "admin", code, ip });
  if (!r.ok || !adminPhones().has(phone)) {
    const error =
      !r.ok && r.error === "locked"
        ? "تعداد تلاش‌ها زیاد بود. کد تازه‌ای دریافت کنید."
        : !r.ok && r.error === "expired"
          ? "کد منقضی شده است. کد تازه‌ای دریافت کنید."
          : "کد وارد شده درست نیست.";
    return { ...prev, error };
  }
  await startAdminSession(phone);
  await audit(phone, "staff.login", null, null);
  redirect("/admin");
}

export async function adminLogout() {
  await endAdminSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- appointments

function back(to: string, m: string): never {
  redirect(`${to}${to.includes("?") ? "&" : "?"}m=${m}`);
}

function safeBack(f: FormData, fallback = "/admin") {
  const b = str(f, "back");
  return b.startsWith("/admin") && !b.startsWith("//") ? b : fallback;
}

export async function setOutcome(form: FormData) {
  const actor = await requireAdmin();
  const outcome = str(form, "outcome");
  if (outcome !== "completed" && outcome !== "no_show" && outcome !== "confirmed") back(safeBack(form), "error");
  const r = await staffSetOutcome({ id: str(form, "id"), outcome, actor });
  back(safeBack(form), r.ok ? "saved" : r.error === "taken" ? "taken" : "error");
}

export async function cancelAppointment(form: FormData) {
  const actor = await requireAdmin();
  const r = await staffCancel({ id: str(form, "id"), notify: form.get("notify") === "on", actor });
  if (!r.ok) back(safeBack(form), "error");
  back(safeBack(form), r.appointment.source === "block" ? "unblocked" : r.sms === false ? "cancelled_nosms" : "cancelled");
}

export async function moveAppointment(form: FormData) {
  const actor = await requireAdmin();
  const id = str(form, "id");
  const start = new Date(str(form, "start"));
  if (Number.isNaN(start.getTime())) back(`/admin/a/${id}`, "pick_time");
  const r = await staffMove({ id, start, notify: form.get("notify") === "on", actor });
  if (!r.ok) back(`/admin/a/${id}`, r.error === "taken" ? "taken" : "error");
  back(`/admin?d=${dayKeyOf(start)}`, r.sms === false ? "moved_nosms" : "moved");
}

export type FormState = { error?: string; conflicts?: { id: string; label: string }[] };

export async function createBooking(_: FormState, form: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const phone = normalizePhone(str(form, "phone"));
  if (!phone) return { error: PHONE_ERROR };
  const name = str(form, "name");
  if (name.length < 2) return { error: "نام بیمار را وارد کنید." };
  const reason = (REASONS as string[]).includes(str(form, "reason")) ? (str(form, "reason") as Reason) : "other";

  const day = str(form, "day");
  const time = str(form, "custom_time") || str(form, "time");
  if (!isDayKey(day) || !/^\d{2}:\d{2}$/.test(time)) return { error: "روز و ساعت را انتخاب کنید." };
  const start = tehranToUtc(day, time);

  const r = await staffBook({
    start,
    phone,
    name,
    reason,
    note: str(form, "note") || null,
    sendConfirmation: form.get("sms") === "on",
    actor,
  });
  if (!r.ok) {
    return {
      error:
        r.error === "taken"
          ? "این زمان با نوبت یا زمان بسته‌ی دیگری هم‌پوشانی دارد."
          : "ساعت باید روی بازه‌های ۳۰ دقیقه‌ای و در آینده باشد.",
    };
  }
  back(`/admin?d=${day}`, r.sms === false ? "booked_nosms" : "booked");
}

export async function blockTime(_: FormState, form: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const day = str(form, "day");
  if (!isDayKey(day)) return { error: "روز را انتخاب کنید." };
  const whole = str(form, "mode") === "day";
  const from = whole ? "00:00" : str(form, "from");
  const to = whole ? "24:00" : str(form, "to");
  if (!/^\d{2}:\d{2}$/.test(from) || !/^\d{2}:\d{2}$/.test(to)) return { error: "بازه‌ی زمانی را انتخاب کنید." };
  const start = tehranToUtc(day, from);
  const end = to === "24:00" ? tehranToUtc(addDays(day, 1), "00:00") : tehranToUtc(day, to);
  if (end <= start) return { error: "ساعت پایان باید بعد از ساعت شروع باشد." };

  const r = await staffBlock({ start, end, label: str(form, "label") || null, actor });
  if (!r.ok) {
    if (r.error === "conflicts") {
      return {
        error: "در این بازه نوبت ثبت‌شده وجود دارد. ابتدا آن‌ها را جابه‌جا یا لغو کنید:",
        conflicts: (r.conflicts ?? []).map((c: AppointmentRow) => ({
          id: c.id,
          label: `${jalali.slot(new Date(c.start_at))} — ${c.source === "block" ? "زمان بسته" : c.status === "held" ? "در حال رزرو آنلاین" : (c.name ?? "")}`,
        })),
      };
    }
    return { error: "بازه‌ی زمانی درست نیست." };
  }
  back("/admin/block", "blocked");
}

// ---------------------------------------------------------------- settings

export async function updateSettings(_: FormState, form: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const weekly: Record<string, { start: string; end: string }[]> = {};
  for (let d = 0; d < 7; d++) {
    if (form.get(`open_${d}`) !== "on") {
      weekly[d] = [];
      continue;
    }
    const list = [];
    for (const i of [1, 2]) {
      const s = str(form, `s${i}_${d}`);
      const e = str(form, `e${i}_${d}`);
      if (s && e) list.push({ start: s, end: e });
    }
    weekly[d] = list;
  }
  const settings = validateSettings({
    weekly,
    daysAhead: Number(str(form, "daysAhead")),
    minLeadMinutes: Number(str(form, "minLeadMinutes")),
    holdMinutes: Number(str(form, "holdMinutes")),
  });
  if (!settings) {
    return { error: "تنظیمات درست نیست. ساعت‌ها باید روی نیم‌ساعت باشند، پایان بعد از شروع باشد و بازه‌ها هم‌پوشانی نداشته باشند." };
  }
  await saveSettings(settings);
  await audit(actor, "staff.settings", null, settings as unknown as Record<string, unknown>);
  back("/admin/settings", "saved");
}
