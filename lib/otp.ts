import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { otpSecret } from "./config";
import { query, tx } from "./db";
import { hit, LIMITS } from "./rate-limit";
import { sendSms } from "./sms";

// OTP rules (BUILD-SPEC.md section 7): 5 digits, stored hashed, valid 2 minutes,
// 5 attempts per code, resend after 2 minutes, at most 3 sends per phone per
// 30 minutes, plus a per-IP limit. The code never appears in any response.

export const OTP = {
  length: 5,
  ttlSeconds: 120,
  resendSeconds: 120,
  maxAttempts: 5,
  maxSendsPerWindow: 3,
  sendWindowSeconds: 30 * 60,
} as const;

export type OtpPurpose = "booking" | "admin";

function hashCode(purpose: OtpPurpose, phone: string, code: string): string {
  return createHmac("sha256", otpSecret()).update(`${purpose}:${phone}:${code}`).digest("hex");
}

export type RequestResult =
  | { ok: true; resendIn: number }
  | { ok: false; error: "wait"; resendIn: number }
  | { ok: false; error: "too_many" | "sms_failed" };

export async function requestOtp(opts: {
  phone: string;
  purpose: OtpPurpose;
  ip: string;
  /** false = pretend to send (admin login for a number not on the allowlist). */
  deliver?: boolean;
}): Promise<RequestResult> {
  const { phone, purpose, ip, deliver = true } = opts;

  const { rows } = await query<{ last_age: number | null; recent: string }>(
    `SELECT extract(epoch FROM now() - max(created_at))::float AS last_age,
            count(*) FILTER (WHERE created_at > now() - make_interval(secs => $3)) AS recent
     FROM otp_codes WHERE phone = $1 AND purpose = $2`,
    [phone, purpose, OTP.sendWindowSeconds],
  );
  const lastAge = rows[0].last_age;
  if (lastAge !== null && lastAge < OTP.resendSeconds) {
    return { ok: false, error: "wait", resendIn: Math.ceil(OTP.resendSeconds - lastAge) };
  }
  if (Number(rows[0].recent) >= OTP.maxSendsPerWindow) return { ok: false, error: "too_many" };
  if (!(await hit(`otp-send:ip:${ip}`, LIMITS.otpSendsPerIpPerHour, 3600))) return { ok: false, error: "too_many" };
  // Staff login is exempt so an attack on the public form can't lock the clinic out.
  if (purpose === "booking" && !(await hit("otp-send:booking:all", LIMITS.bookingOtpSendsPerHour, 3600))) {
    return { ok: false, error: "too_many" };
  }

  const code = String(randomInt(0, 10 ** OTP.length)).padStart(OTP.length, "0");
  await tx(async (c) => {
    // Only the newest code is valid.
    await c.query(
      "UPDATE otp_codes SET consumed_at = now() WHERE phone = $1 AND purpose = $2 AND consumed_at IS NULL",
      [phone, purpose],
    );
    await c.query(
      `INSERT INTO otp_codes (phone, purpose, code_hash, expires_at, ip)
       VALUES ($1, $2, $3, now() + make_interval(secs => $4), $5)`,
      [phone, purpose, hashCode(purpose, phone, code), OTP.ttlSeconds, ip],
    );
  });

  if (deliver) {
    const sms = await sendSms(phone, "otp", { CODE: code });
    if (!sms.ok) return { ok: false, error: "sms_failed" };
  }
  return { ok: true, resendIn: OTP.resendSeconds };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; error: "wrong"; attemptsLeft: number }
  | { ok: false; error: "expired" | "locked" | "too_many" };

export async function verifyOtp(opts: {
  phone: string;
  purpose: OtpPurpose;
  code: string;
  ip: string;
}): Promise<VerifyResult> {
  const { phone, purpose, code, ip } = opts;
  if (!(await hit(`otp-verify:ip:${ip}`, LIMITS.otpVerifiesPerIpPerHour, 3600))) {
    return { ok: false, error: "too_many" };
  }

  return tx(async (c) => {
    // Lock the row so parallel guesses can't exceed the attempt limit.
    const { rows } = await c.query<{ id: string; code_hash: string; attempts: number; expired: boolean }>(
      `SELECT id, code_hash, attempts, expires_at <= now() AS expired
       FROM otp_codes
       WHERE phone = $1 AND purpose = $2 AND consumed_at IS NULL
       ORDER BY created_at DESC LIMIT 1
       FOR UPDATE`,
      [phone, purpose],
    );
    const row = rows[0];
    if (!row || row.expired) return { ok: false, error: "expired" } as const;
    if (row.attempts >= OTP.maxAttempts) return { ok: false, error: "locked" } as const;

    const expected = Buffer.from(row.code_hash, "hex");
    const actual = Buffer.from(hashCode(purpose, phone, code), "hex");
    if (/^\d{5}$/.test(code) && timingSafeEqual(expected, actual)) {
      await c.query("UPDATE otp_codes SET consumed_at = now() WHERE id = $1", [row.id]);
      return { ok: true } as const;
    }
    await c.query("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1", [row.id]);
    const left = OTP.maxAttempts - row.attempts - 1;
    return left > 0 ? ({ ok: false, error: "wrong", attemptsLeft: left } as const) : ({ ok: false, error: "locked" } as const);
  });
}
