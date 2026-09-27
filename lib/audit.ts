import { query, type Db } from "./db";

export async function audit(
  actor: string,
  action: string,
  appointmentId: string | null,
  details: Record<string, unknown> | null,
  db?: Db,
): Promise<void> {
  await query(
    "INSERT INTO audit_log (actor, action, appointment_id, details) VALUES ($1, $2, $3, $4)",
    [actor, action, appointmentId, details ? JSON.stringify(details) : null],
    db,
  );
}

export const ACTION_LABELS: Record<string, string> = {
  "booking.confirmed": "ثبت نوبت آنلاین",
  "staff.booked": "ثبت نوبت توسط کلینیک",
  "staff.moved": "جابه‌جایی نوبت",
  "staff.cancelled": "لغو نوبت",
  "staff.completed": "انجام شد",
  "staff.no_show": "مراجعه نکرد",
  "staff.reopened": "برگرداندن وضعیت",
  "staff.blocked": "بستن زمان",
  "staff.unblocked": "بازکردن زمان",
  "staff.settings": "تغییر تنظیمات",
  "staff.login": "ورود به پنل",
};
