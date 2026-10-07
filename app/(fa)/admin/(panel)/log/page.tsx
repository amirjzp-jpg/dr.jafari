import Link from "next/link";
import { ACTION_LABELS } from "@/lib/audit";
import { query } from "@/lib/db";
import { formatPhone } from "@/lib/phone";
import { jalali } from "@/lib/time";

export const metadata = { title: "تاریخچه" };

export default async function LogPage() {
  const { rows } = await query<{ id: string; at: Date; actor: string; action: string; appointment_id: string | null; name: string | null }>(
    `SELECT l.id, l.at, l.actor, l.action, l.appointment_id, a.name
     FROM audit_log l LEFT JOIN appointments a ON a.id = l.appointment_id
     ORDER BY l.at DESC LIMIT 200`,
  );
  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-semibold">تاریخچه</h1>
        <p className="text-sm text-muted">چه کسی، چه تغییری، چه زمانی (۲۰۰ مورد آخر).</p>
      </div>
      <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-surface">
        {rows.length === 0 && <li className="p-4 text-sm text-muted">هنوز رویدادی ثبت نشده است.</li>}
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 text-sm">
            <span className="text-muted">{jalali.slot(new Date(r.at))}</span>
            <span className="font-medium">{ACTION_LABELS[r.action] ?? r.action}</span>
            {r.appointment_id && r.name && <Link href={`/admin/appointments/${r.appointment_id}`}>{r.name}</Link>}
            <span className="ltr-nums ms-auto text-muted">
              {/^09\d{9}$/.test(r.actor) ? formatPhone(r.actor) : r.actor === "patient" ? "بیمار (آنلاین)" : r.actor}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
