import "server-only";
import { databaseUrl } from "./database-url.mjs";
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

/**
 * True while staff login codes still go to the server log: until both the sms.ir
 * key and the OTP template ID are set (each message type goes live on its own,
 * see lib/sms).
 */
export const smsIsMock = () => !process.env.SMSIR_API_KEY || !(Number(process.env.SMSIR_TEMPLATE_OTP) > 0);

/**
 * Settings the booking system and staff login can't work without. Names only,
 * never values, so this is safe to show on the login page of a test deploy.
 */
export function configProblems(): string[] {
  const problems: string[] = [];
  if (!databaseUrl()) problems.push("DATABASE_URL");
  if (isProd && (process.env.OTP_SECRET ?? "").length < 32) problems.push("OTP_SECRET");
  if (adminPhones().size === 0) problems.push("ADMIN_PHONES");
  return problems;
}

/** Which deployment is answering, so a stale or wrong-environment URL is easy to spot. */
export function deploymentInfo() {
  return {
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || null,
    host: process.env.VERCEL_URL ?? null,
    builtAt: process.env.BUILD_TIME
      ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tehran", dateStyle: "medium", timeStyle: "short" }).format(
          new Date(process.env.BUILD_TIME),
        ) + " Tehran"
      : null,
    // Names that look like one of ours but aren't exact (typos, case, spaces). Names only, never values.
    nearMisses: Object.keys(process.env).filter(
      (k) => /admin.?phone|otp|database.?url/i.test(k) && !["ADMIN_PHONES", "OTP_SECRET", "DATABASE_URL"].includes(k),
    ),
  };
}
