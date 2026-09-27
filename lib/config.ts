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
