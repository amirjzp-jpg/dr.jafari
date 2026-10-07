import "server-only";
import type pg from "pg";
import { audit } from "../audit";
import { PG, pgCode, query, tx } from "../db";
import { hit, LIMITS } from "../rate-limit";
import { getSettings } from "../settings";
import { sendSms } from "../sms";
import { dayKeyOf, jalali, tehranHHMM, minutesOf, type DayKey } from "../time";
import { bookableDays, checkPatientSlot, checkStaffSlot, SLOT_MINUTES, slotsForDay } from "./schedule";

// The double-booking guarantee is the `no_overlapping_appointments` exclusion
// constraint. Everything here either inserts/updates inside a transaction and
// lets that constraint reject conflicts, or reads for display only.

/** Ids come from forms and cookies; reject anything that isn't a UUID before it reaches SQL. */
const isId = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export type Reason = "composite" | "veneer" | "other";
export const REASONS: Reason[] = ["composite", "veneer", "other"];
export const REASON_LABELS: Record<Reason, string> = { composite: "کامپوزیت", veneer: "لمینت", other: "سایر" };

export type AppointmentRow = {
  id: string;
  start_at: Date;
  end_at: Date;
  status: "held" | "confirmed" | "cancelled" | "completed" | "no_show";
  source: "web" | "staff" | "block";
  hold_expires_at: Date | null;
  session_id: string | null;
  phone: string | null;
  name: string | null;
  reason: Reason | null;
  note: string | null;
  label: string | null;
  cancel_reason: string | null;
  created_by: string | null;
  confirmed_at: Date | null;
  created_at: Date;
};

/** Session lengths staff can book (minutes). Online bookings are always one 30-minute slot. */
export const DURATIONS = [30, 60, 90, 120, 150, 180, 240] as const;
export const isDuration = (m: number) => (DURATIONS as readonly number[]).includes(m);

/**
 * Queues writers for the same slots behind a transaction-scoped advisory lock,
 * so concurrent requests resolve in order instead of deadlocking inside the
 * exclusion index. Locks are taken in ascending order to avoid lock cycles.
 * The constraint, not this lock, is what guarantees no double-booking.
 */
async function lockSlots(c: pg.PoolClient, start: Date, end: Date) {
  const step = SLOT_MINUTES * 60_000;
  const first = Math.floor(start.getTime() / step) * step;
  for (let t = first; t < end.getTime(); t += step) {
    await c.query("SELECT pg_advisory_xact_lock(hashtext('slot:' || $1::text))", [String(t)]);
  }
}

/** Cancels expired holds overlapping [start, end) so the slot can be taken. */
async function clearExpiredHolds(c: pg.PoolClient, start: Date, end: Date) {
  await c.query(
    `UPDATE appointments SET status = 'cancelled', cancel_reason = 'hold_expired', updated_at = now()
     WHERE status = 'held' AND hold_expires_at <= now()
       AND tstzrange(start_at, end_at, '[)') && tstzrange($1, $2, '[)')`,
    [start, end],
  );
}

// ---------------------------------------------------------------- availability

export type SlotState = "free" | "taken" | "mine";
export type DayAvailability = {
  day: DayKey;
  open: boolean;
  slots: { start: string; time: string; period: "am" | "pm"; state: SlotState }[];
};

/** Rows that block time right now: confirmed ones and live holds. */
async function activeRows(from: Date, to: Date) {
  const { rows } = await query<{ start_at: Date; end_at: Date; session_id: string | null; status: string }>(
    `SELECT start_at, end_at, session_id, status FROM appointments
     WHERE tstzrange(start_at, end_at, '[)') && tstzrange($1, $2, '[)')
       AND (status = 'confirmed' OR (status = 'held' AND hold_expires_at > now()))`,
    [from, to],
  );
  return rows;
}

export async function getAvailability(sessionId: string | null, now = new Date()): Promise<DayAvailability[]> {
  const settings = await getSettings();
  const days = bookableDays(now, settings).map((day) => ({ day, slots: slotsForDay(day, settings) }));
  const all = days.flatMap((d) => d.slots);
  if (all.length === 0) return days.map((d) => ({ day: d.day, open: false, slots: [] }));

  const rows = await activeRows(all[0].start, all[all.length - 1].end);
  const minStart = now.getTime() + settings.minLeadMinutes * 60_000;

  return days.map(({ day, slots }) => ({
    day,
    open: slots.length > 0,
    slots: slots.map((s) => {
      const overlapping = rows.filter((r) => r.start_at < s.end && r.end_at > s.start);
      let state: SlotState = "free";
      if (overlapping.length > 0) {
        state = overlapping.every((r) => r.status === "held" && sessionId && r.session_id === sessionId) ? "mine" : "taken";
      } else if (s.start.getTime() < minStart) {
        state = "taken"; // too soon to book online
      }
      return { start: s.start.toISOString(), time: s.time, period: s.period, state };
    }),
  }));
}

// ---------------------------------------------------------------- holds

export type HoldResult =
  | { ok: true; holdId: string; start: Date; expiresAt: Date }
  | { ok: false; error: "invalid" | "taken" | "rate_limited" };

/**
 * Takes a 10-minute hold on a slot for this browser session. Releases any other
 * hold the session has. The exclusion constraint rejects the insert if the slot
 * is already held or booked, including by a concurrent request.
 */
export async function createHold(opts: { sessionId: string; start: Date; ip: string; now?: Date }): Promise<HoldResult> {
  const settings = await getSettings();
  const check = checkPatientSlot(opts.start, opts.now ?? new Date(), settings);
  if (!check.ok) return { ok: false, error: "invalid" };
  if (!(await hit(`hold:ip:${opts.ip}`, LIMITS.holdsPerIpPerHour, 3600))) return { ok: false, error: "rate_limited" };
  const live = await query<{ n: string }>(
    `SELECT count(*) AS n FROM appointments
     WHERE hold_ip = $1 AND status = 'held' AND hold_expires_at > now() AND session_id <> $2`,
    [opts.ip, opts.sessionId],
  );
  if (Number(live.rows[0].n) >= LIMITS.liveHoldsPerIp) return { ok: false, error: "rate_limited" };

  const { start, end } = check.slot;
  try {
    return await tx(async (c) => {
      // Re-taking the same slot keeps the phone already attached to the hold.
      const prev = await c.query<{ phone: string | null }>(
        `UPDATE appointments SET status = 'cancelled', cancel_reason = 'hold_released', updated_at = now()
         WHERE session_id = $1 AND status = 'held' RETURNING phone`,
        [opts.sessionId],
      );
      await lockSlots(c, start, end);
      await clearExpiredHolds(c, start, end);
      const { rows } = await c.query<{ id: string; hold_expires_at: Date }>(
        `INSERT INTO appointments (start_at, end_at, status, source, hold_expires_at, session_id, phone, hold_ip)
         VALUES ($1, $2, 'held', 'web', now() + make_interval(mins => $3), $4, $5, $6)
         RETURNING id, hold_expires_at`,
        [start, end, settings.holdMinutes, opts.sessionId, prev.rows.find((r) => r.phone)?.phone ?? null, opts.ip],
      );
      return { ok: true as const, holdId: rows[0].id, start, expiresAt: rows[0].hold_expires_at };
    });
  } catch (err) {
    if (pgCode(err) === PG.exclusionViolation) return { ok: false, error: "taken" };
    throw err;
  }
}

/** The session's current live hold, if any. */
export async function getLiveHold(sessionId: string) {
  const { rows } = await query<{ id: string; start_at: Date; hold_expires_at: Date; phone: string | null }>(
    `SELECT id, start_at, hold_expires_at, phone FROM appointments
     WHERE session_id = $1 AND status = 'held' AND hold_expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [sessionId],
  );
  return rows[0] ?? null;
}

/** Releases the session's holds (patient left the flow or changed time). */
export async function releaseHolds(sessionId: string): Promise<void> {
  await query(
    `UPDATE appointments SET status = 'cancelled', cancel_reason = 'hold_released', updated_at = now()
     WHERE session_id = $1 AND status = 'held'`,
    [sessionId],
  );
}

/** Upcoming confirmed appointment for this phone, if any (one per phone). */
export async function upcomingForPhone(phone: string, db?: pg.PoolClient) {
  const { rows } = await query<{ id: string; start_at: Date }>(
    `SELECT id, start_at FROM appointments
     WHERE phone = $1 AND status = 'confirmed' AND start_at > now() AND source <> 'block'
     ORDER BY start_at LIMIT 1`,
    [phone],
    db,
  );
  return rows[0] ?? null;
}

/**
 * After OTP: attach the verified phone to the session's hold, and release any
 * other live hold for the same phone (one hold per phone number).
 */
export async function attachPhone(sessionId: string, phone: string): Promise<void> {
  await tx(async (c) => {
    await c.query("SELECT pg_advisory_xact_lock(hashtext('phone:' || $1))", [phone]);
    await c.query(
      `UPDATE appointments SET status = 'cancelled', cancel_reason = 'hold_released', updated_at = now()
       WHERE phone = $1 AND status = 'held' AND session_id IS DISTINCT FROM $2`,
      [phone, sessionId],
    );
    await c.query(
      "UPDATE appointments SET phone = $1, updated_at = now() WHERE session_id = $2 AND status = 'held'",
      [phone, sessionId],
    );
  });
}

// ---------------------------------------------------------------- confirm

export type ConfirmResult =
  | { ok: true; appointment: AppointmentRow; sms: boolean }
  | { ok: false; error: "expired" | "has_active" | "invalid" };

/**
 * Confirms the session's hold. Succeeds only if the hold is still live; a
 * repeated call for an already-confirmed hold returns the same booking.
 */
export async function confirmBooking(opts: {
  sessionId: string;
  holdId: string;
  phone: string;
  name: string;
  reason: Reason;
  note: string | null;
}): Promise<ConfirmResult> {
  const name = opts.name.trim().replace(/\s+/g, " ");
  if (!isId(opts.holdId)) return { ok: false, error: "expired" };
  if (name.length < 2 || name.length > 80 || !REASONS.includes(opts.reason)) return { ok: false, error: "invalid" };
  const note = opts.note?.trim().slice(0, 500) || null;

  const result = await tx(async (c): Promise<ConfirmResult & { fresh?: boolean }> => {
    // Serialize per phone so "one upcoming appointment per phone" can't be raced.
    await c.query("SELECT pg_advisory_xact_lock(hashtext('phone:' || $1))", [opts.phone]);

    const existing = await c.query<AppointmentRow>(
      "SELECT * FROM appointments WHERE id = $1 AND session_id = $2",
      [opts.holdId, opts.sessionId],
    );
    const row = existing.rows[0];
    if (row?.status === "confirmed" && row.phone === opts.phone) {
      return { ok: true, appointment: row, sms: true }; // idempotent repeat
    }

    const active = await upcomingForPhone(opts.phone, c);
    if (active && active.id !== opts.holdId) return { ok: false, error: "has_active" };

    const { rows } = await c.query<AppointmentRow>(
      `UPDATE appointments
       SET status = 'confirmed', phone = $3, name = $4, reason = $5, note = $6, hold_ip = NULL,
           confirmed_at = now(), updated_at = now()
       WHERE id = $1 AND session_id = $2 AND status = 'held' AND hold_expires_at > now()
       RETURNING *`,
      [opts.holdId, opts.sessionId, opts.phone, name, opts.reason, note],
    );
    if (!rows[0]) return { ok: false, error: "expired" };
    await audit("patient", "booking.confirmed", rows[0].id, { phone: opts.phone }, c);
    return { ok: true, appointment: rows[0], sms: false, fresh: true };
  });

  if (result.ok && result.fresh) {
    const a = result.appointment;
    const sms = await sendSms(a.phone!, "confirmed", smsParams(a));
    return { ok: true, appointment: a, sms: sms.ok };
  }
  if (result.ok) return { ok: true, appointment: result.appointment, sms: true };
  return result;
}

function smsParams(a: Pick<AppointmentRow, "name" | "start_at">) {
  const start = new Date(a.start_at);
  return {
    // First name only («مریم عزیز»): warmer, and keeps the SMS within its parts.
    NAME: (a.name ?? "").trim().split(/\s+/)[0].slice(0, 20),
    DATE: `${jalali.weekday(dayKeyOf(start))} ${jalali.dayMonth(start)}`,
    TIME: jalali.time(start),
  };
}

// ---------------------------------------------------------------- staff

export type StaffResult<T = AppointmentRow> =
  | { ok: true; appointment: T; sms?: boolean }
  | { ok: false; error: "taken" | "invalid" | "not_found" | "conflicts"; conflicts?: AppointmentRow[] };

export async function staffBook(opts: {
  start: Date;
  phone: string;
  name: string;
  reason: Reason;
  note: string | null;
  sendConfirmation: boolean;
  actor: string;
  /** Session length; defaults to one 30-minute slot. */
  durationMinutes?: number;
}): Promise<StaffResult> {
  const name = opts.name.trim().replace(/\s+/g, " ");
  const minutes = opts.durationMinutes ?? SLOT_MINUTES;
  if (
    !checkStaffSlot(opts.start, new Date()) ||
    !isDuration(minutes) ||
    name.length < 2 ||
    name.length > 80 ||
    !REASONS.includes(opts.reason)
  ) {
    return { ok: false, error: "invalid" };
  }
  const end = new Date(opts.start.getTime() + minutes * 60_000);
  try {
    const row = await tx(async (c) => {
      await lockSlots(c, opts.start, end);
      await clearExpiredHolds(c, opts.start, end);
      const { rows } = await c.query<AppointmentRow>(
        `INSERT INTO appointments (start_at, end_at, status, source, phone, name, reason, note, created_by, confirmed_at)
         VALUES ($1, $2, 'confirmed', 'staff', $3, $4, $5, $6, $7, now()) RETURNING *`,
        [opts.start, end, opts.phone, name, opts.reason, opts.note?.trim().slice(0, 500) || null, opts.actor],
      );
      await audit(opts.actor, "staff.booked", rows[0].id, { phone: opts.phone, start: opts.start, minutes }, c);
      return rows[0];
    });
    const sms = opts.sendConfirmation ? (await sendSms(opts.phone, "confirmed", smsParams(row))).ok : undefined;
    return { ok: true, appointment: row, sms };
  } catch (err) {
    if (pgCode(err) === PG.exclusionViolation) return { ok: false, error: "taken" };
    throw err;
  }
}

export async function staffMove(opts: {
  id: string;
  start: Date;
  notify: boolean;
  actor: string;
}): Promise<StaffResult> {
  if (!isId(opts.id)) return { ok: false, error: "not_found" };
  if (!checkStaffSlot(opts.start, new Date())) return { ok: false, error: "invalid" };
  try {
    const row = await tx(async (c) => {
      // Keep the session's length: a 2-hour treatment stays 2 hours after a move.
      const cur = await c.query<{ start_at: Date; end_at: Date }>(
        `SELECT start_at, end_at FROM appointments
         WHERE id = $1 AND status = 'confirmed' AND source <> 'block' FOR UPDATE`,
        [opts.id],
      );
      if (!cur.rows[0]) return null;
      const length = new Date(cur.rows[0].end_at).getTime() - new Date(cur.rows[0].start_at).getTime();
      const end = new Date(opts.start.getTime() + length);
      await lockSlots(c, opts.start, end);
      await clearExpiredHolds(c, opts.start, end);
      const { rows } = await c.query<AppointmentRow>(
        `UPDATE appointments SET start_at = $2, end_at = $3, reminder_sent_at = NULL, updated_at = now()
         WHERE id = $1 RETURNING *`,
        [opts.id, opts.start, end],
      );
      await audit(opts.actor, "staff.moved", opts.id, { from: cur.rows[0].start_at, to: opts.start }, c);
      return rows[0];
    });
    if (!row) return { ok: false, error: "not_found" };
    const sms = opts.notify && row.phone ? (await sendSms(row.phone, "moved", smsParams(row))).ok : undefined;
    return { ok: true, appointment: row, sms };
  } catch (err) {
    if (pgCode(err) === PG.exclusionViolation) return { ok: false, error: "taken" };
    throw err;
  }
}

export async function staffCancel(opts: { id: string; notify: boolean; actor: string }): Promise<StaffResult> {
  if (!isId(opts.id)) return { ok: false, error: "not_found" };
  const row = await tx(async (c) => {
    const { rows } = await c.query<AppointmentRow>(
      `UPDATE appointments SET status = 'cancelled', cancel_reason = 'clinic', updated_at = now()
       WHERE id = $1 AND status IN ('confirmed', 'held') RETURNING *`,
      [opts.id],
    );
    if (!rows[0]) return null;
    await audit(opts.actor, rows[0].source === "block" ? "staff.unblocked" : "staff.cancelled", opts.id, null, c);
    return rows[0];
  });
  if (!row) return { ok: false, error: "not_found" };
  const shouldSms = opts.notify && row.phone && row.source !== "block" && new Date(row.start_at) > new Date();
  const sms = shouldSms ? (await sendSms(row.phone!, "cancelled", smsParams(row))).ok : undefined;
  return { ok: true, appointment: row, sms };
}

export async function staffSetOutcome(opts: {
  id: string;
  outcome: "completed" | "no_show" | "confirmed";
  actor: string;
}): Promise<StaffResult> {
  if (!isId(opts.id)) return { ok: false, error: "not_found" };
  return tx(async (c) => {
    // "confirmed" undoes a mistaken outcome; the constraint still applies.
    const from = opts.outcome === "confirmed" ? ["completed", "no_show"] : ["confirmed"];
    try {
      const { rows } = await c.query<AppointmentRow>(
        `UPDATE appointments SET status = $2, updated_at = now()
         WHERE id = $1 AND status = ANY($3::appointment_status[]) AND source <> 'block' RETURNING *`,
        [opts.id, opts.outcome, from],
      );
      if (!rows[0]) return { ok: false, error: "not_found" } as const;
      await audit(opts.actor, `staff.${opts.outcome === "confirmed" ? "reopened" : opts.outcome}`, opts.id, null, c);
      return { ok: true, appointment: rows[0] } as const;
    } catch (err) {
      if (pgCode(err) === PG.exclusionViolation) return { ok: false, error: "taken" } as const;
      throw err;
    }
  });
}

/** Blocks [start, end). Fails with the list of bookings in the way, if any. */
export async function staffBlock(opts: { start: Date; end: Date; label: string | null; actor: string }): Promise<StaffResult> {
  if (!(opts.end > opts.start)) return { ok: false, error: "invalid" };
  try {
    const row = await tx(async (c) => {
      await lockSlots(c, opts.start, opts.end);
      await clearExpiredHolds(c, opts.start, opts.end);
      const { rows } = await c.query<AppointmentRow>(
        `INSERT INTO appointments (start_at, end_at, status, source, label, created_by)
         VALUES ($1, $2, 'confirmed', 'block', $3, $4) RETURNING *`,
        [opts.start, opts.end, opts.label?.trim() || null, opts.actor],
      );
      await audit(opts.actor, "staff.blocked", rows[0].id, { start: opts.start, end: opts.end }, c);
      return rows[0];
    });
    return { ok: true, appointment: row };
  } catch (err) {
    if (pgCode(err) !== PG.exclusionViolation) throw err;
    const { rows } = await query<AppointmentRow>(
      `SELECT * FROM appointments
       WHERE tstzrange(start_at, end_at, '[)') && tstzrange($1, $2, '[)')
         AND (status = 'confirmed' OR (status = 'held' AND hold_expires_at > now()))
       ORDER BY start_at`,
      [opts.start, opts.end],
    );
    return { ok: false, error: "conflicts", conflicts: rows };
  }
}

// ---------------------------------------------------------------- staff reads

export async function listRange(from: Date, to: Date, includeCancelled = false): Promise<AppointmentRow[]> {
  const { rows } = await query<AppointmentRow>(
    `SELECT * FROM appointments
     WHERE tstzrange(start_at, end_at, '[)') && tstzrange($1, $2, '[)')
       AND (status IN ('confirmed', 'completed', 'no_show')
            OR (status = 'held' AND hold_expires_at > now())
            OR ($3 AND status = 'cancelled' AND cancel_reason = 'clinic'))
     ORDER BY start_at, source`,
    [from, to, includeCancelled],
  );
  return rows;
}

export async function getAppointment(id: string): Promise<AppointmentRow | null> {
  if (!isId(id)) return null;
  const { rows } = await query<AppointmentRow>("SELECT * FROM appointments WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function search(q: string): Promise<AppointmentRow[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  const { rows } = await query<AppointmentRow>(
    `SELECT * FROM appointments
     WHERE source <> 'block' AND status <> 'held'
       AND (phone LIKE $1 OR name ILIKE $2)
     ORDER BY start_at DESC LIMIT 50`,
    [`%${term.replace(/[%_]/g, "")}%`, `%${term.replace(/[%_]/g, "")}%`],
  );
  return rows;
}

/**
 * Start times on a day where a session of `minutes` fits for staff pickers: inside
 * one working period (never across the midday break) and clear of other bookings.
 */
export async function freeSlots(day: DayKey, excludeId?: string, minutes: number = SLOT_MINUTES) {
  const settings = await getSettings();
  const slots = slotsForDay(day, settings);
  if (slots.length === 0) return [];
  const rows = await activeRowsWithId(slots[0].start, slots[slots.length - 1].end);
  const now = Date.now();
  const span = minutes * 60_000;
  const need = Math.max(1, Math.round(minutes / SLOT_MINUTES));
  return slots.filter((s, i) => {
    if (s.start.getTime() <= now) return false;
    // The session must cover `need` back-to-back working slots.
    for (let k = 1; k < need; k++) {
      const next = slots[i + k];
      if (!next || next.start.getTime() !== s.start.getTime() + k * SLOT_MINUTES * 60_000) return false;
    }
    const end = new Date(s.start.getTime() + span);
    return !rows.some((r) => r.id !== excludeId && r.start_at < end && r.end_at > s.start);
  });
}

async function activeRowsWithId(from: Date, to: Date) {
  const { rows } = await query<{ id: string; start_at: Date; end_at: Date }>(
    `SELECT id, start_at, end_at FROM appointments
     WHERE tstzrange(start_at, end_at, '[)') && tstzrange($1, $2, '[)')
       AND (status = 'confirmed' OR (status = 'held' AND hold_expires_at > now()))`,
    [from, to],
  );
  return rows;
}

// ---------------------------------------------------------------- reminders

/** Reminder lead time, and the quiet hours (Tehran) when no SMS is sent. */
export const REMINDER_HOURS = 6;
const QUIET_FROM = "22:00";
const QUIET_UNTIL = "08:00";

/**
 * Sends each appointment's reminder once, about 6 hours before it starts. Runs
 * every 15 minutes. Nothing goes out between 22:00 and 08:00 Tehran: a reminder
 * that falls in that window is sent at 08:00 instead. Bookings made less than 6
 * hours ahead get no reminder (they have just had the confirmation). Safe to run
 * concurrently: rows are claimed atomically before sending.
 */
export async function sendDueReminders(now: Date = new Date()): Promise<number> {
  const t = minutesOf(tehranHHMM(now));
  if (t >= minutesOf(QUIET_FROM) || t < minutesOf(QUIET_UNTIL)) return 0;
  const { rows } = await query<AppointmentRow>(
    `UPDATE appointments SET reminder_sent_at = now()
     WHERE status = 'confirmed' AND source <> 'block' AND phone IS NOT NULL
       AND reminder_sent_at IS NULL
       AND start_at > $1 AND start_at <= $1 + make_interval(hours => $2)
       AND (confirmed_at IS NULL OR confirmed_at < start_at - make_interval(hours => $2))
     RETURNING *`,
    [now, REMINDER_HOURS],
  );
  let sent = 0;
  for (const a of rows) {
    const { NAME, TIME } = smsParams(a);
    if ((await sendSms(a.phone!, "reminder", { NAME, TIME })).ok) sent++;
  }
  return sent;
}

/**
 * Data minimisation, run daily by the cron: drop login and verification
 * records once they are useless. Appointments and the staff audit log are kept.
 */
export async function purgeExpired(): Promise<Record<string, number>> {
  const run = async (sql: string) => (await query(sql)).rowCount ?? 0;
  return {
    otp_codes: await run("DELETE FROM otp_codes WHERE created_at < now() - interval '1 day'"),
    verified_devices: await run("DELETE FROM verified_devices WHERE expires_at < now()"),
    admin_sessions: await run("DELETE FROM admin_sessions WHERE expires_at < now()"),
    rate_events: await run("DELETE FROM rate_events WHERE created_at < now() - interval '2 days'"),
    // Abandoned holds carry no patient data worth keeping.
    holds: await run(
      "DELETE FROM appointments WHERE status = 'cancelled' AND cancel_reason IN ('hold_released', 'hold_expired') AND name IS NULL AND updated_at < now() - interval '7 days'",
    ),
  };
}
