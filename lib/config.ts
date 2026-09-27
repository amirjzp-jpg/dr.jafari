import "server-only";
import { normalizePhone } from "./phone";

const isProd = process.env.NODE_ENV === "production";

/** Secret for hashing OTP codes. Required in production. */
export function otpSecret(): string {
  const s = process.env.OTP_SECRET;
  if (s && s.length >= 32) return s;
  if (isProd) throw new Error("OTP_SECRET must be set (at least 32 characters)");
  return "dev-only-otp-secret-not-for-production-use";
}

/** Staff phone numbers allowed to log in to /admin (ADMIN_PHONES, comma-separated). */
export function adminPhones(): Set<string> {
  const list = (process.env.ADMIN_PHONES ?? "")
    .split(",")
    .map((p) => normalizePhone(p.trim()))
    .filter((p): p is string => p !== null);
  return new Set(list);
}

export const secureCookies = isProd;

/** True until sms.ir is configured: messages go to the server log instead of phones. */
export const smsIsMock = () => !process.env.SMSIR_API_KEY;

/**
 * Settings the booking system and staff login can't work without. Names only,
 * never values, so this is safe to show on the login page of a test deploy.
 */
export function configProblems(): string[] {
  const problems: string[] = [];
  if (!process.env.DATABASE_URL) problems.push("DATABASE_URL");
  if (isProd && (process.env.OTP_SECRET ?? "").length < 32) problems.push("OTP_SECRET");
  if (adminPhones().size === 0) problems.push("ADMIN_PHONES");
  return problems;
}
