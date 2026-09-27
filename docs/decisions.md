# Decisions log

Decisions made with the client after the handoff. Where these differ from `BUILD-SPEC.md`, this file wins.

## Content

- **Medical council number (شماره نظام پزشکی): removed everywhere.** Not shown in the about section, the footer or structured data.
- **About section credentials list:** «تحصیلات» and «دوره‌های تخصصی» are replaced with three approach rows. The wording needs Dr. Jafari's approval (tracked in `TODO-content.md`):
  - رویکرد: حفظ حداکثری بافت دندان
  - طراحی: متناسب با چهره
  - مشاوره: بررسی همه‌ی گزینه‌ها پیش از درمان
- **Address:** the full address is used everywhere, including the booking success screen and SMS templates:
  شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌ی چهارم

## Booking

- **Hours:** Saturday to Wednesday, 10:00–13:00 and 14:00–19:00. Thursday and Friday closed. All configurable in admin.
- **Midday break:** 13:00–14:00.
- **Appointments are always 30 minutes.** 16 slots per open day: صبح 10:00–12:30, بعدازظهر 14:00–18:30.
- **Hold starts when the patient taps «ادامه»** in step 1, not when they tap a time chip.
- **Double-booking guarantee:** a PostgreSQL exclusion constraint on `tstzrange(start_at, end_at)` for active rows (`held`, `confirmed`), instead of the spec's unique index on `start_at`. It also covers staff blocks that span ranges.
- The server validates every slot against the grid, working hours, the break, closed days and a minimum lead time (2 hours).
- One upcoming appointment per phone number.
- Confirm is idempotent (a repeated submit returns the same booking).
- Day strip shows 14 days (spec), not 7 (prototype).

## Admin

- Login by phone + SMS OTP, allowlist from the `ADMIN_PHONES` env var (comma-separated). Numbers are not committed to the repo.
- Mobile-first, since staff will mostly use it on a phone.

## Hosting

- **Test deploy:** Vercel + Neon Postgres. The app stays portable (standard Node server, plain Postgres, config in env vars) for the move to an Iranian host.
- SMS uses a mock provider (codes written to the server log) until the sms.ir key and templates are ready.
