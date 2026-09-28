# Decisions log

Decisions made with the client after the handoff. Where these differ from `BUILD-SPEC.md`, this file wins.

## Content

- **Medical council number (شماره نظام پزشکی): 169473.** Shown in the footer, the about section and the about page, and in the Person structured data. (Earlier removed; restored when the client supplied the number.)
- **University: not mentioned anywhere**, at the doctor's request.
- **Copy:** the doctor gave full copywriting approval, so service, journal, about and policy copy is final (`reviewed: true`, no draft notices). Still no invented clinical numbers (e.g. longevity in years).
- **Patient photos:** the clinic confirmed that no separate written consent is needed for the before/after photos or the two about-section photos; the photos are used as supplied (before/after cropped to the mouth).
- **Doctor's name:** دکتر فاطمه جعفری (Dr. Fatemeh Jafari), her registered name, everywhere on the site. She is known publicly as «ندا» (Neda), which is her Instagram handle; «دکتر ندا جعفری» appears only as `alternateName` in the Person structured data and in `llms.txt`, so searches for Neda find her. The design files in `design/` are reference only.
- **Instagram:** @dr_nedajafarii, linked (never embedded: Instagram is filtered in Iran and its embed loads Meta scripts) from the footer, the contact section and the gallery page.
- **Gallery (/gallery):** real clinic photos in a card-fan carousel (GSAP, self-hosted) plus a grid; each opens full-screen, pairs with the before/after slider. Photos are only cropped, rotated, straightened and cleaned of watermarks/faces; teeth are never retouched. Over-filtered or low-resolution photos, befores without an after, and tooth-jewellery photos are left out.
- **Phone:** one number only, ۰۹۰۲ ۳۰۲ ۳۱۲۰, shown semibold. The second number (۰۹۰۲ ۳۰۲ ۳۱۱۰) was removed at the client's request.
- **Footer:** «© ۲۰۲۶ دکتر فاطمه جعفری» (year from the build) and «Designed by Razats», both bold, on every public page and the 404. The booking flow has no footer by design.
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

- **Booking policy defaults:** 24 hours' notice to cancel, 15 minutes' lateness allowance, and after a no-show the next booking may need phone confirmation. Change in `app/(site)/booking-policy/page.tsx` if the clinic prefers other numbers.

## Admin

- Login by phone + SMS OTP, allowlist from the `ADMIN_PHONES` env var (comma-separated). Numbers are not committed to the repo.
- Mobile-first, since staff will mostly use it on a phone.

## Hosting

- **Test deploy:** Vercel + Neon Postgres. The app stays portable (standard Node server, plain Postgres, config in env vars) for the move to an Iranian host.
- SMS uses a mock provider (codes written to the server log) until the sms.ir key and templates are ready.

## Implementation notes

- Database access uses `pg` with plain SQL rather than Drizzle: the booking guarantees live in SQL (exclusion constraint, advisory locks, conditional updates), so keeping them visible is clearer. Migrations are plain `.sql` files run by `scripts/migrate.mjs`.
- Service and journal content is structured TypeScript (`content/`) rather than MDX: the service pages need structured fields (steps, FAQ for FAQPage schema), and it keeps a later CMS migration straightforward.
- Writers for the same slot queue on a transaction-scoped advisory lock and deadlocks are retried, so concurrent requests get a clean "slot taken" instead of an error. The constraint remains the guarantee.
- Content drafts show a «پیش‌نویس» notice until `reviewed: true`.
