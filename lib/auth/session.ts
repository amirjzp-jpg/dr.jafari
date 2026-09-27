import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminPhones, secureCookies } from "../config";
import { query } from "../db";

// Opaque random tokens in httpOnly cookies; only their SHA-256 is stored.

const token = () => randomBytes(32).toString("base64url");
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

const COOKIE = {
  booking: "bk_sid",
  device: "bk_dev",
  admin: "adm",
} as const;

const base = { httpOnly: true, secure: secureCookies, sameSite: "lax" as const, path: "/" };

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// ---------------------------------------------------------------- booking session

/** The anonymous booking-session id that owns holds. Created on first use. */
export async function bookingSessionId(create = true): Promise<string | null> {
  const jar = await cookies();
  const existing = jar.get(COOKIE.booking)?.value;
  if (existing && /^[A-Za-z0-9_-]{43}$/.test(existing)) return existing;
  if (!create) return null;
  const id = token();
  jar.set(COOKIE.booking, id, { ...base, maxAge: 60 * 60 * 24 });
  return id;
}

// ---------------------------------------------------------------- verified patient device (30 days)

const DEVICE_DAYS = 30;

export async function rememberVerifiedPhone(phone: string): Promise<void> {
  const t = token();
  await query(
    "INSERT INTO verified_devices (token_hash, phone, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))",
    [sha256(t), phone, DEVICE_DAYS],
  );
  (await cookies()).set(COOKIE.device, t, { ...base, maxAge: 60 * 60 * 24 * DEVICE_DAYS });
}

export async function verifiedPhone(): Promise<string | null> {
  const t = (await cookies()).get(COOKIE.device)?.value;
  if (!t) return null;
  const { rows } = await query<{ phone: string }>(
    "SELECT phone FROM verified_devices WHERE token_hash = $1 AND expires_at > now()",
    [sha256(t)],
  );
  return rows[0]?.phone ?? null;
}

export async function forgetVerifiedPhone(): Promise<void> {
  const jar = await cookies();
  const t = jar.get(COOKIE.device)?.value;
  if (t) await query("DELETE FROM verified_devices WHERE token_hash = $1", [sha256(t)]);
  jar.delete(COOKIE.device);
}

// ---------------------------------------------------------------- staff session (12 hours)

const ADMIN_HOURS = 12;

export async function startAdminSession(phone: string): Promise<void> {
  const t = token();
  const h = await headers();
  await query(
    `INSERT INTO admin_sessions (token_hash, phone, expires_at, ip, user_agent)
     VALUES ($1, $2, now() + make_interval(hours => $3), $4, $5)`,
    [sha256(t), phone, ADMIN_HOURS, await clientIp(), h.get("user-agent")?.slice(0, 300) ?? null],
  );
  (await cookies()).set(COOKIE.admin, t, { ...base, maxAge: 60 * 60 * ADMIN_HOURS });
}

/** The logged-in staff phone, or null. Removed numbers lose access immediately. */
export async function adminPhone(): Promise<string | null> {
  const t = (await cookies()).get(COOKIE.admin)?.value;
  if (!t) return null;
  const { rows } = await query<{ phone: string }>(
    "SELECT phone FROM admin_sessions WHERE token_hash = $1 AND expires_at > now()",
    [sha256(t)],
  );
  const phone = rows[0]?.phone;
  return phone && adminPhones().has(phone) ? phone : null;
}

/** Use at the top of every admin page and action. */
export async function requireAdmin(): Promise<string> {
  const phone = await adminPhone();
  if (!phone) redirect("/admin/login");
  return phone;
}

export async function endAdminSession(): Promise<void> {
  const jar = await cookies();
  const t = jar.get(COOKIE.admin)?.value;
  if (t) await query("DELETE FROM admin_sessions WHERE token_hash = $1", [sha256(t)]);
  jar.delete(COOKIE.admin);
}
