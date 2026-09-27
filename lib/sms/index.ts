import "server-only";
import { query } from "../db";

// SMS goes through sms.ir's Verify (template) API. Template texts are registered
// and approved in the sms.ir panel (see BUILD-SPEC.md section 7); we only send
// the parameters. Without SMSIR_API_KEY a mock provider writes messages to the
// server log instead, so development and the test deploy work without an account.

export type SmsTemplate = "otp" | "confirmed" | "reminder" | "cancelled" | "moved";

type Params = Record<string, string>;

const TEMPLATE_ENV: Record<SmsTemplate, string> = {
  otp: "SMSIR_TEMPLATE_OTP",
  confirmed: "SMSIR_TEMPLATE_CONFIRMED",
  reminder: "SMSIR_TEMPLATE_REMINDER",
  cancelled: "SMSIR_TEMPLATE_CANCELLED",
  moved: "SMSIR_TEMPLATE_MOVED",
};

export type SmsResult = { ok: boolean; provider: "smsir" | "mock"; detail?: string };

async function sendSmsIr(phone: string, template: SmsTemplate, params: Params): Promise<SmsResult> {
  const templateId = Number(process.env[TEMPLATE_ENV[template]]);
  if (!templateId) return { ok: false, provider: "smsir", detail: `missing ${TEMPLATE_ENV[template]}` };
  try {
    const res = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": process.env.SMSIR_API_KEY!,
      },
      body: JSON.stringify({
        mobile: phone,
        templateId,
        parameters: Object.entries(params).map(([name, value]) => ({ name, value })),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => null)) as { status?: number; message?: string } | null;
    const ok = res.ok && body?.status === 1;
    return { ok, provider: "smsir", detail: ok ? undefined : `${res.status} ${body?.message ?? ""}`.trim() };
  } catch (err) {
    return { ok: false, provider: "smsir", detail: err instanceof Error ? err.message : "request failed" };
  }
}

export async function sendSms(phone: string, template: SmsTemplate, params: Params): Promise<SmsResult> {
  let result: SmsResult;
  if (process.env.SMSIR_API_KEY) {
    result = await sendSmsIr(phone, template, params);
  } else {
    // Dev/test logger. This is the only place an OTP code is ever written out;
    // it never reaches an HTTP response.
    console.info(`[sms:mock] to=${phone} template=${template} params=${JSON.stringify(params)}`);
    result = { ok: true, provider: "mock" };
  }
  if (!result.ok) console.error(`[sms] failed to=${phone} template=${template}: ${result.detail}`);
  // Never store OTP parameters in the log table.
  await query("INSERT INTO sms_log (phone, template, ok, provider, detail) VALUES ($1, $2, $3, $4, $5)", [
    phone,
    template,
    result.ok,
    result.provider,
    result.detail ?? null,
  ]).catch(() => {});
  return result;
}
