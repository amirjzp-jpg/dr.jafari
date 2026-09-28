import { afterEach, describe, expect, it } from "vitest";
import { smsLive } from "@/lib/sms";

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
});
