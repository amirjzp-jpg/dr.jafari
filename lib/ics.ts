import { site } from "./site";

/** A calendar file for one appointment. Times in UTC so every calendar app agrees. */
export function appointmentIcs(startIso: string, minutes = 30): string {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + minutes * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (v: string) => v.replace(/([,;\\])/g, "\\$1");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//drjafari//booking//FA",
    "BEGIN:VEVENT",
    `UID:${fmt(start)}-${Math.random().toString(36).slice(2)}@drjafari`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(`معاینه و مشاوره — ${site.clinicName}`)}`,
    `LOCATION:${esc(site.address)}`,
    `DESCRIPTION:${esc(`تماس: ${site.phone.tel}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
