import { afterAll, describe, expect, it } from "vitest";
import { pool, query } from "@/lib/db";
import { requestOtp, verifyOtp } from "@/lib/otp";
import { captureSms, ip } from "./helpers";

afterAll(async () => {
  await pool().end();
});

async function send(phone: string) {
  const sms = captureSms();
  const r = await requestOtp({ phone, purpose: "booking", ip: ip() });
  sms.restore();
  return { r, code: sms.sent.find((s) => s.template === "otp")?.params.CODE };
}

describe("OTP", () => {
  it("a failed SMS leaves no code behind, so the user can retry straight away", async () => {
    const phone = "09350000099";
    const saved = { key: process.env.SMSIR_API_KEY, env: process.env.NODE_ENV };
    delete process.env.SMSIR_API_KEY;
    (process.env as Record<string, string>).NODE_ENV = "production";
    const fail = await requestOtp({ phone, purpose: "booking", ip: ip() });
    (process.env as Record<string, string | undefined>).NODE_ENV = saved.env;
    if (saved.key) process.env.SMSIR_API_KEY = saved.key;
    expect(fail).toEqual({ ok: false, error: "sms_failed" });
    const { rows } = await query("SELECT 1 FROM otp_codes WHERE phone = $1", [phone]);
    expect(rows).toHaveLength(0);
    const retry = await send(phone);
    expect(retry.r).toEqual({ ok: true, resendIn: 120 });
  });

  it("stores only a hash and verifies the right code once", async () => {
    const phone = "09350000001";
    const { r, code } = await send(phone);
    expect(r).toEqual({ ok: true, resendIn: 120 });
    expect(code).toMatch(/^\d{5}$/);
    const { rows } = await query("SELECT code_hash FROM otp_codes WHERE phone = $1", [phone]);
    expect(rows[0].code_hash).not.toContain(code);
    expect(rows[0].code_hash).toHaveLength(64);

    expect(await verifyOtp({ phone, purpose: "booking", code: code!, ip: ip() })).toEqual({ ok: true });
    expect(await verifyOtp({ phone, purpose: "booking", code: code!, ip: ip() })).toEqual({ ok: false, error: "expired" });
  });

  it("locks after 5 wrong attempts", async () => {
    const phone = "09350000002";
    const { code } = await send(phone);
    const wrong = code === "00000" ? "11111" : "00000";
    for (let i = 4; i >= 1; i--) {
      expect(await verifyOtp({ phone, purpose: "booking", code: wrong, ip: ip() })).toEqual({ ok: false, error: "wrong", attemptsLeft: i });
    }
    expect(await verifyOtp({ phone, purpose: "booking", code: wrong, ip: ip() })).toEqual({ ok: false, error: "locked" });
    expect(await verifyOtp({ phone, purpose: "booking", code: code!, ip: ip() })).toEqual({ ok: false, error: "locked" });
  });

  it("parallel guesses can't exceed the attempt limit", async () => {
    const phone = "09350000005";
    const { code } = await send(phone);
    const wrong = code === "00000" ? "11111" : "00000";
    await Promise.all(Array.from({ length: 10 }, () => verifyOtp({ phone, purpose: "booking", code: wrong, ip: ip() })));
    const { rows } = await query("SELECT attempts FROM otp_codes WHERE phone = $1", [phone]);
    expect(rows[0].attempts).toBe(5);
  });

  it("expires after 2 minutes", async () => {
    const phone = "09350000003";
    const { code } = await send(phone);
    await query("UPDATE otp_codes SET expires_at = now() - interval '1 second' WHERE phone = $1", [phone]);
    expect(await verifyOtp({ phone, purpose: "booking", code: code!, ip: ip() })).toEqual({ ok: false, error: "expired" });
  });

  it("enforces the resend wait and 3 sends per 30 minutes", async () => {
    const phone = "09350000004";
    await send(phone);
    const again = await send(phone);
    expect(again.r.ok).toBe(false);
    if (!again.r.ok) expect(again.r.error).toBe("wait");

    const age = () => query("UPDATE otp_codes SET created_at = created_at - interval '3 minutes' WHERE phone = $1", [phone]);
    await age();
    expect((await send(phone)).r.ok).toBe(true);
    await age();
    expect((await send(phone)).r.ok).toBe(true);
    await age();
    const fourth = await send(phone);
    expect(fourth.r).toEqual({ ok: false, error: "too_many" });
  });
});
