import { afterAll, describe, expect, it } from "vitest";
import {
  confirmBooking,
  createHold,
  getAvailability,
  staffBlock,
  staffBook,
  staffCancel,
  staffMove,
  sendReminders,
} from "@/lib/booking/service";
import { addDays, dayKeyOf, tehranToUtc } from "@/lib/time";
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

  it("sends each day-before reminder exactly once, even if the job runs twice at once", async () => {
    const tomorrow = addDays(dayKeyOf(new Date()), 1);
    const start = tehranToUtc(tomorrow, "21:30"); // outside working hours: staff-only, no clash with other tests
    const r = await staffBook({ start, phone: phone(9), name: "یادآوری", reason: "other", note: null, sendConfirmation: false, actor: "x" });
    expect(r.ok).toBe(true);
    const from = tehranToUtc(tomorrow, "00:00");
    const to = tehranToUtc(addDays(tomorrow, 1), "00:00");
    const sms = captureSms();
    const [a, b] = await Promise.all([sendReminders(from, to), sendReminders(from, to)]);
    sms.restore();
    expect(sms.sent.filter((s) => s.phone === phone(9) && s.template === "reminder")).toHaveLength(1);
    expect(a + b).toBeGreaterThanOrEqual(1);
    expect(await sendReminders(from, to)).toBe(0);
  });
});
