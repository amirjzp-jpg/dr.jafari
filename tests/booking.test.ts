import { afterAll, describe, expect, it } from "vitest";
import {
  confirmBooking,
  createHold,
  getAvailability,
  staffBlock,
  staffBook,
  staffCancel,
  staffMove,
  sendDueReminders,
  freeSlots,
} from "@/lib/booking/service";
import { addDays, dayKeyOf, tehranToUtc, weekdayOf } from "@/lib/time";
import { pool, query } from "@/lib/db";
import { LIMITS } from "@/lib/rate-limit";
import { captureSms, expireHold, futureSlot, ip, sid } from "./helpers";

afterAll(async () => {
  await pool().end();
});

const phone = (n: number) => `0912${String(n).padStart(7, "0")}`;

async function hold(start: Date, session = sid()) {
  const r = await createHold({ sessionId: session, start, ip: ip() });
  if (!r.ok) throw new Error(`hold failed: ${r.error}`);
  return { ...r, session };
}

describe("double-booking protection", () => {
  it("20 concurrent holds on one slot: exactly one succeeds", async () => {
    const start = futureSlot();
    const results = await Promise.all(
      Array.from({ length: 20 }, () => createHold({ sessionId: sid(), start, ip: ip() })),
    );
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok && r.error === "taken")).toHaveLength(19);
    const { rows } = await query(
      "SELECT count(*)::int AS n FROM appointments WHERE start_at = $1 AND status IN ('held','confirmed')",
      [start],
    );
    expect(rows[0].n).toBe(1);
  });

  it("two concurrent confirms of the same hold: one booking, idempotent result", async () => {
    const sms = captureSms();
    const h = await hold(futureSlot());
    const args = { sessionId: h.session, holdId: h.holdId, phone: phone(1), name: "مریم احمدی", reason: "composite" as const, note: null };
    const [a, b] = await Promise.all([confirmBooking(args), confirmBooking(args)]);
    sms.restore();
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.appointment.id).toBe(b.appointment.id);
    const { rows } = await query("SELECT status FROM appointments WHERE id = $1", [h.holdId]);
    expect(rows[0].status).toBe("confirmed");
    expect(sms.sent.filter((s) => s.template === "confirmed")).toHaveLength(1);
  });

  it("an expired hold cannot be confirmed, and the slot is free for others", async () => {
    const start = futureSlot();
    const h = await hold(start);
    await expireHold(h.holdId);
    const other = await createHold({ sessionId: sid(), start, ip: ip() });
    expect(other.ok).toBe(true);
    const r = await confirmBooking({ sessionId: h.session, holdId: h.holdId, phone: phone(2), name: "علی رضایی", reason: "veneer", note: null });
    expect(r).toEqual({ ok: false, error: "expired" });
  });

  it("an expired hold can still not be confirmed even if nobody took the slot", async () => {
    const h = await hold(futureSlot());
    await expireHold(h.holdId);
    const r = await confirmBooking({ sessionId: h.session, holdId: h.holdId, phone: phone(3), name: "سارا", reason: "other", note: null });
    expect(r).toEqual({ ok: false, error: "expired" });
  });

  it("choosing another time releases the session's previous hold", async () => {
    const a = futureSlot();
    const b = futureSlot();
    const session = sid();
    await hold(a, session);
    await hold(b, session);
    const other = await createHold({ sessionId: sid(), start: a, ip: ip() });
    expect(other.ok).toBe(true);
  });

  it("a confirm with another session's id is rejected", async () => {
    const h = await hold(futureSlot());
    const r = await confirmBooking({ sessionId: sid(), holdId: h.holdId, phone: phone(4), name: "نگار", reason: "other", note: null });
    expect(r.ok).toBe(false);
  });

  it("one upcoming appointment per phone, even under concurrency", async () => {
    const h1 = await hold(futureSlot());
    const h2 = await hold(futureSlot());
    const p = phone(5);
    const [a, b] = await Promise.all([
      confirmBooking({ sessionId: h1.session, holdId: h1.holdId, phone: p, name: "رضا", reason: "composite", note: null }),
      confirmBooking({ sessionId: h2.session, holdId: h2.holdId, phone: p, name: "رضا", reason: "composite", note: null }),
    ]);
    expect([a.ok, b.ok].filter(Boolean)).toHaveLength(1);
    expect([a, b].find((r) => !r.ok)).toEqual({ ok: false, error: "has_active" });
  });

  it("staff bookings, moves and blocks go through the same constraint", async () => {
    const start = futureSlot();
    await hold(start);
    const staff = await staffBook({ start, phone: phone(6), name: "بیمار تلفنی", reason: "other", note: null, sendConfirmation: false, actor: "09050000000" });
    expect(staff).toEqual({ ok: false, error: "taken" });

    const free = futureSlot();
    const booked = await staffBook({ start: free, phone: phone(7), name: "بیمار تلفنی", reason: "other", note: null, sendConfirmation: false, actor: "09050000000" });
    expect(booked.ok).toBe(true);

    const moved = await staffMove({ id: booked.ok ? booked.appointment.id : "", start, notify: false, actor: "x" });
    expect(moved).toEqual({ ok: false, error: "taken" });

    const block = await staffBlock({ start: free, end: new Date(free.getTime() + 60 * 60_000), label: "تعطیل", actor: "x" });
    expect(block.ok).toBe(false);
    if (!block.ok) {
      expect(block.error).toBe("conflicts");
      expect(block.conflicts?.map((c) => c.id)).toContain(booked.ok ? booked.appointment.id : "");
    }

    await staffCancel({ id: booked.ok ? booked.appointment.id : "", notify: false, actor: "x" });
    const block2 = await staffBlock({ start: free, end: new Date(free.getTime() + 60 * 60_000), label: "تعطیل", actor: "x" });
    expect(block2.ok).toBe(true);
    const patient = await createHold({ sessionId: sid(), start: free, ip: ip() });
    expect(patient).toEqual({ ok: false, error: "taken" });
  });

  it("availability marks taken, own and free slots", async () => {
    const session = sid();
    const mine = futureSlot();
    await hold(mine, session);
    const days = await getAvailability(session);
    const slot = days.flatMap((d) => d.slots).find((s) => s.start === mine.toISOString());
    expect(slot?.state).toBe("mine");
    const others = await getAvailability(sid());
    expect(others.flatMap((d) => d.slots).find((s) => s.start === mine.toISOString())?.state).toBe("taken");
  });

  it("rejects times that aren't real slots", async () => {
    const start = futureSlot();
    const r = await createHold({ sessionId: sid(), start: new Date(start.getTime() + 15 * 60_000), ip: ip() });
    expect(r).toEqual({ ok: false, error: "invalid" });
  });

  it("rate-limits hold creation per IP", async () => {
    // One browser re-picking times: each new hold replaces its previous one.
    const addr = "10.9.9.9";
    const session = sid();
    const results = [];
    for (let i = 0; i < 11; i++) results.push(await createHold({ sessionId: session, start: futureSlot(), ip: addr }));
    expect(results.slice(0, 10).every((r) => r.ok)).toBe(true);
    expect(results[10]).toEqual({ ok: false, error: "rate_limited" });
  });

  it("caps how many slots one IP can hold at the same time", async () => {
    const addr = "10.8.8.8";
    const results = [];
    const cap = LIMITS.liveHoldsPerIp;
    for (let i = 0; i <= cap; i++) results.push(await createHold({ sessionId: sid(), start: futureSlot(), ip: addr }));
    expect(results.slice(0, cap).every((r) => r.ok)).toBe(true);
    expect(results[cap]).toEqual({ ok: false, error: "rate_limited" });
    // Another client is unaffected.
    expect((await createHold({ sessionId: sid(), start: futureSlot(), ip: "10.8.8.9" })).ok).toBe(true);
  });

  // Reminder tests use staff-only times (before opening or late evening) so they never
  // collide with the working-hour slots other tests take.
  const HOUR = 3_600_000;

  it("sends each reminder once, about 6 hours ahead, even if the job runs twice at once", async () => {
    const day = addDays(dayKeyOf(new Date()), 2);
    const start = tehranToUtc(day, "21:30");
    const r = await staffBook({ start, phone: phone(9), name: "مریم احمدی", reason: "other", note: null, sendConfirmation: false, actor: "x" });
    expect(r.ok).toBe(true);
    const sms = captureSms();
    // Too early: 7 hours before.
    await sendDueReminders(new Date(start.getTime() - 7 * HOUR));
    expect(sms.sent.filter((s) => s.phone === phone(9))).toHaveLength(0);
    // 5 hours before (15:30 Tehran): due. Two overlapping runs send it once.
    const now = new Date(start.getTime() - 5 * HOUR);
    await Promise.all([sendDueReminders(now), sendDueReminders(now)]);
    await sendDueReminders(now);
    sms.restore();
    const mine = sms.sent.filter((s) => s.phone === phone(9) && s.template === "reminder");
    expect(mine).toHaveLength(1);
    expect(mine[0].params).toMatchObject({ NAME: "مریم" });
  });

  it("holds reminders during quiet hours and sends them at 08:00", async () => {
    const day = addDays(dayKeyOf(new Date()), 3);
    const start = tehranToUtc(day, "09:30");
    const r = await staffBook({ start, phone: phone(10), name: "صبح", reason: "other", note: null, sendConfirmation: false, actor: "x" });
    expect(r.ok).toBe(true);
    const sms = captureSms();
    await sendDueReminders(tehranToUtc(day, "04:00")); // 5.5 h before, but 04:00 is quiet
    expect(sms.sent.filter((s) => s.phone === phone(10))).toHaveLength(0);
    await sendDueReminders(tehranToUtc(day, "08:00"));
    sms.restore();
    expect(sms.sent.filter((s) => s.phone === phone(10) && s.template === "reminder")).toHaveLength(1);
  });

  it("skips the reminder for a booking made inside the 6-hour window", async () => {
    const day = addDays(dayKeyOf(new Date()), 4);
    const start = tehranToUtc(day, "21:00");
    const r = await staffBook({ start, phone: phone(11), name: "دیر", reason: "other", note: null, sendConfirmation: false, actor: "x" });
    expect(r.ok).toBe(true);
    await query("UPDATE appointments SET confirmed_at = start_at - interval '2 hours' WHERE phone = $1", [phone(11)]);
    const sms = captureSms();
    await sendDueReminders(new Date(start.getTime() - 1 * HOUR));
    sms.restore();
    expect(sms.sent.filter((s) => s.phone === phone(11))).toHaveLength(0);
  });
});

describe("multi-hour sessions (staff)", () => {
  it("a 2-hour session blocks the whole range, and a move keeps its length", async () => {
    const day = addDays(dayKeyOf(new Date()), 5);
    const start = tehranToUtc(day, "20:00");
    const long = await staffBook({ start, phone: phone(20), name: "درمان", reason: "veneer", note: null, sendConfirmation: false, actor: "x", durationMinutes: 120 });
    expect(long.ok).toBe(true);
    if (!long.ok) return;
    expect(new Date(long.appointment.end_at).getTime() - start.getTime()).toBe(2 * 3_600_000);
    // 21:00 is inside the session.
    const clash = await staffBook({ start: tehranToUtc(day, "21:00"), phone: phone(21), name: "دیگر", reason: "other", note: null, sendConfirmation: false, actor: "x" });
    expect(clash).toMatchObject({ ok: false, error: "taken" });
    const moved = await staffMove({ id: long.appointment.id, start: tehranToUtc(addDays(day, 1), "20:30"), notify: false, actor: "x" });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(new Date(moved.appointment.end_at).getTime() - new Date(moved.appointment.start_at).getTime()).toBe(2 * 3_600_000);
  });

  it("rejects lengths that aren't on the list", async () => {
    const r = await staffBook({ start: tehranToUtc(addDays(dayKeyOf(new Date()), 6), "21:00"), phone: phone(22), name: "طول", reason: "other", note: null, sendConfirmation: false, actor: "x", durationMinutes: 45 });
    expect(r).toMatchObject({ ok: false, error: "invalid" });
  });

  it("offers only start times where the whole session fits inside one working period", async () => {
    // A quiet Saturday far ahead (beyond the online booking window).
    let day = addDays(dayKeyOf(new Date()), 40);
    while (weekdayOf(day) !== 6) day = addDays(day, 1);
    const times = (await freeSlots(day, undefined, 120)).map((s) => s.time);
    expect(times.length).toBeGreaterThan(0);
    // 10:00–13:00 and 14:00–19:00: a 2-hour session can start by 11:00 or by 17:00.
    for (const t of times) expect(t <= "11:00" || (t >= "14:00" && t <= "17:00")).toBe(true);
    expect(times).toContain("11:00");
    expect(times).toContain("17:00");
    expect(times).not.toContain("12:00");
  });
});
