import { afterEach, describe, expect, it } from "vitest";
import { sendSms, smsLive } from "@/lib/sms";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe("sms.ir go-live switch", () => {
  it("stays on the mock without a key, even if templates are set", () => {
    delete process.env.SMSIR_API_KEY;
    process.env.SMSIR_TEMPLATE_OTP = "123456";
    expect(smsLive("otp")).toBe(false);
  });

  it("stays on the mock for a message type whose template is not set yet", () => {
    process.env.SMSIR_API_KEY = "test-key";
    delete process.env.SMSIR_TEMPLATE_OTP;
    process.env.SMSIR_TEMPLATE_CONFIRMED = "not-a-number";
    expect(smsLive("otp")).toBe(false);
    expect(smsLive("confirmed")).toBe(false);
  });

  it("goes live per message type once the key and its template ID are both set", () => {
    process.env.SMSIR_API_KEY = "test-key";
    process.env.SMSIR_TEMPLATE_OTP = "123456";
    expect(smsLive("otp")).toBe(true);
    expect(smsLive("reminder")).toBe(false);
  });

  it("with the key set, a patient message without a template counts as not sent; codes still work", async () => {
    process.env.SMSIR_API_KEY = "test-key";
    delete process.env.SMSIR_TEMPLATE_OTP;
    delete process.env.SMSIR_TEMPLATE_CANCELLED;
    expect((await sendSms("09120000001", "cancelled", { NAME: "مریم", DATE: "x", TIME: "y" })).ok).toBe(false);
    expect((await sendSms("09120000001", "otp", { CODE: "12345" })).ok).toBe(true);
  });

  it("without any key (test deploy) the mock reports every message as sent", async () => {
    delete process.env.SMSIR_API_KEY;
    expect((await sendSms("09120000001", "moved", { NAME: "مریم", DATE: "x", TIME: "y" })).ok).toBe(true);
  });
});
