import { toEnDigits, toFaDigits } from "./digits";

export const PHONE_ERROR = "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.";

/**
 * Normalizes an Iranian mobile number to "09XXXXXXXXX".
 * Accepts Persian/Arabic/Latin digits, spaces, dashes, and +98 / 0098 / 98 / 9… forms.
 * Returns null if it isn't a valid mobile number.
 */
export function normalizePhone(input: string): string | null {
  let v = toEnDigits(input).replace(/[\s\-()‌]/g, "");
  if (v.startsWith("+98")) v = "0" + v.slice(3);
  else if (v.startsWith("0098")) v = "0" + v.slice(4);
  else if (v.startsWith("98") && v.length === 12) v = "0" + v.slice(2);
  else if (v.startsWith("9") && v.length === 10) v = "0" + v;
  return /^09\d{9}$/.test(v) ? v : null;
}

/** «۰۹۱۲•••۶۷۸۹» */
export function maskPhone(phone: string): string {
  return toFaDigits(`${phone.slice(0, 4)}•••${phone.slice(7)}`);
}

/** «۰۹۱۲ ۳۴۵ ۶۷۸۹» */
export function formatPhone(phone: string): string {
  return toFaDigits(`${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`);
}
