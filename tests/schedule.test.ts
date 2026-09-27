import { describe, expect, it } from "vitest";
import { checkPatientSlot, DEFAULT_SETTINGS, slotsForDay, validateSettings } from "@/lib/booking/schedule";
import { normalizePhone } from "@/lib/phone";
import { dayKeyOf, tehranHHMM, tehranToUtc } from "@/lib/time";

const S = DEFAULT_SETTINGS;

describe("schedule", () => {
  it("Saturday has 16 thirty-minute slots with a 13:00–14:00 break", () => {
    const slots = slotsForDay("2026-10-03", S); // a Saturday
    expect(slots.map((s) => s.time)).toEqual([
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    ]);
    expect(slots.filter((s) => s.period === "am")).toHaveLength(6);
  });

  it("Thursday and Friday are closed", () => {
    expect(slotsForDay("2026-10-01", S)).toHaveLength(0);
    expect(slotsForDay("2026-10-02", S)).toHaveLength(0);
  });

  it("stores times in UTC (Tehran is UTC+3:30)", () => {
    const d = tehranToUtc("2026-10-03", "10:00");
    expect(d.toISOString()).toBe("2026-10-03T06:30:00.000Z");
    expect(tehranHHMM(d)).toBe("10:00");
    expect(dayKeyOf(new Date("2026-10-03T21:00:00Z"))).toBe("2026-10-04"); // 00:30 next day in Tehran
  });

  it("accepts only real, future slots inside the booking window", () => {
    const now = tehranToUtc("2026-10-03", "09:00");
    expect(checkPatientSlot(tehranToUtc("2026-10-03", "11:00"), now, S).ok).toBe(true);
    expect(checkPatientSlot(tehranToUtc("2026-10-03", "10:00"), now, S)).toEqual({ ok: false, reason: "too_soon" });
    expect(checkPatientSlot(tehranToUtc("2026-10-03", "13:00"), now, S)).toEqual({ ok: false, reason: "not_a_slot" });
    expect(checkPatientSlot(tehranToUtc("2026-10-03", "10:15"), now, S)).toEqual({ ok: false, reason: "not_a_slot" });
    expect(checkPatientSlot(tehranToUtc("2026-10-03", "19:00"), now, S)).toEqual({ ok: false, reason: "not_a_slot" });
    expect(checkPatientSlot(tehranToUtc("2026-10-01", "11:00"), now, S).ok).toBe(false); // Thursday
    expect(checkPatientSlot(tehranToUtc("2026-10-17", "11:00"), now, S)).toEqual({ ok: false, reason: "too_far" });
    expect(checkPatientSlot(tehranToUtc("2026-10-14", "11:00"), now, S).ok).toBe(true); // day 12 of 14
  });

  it("rejects invalid settings", () => {
    expect(validateSettings(S)).toEqual(S);
    expect(validateSettings({ ...S, weekly: { ...S.weekly, "0": [{ start: "10:15", end: "12:00" }] } })).toBeNull();
    expect(validateSettings({ ...S, weekly: { ...S.weekly, "0": [{ start: "12:00", end: "10:00" }] } })).toBeNull();
    expect(
      validateSettings({ ...S, weekly: { ...S.weekly, "0": [{ start: "10:00", end: "13:00" }, { start: "12:00", end: "14:00" }] } }),
    ).toBeNull();
  });
});

describe("phone", () => {
  it("normalizes Persian and Latin digits and country codes", () => {
    for (const v of ["09123456789", "۰۹۱۲۳۴۵۶۷۸۹", "٠٩١٢٣٤٥٦٧٨٩", "+989123456789", "00989123456789", "9123456789", "0912 345 6789"]) {
      expect(normalizePhone(v)).toBe("09123456789");
    }
    for (const v of ["0912345678", "08123456789", "abc", ""]) expect(normalizePhone(v)).toBeNull();
  });
});
