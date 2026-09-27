import { randomUUID } from "node:crypto";
import { vi } from "vitest";
import { bookableDays, DEFAULT_SETTINGS, slotsForDay } from "@/lib/booking/schedule";
import { query } from "@/lib/db";

/** A bookable slot start well in the future, distinct per call. */
let slotCursor = 0;
export function futureSlot(): Date {
  const now = new Date();
  const days = bookableDays(now, DEFAULT_SETTINGS).slice(2); // skip today/tomorrow: lead time
  const all = days.flatMap((d) => slotsForDay(d, DEFAULT_SETTINGS));
  const slot = all[slotCursor % all.length].start;
  slotCursor += 3; // leave gaps so multi-slot blocks in one test never touch the next test's slot
  return slot;
}

export const sid = () => randomUUID();
export const ip = () => `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

export async function expireHold(id: string) {
  await query("UPDATE appointments SET hold_expires_at = now() - interval '1 second' WHERE id = $1", [id]);
}

/** Captures codes written by the mock SMS provider. */
export function captureSms() {
  const sent: { phone: string; template: string; params: Record<string, string> }[] = [];
  const spy = vi.spyOn(console, "info").mockImplementation((msg: string) => {
    const m = /^\[sms:mock\] to=(\S+) template=(\S+) params=(.*)$/.exec(String(msg));
    if (m) sent.push({ phone: m[1], template: m[2], params: JSON.parse(m[3]) });
  });
  return { sent, restore: () => spy.mockRestore() };
}
