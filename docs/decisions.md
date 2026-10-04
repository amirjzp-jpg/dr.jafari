# Decisions log

Decisions made with the client after the handoff. Where these differ from `BUILD-SPEC.md`, this file wins.

## Content

- **Medical council number (شماره نظام پزشکی): 169473.** Shown in the footer, the about section and the about page, and in the Person structured data. (Earlier removed; restored when the client supplied the number.)
- **University: not mentioned anywhere**, at the doctor's request.
- **Copy:** the doctor gave full copywriting approval, so service, journal, about and policy copy is final (`reviewed: true`, no draft notices). Still no invented clinical numbers (e.g. longevity in years).
- **Patient photos:** the clinic confirmed that no separate written consent is needed for the before/after photos or the two about-section photos; the photos are used as supplied (before/after cropped to the mouth).
- **Doctor's name:** دکتر فاطمه جعفری (Dr. Fatemeh Jafari), her registered name, everywhere on the site. She is known publicly as «ندا» (Neda), which is her Instagram handle; «دکتر ندا جعفری» appears only as `alternateName` in the Person structured data and in `llms.txt`, so searches for Neda find her. The design files in `design/` are reference only.
- **Instagram:** @dr_nedajafarii, linked (never embedded: Instagram is filtered in Iran and its embed loads Meta scripts) from the footer, the contact section and the gallery page.
- **Gallery (/gallery):** real clinic photos in a card-fan carousel (GSAP, self-hosted) plus a grid; each opens full-screen, pairs with the before/after slider. Photos are only cropped, rotated, straightened and cleaned of watermarks/faces; teeth are never retouched. Over-filtered or low-resolution photos, befores without an after, and tooth-jewellery photos (off-brand, not a listed service) are left out. Treatment labels were identified from the photos and approved by the creative lead, who has full creative control.
- **No video:** the clinic's reel (480×848, 15 s) has a burned-in «DR.NEDA.JAFARI» watermark, phone camera UI in some shots, collage edits and black frames; it would add weight on Iranian connections without adding to the gallery. Left out by decision.
- **Phone:** one number only, ۰۹۰۲ ۳۰۲ ۳۱۲۰, shown semibold. The second number (۰۹۰۲ ۳۰۲ ۳۱۱۰) was removed at the client's request.
- **Footer:** «© ۲۰۲۶ دکتر فاطمه جعفری» (year from the build) and «Designed by Razats Creative Studio» (its own centred line at the very bottom), both bold, on every public page and the 404. The booking flow has no footer by design.
- **About section credentials list:** «تحصیلات» and «دوره‌های تخصصی» are replaced with three approach rows. The wording needs Dr. Jafari's approval (tracked in `TODO-content.md`):
  - رویکرد: حفظ حداکثری بافت دندان
  - طراحی: متناسب با چهره
  - مشاوره: بررسی همه‌ی گزینه‌ها پیش از درمان
- **Address:** the full address is used on every page (contact section, footer, FAQ, booking success screen, structured data):
  شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌چهار
  The floor is written «طبقه‌چهار», as the client asked. The confirmation SMS first carried the full address and no phone number (4 billed parts). In the first live test it reached the phone 13 minutes late, so on 2026-10-04 the client chose a short confirmation without the address (about 2 parts); see docs/sms-templates.md.
- **Directions:** every address has a pin icon and a «مسیریابی» button with a navigation icon (components/ui/DirectionsLink.tsx), so it reads as an action, not plain text.

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

- **SMS:** three sms.ir templates (code, booking confirmation, reminder about 6 hours ahead), texts in `docs/sms-templates.md`. Cancel/move notices are not sent by SMS for now; the admin panel shows «بدون پیامک» and staff call the patient.

- **Reminder timing:** about 6 hours before each visit, with quiet hours 22:00–08:00 Tehran (a reminder due then goes at 08:00). Bookings made less than 6 hours ahead get no reminder. The job runs every 15 minutes (server crontab on the Iranian host).
- **Multi-hour sessions:** staff can book 30 minutes to 4 hours from «نوبت جدید». Picker times respect working periods and the midday break; "outside working hours" allows any time. Moving a session keeps its length. Online bookings stay 30-minute consultations.

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

## SEO (audit of 2026-09-29)
- **Indexing:** only the real domain is indexable (`SITE_INDEXABLE=true` at build). Every other deployment sends `noindex` in the page and the `X-Robots-Tag` header; `robots.txt` stays open so the noindex can be seen.
- **Per-page tags:** every page builds its title, canonical, Open Graph and Twitter tags through `buildMetadata` (lib/seo.ts).
- **One source of facts:** name, address, phone and hours live in `lib/site.ts`; the page text, the structured data and `/llms.txt` (now generated, absolute URLs) all read from it. Hours: 10–13 and 14–19.
- **Reviewer line:** service pages and articles show «بازبینی‌شده توسط …» with the review date, and service pages carry `MedicalWebPage` markup (`reviewedBy`, `lastReviewed`). The date is 2026-09-28, the day the copy was approved (`COPY_APPROVED` in content/services.ts); change it there if the doctor re-reviews.
- **FAQ markup:** a question is marked up on one URL only. «کامپوزیت بهتر است یا لمینت؟» stays visible on the home and composite pages but is out of their FAQPage markup (`noSchema`); the journal article owns it.
- **Sitemap:** real `lastmod` for services and articles, none for the rest; no priority or changefreq.

## Content approved by the content lead, not the doctor (2026-10-03)
- The seven secondary service pages (smile design, whitening, implant, restoration, root canal, surgery, orthodontics) were expanded to the same layout as composite and veneers. The approved introductions are unchanged. Everything added is general information or already-approved site facts; anything clinic-specific that was unconfirmed was left out. Source drafts: `docs/content-drafts/service-pages.md`.
- Because the doctor has not reviewed the new text, these pages (`doctorReviewed: false` in content/services.ts) show **no** «بازبینی‌شده توسط دکتر» line and carry no `reviewedBy` or `lastReviewed` markup; they use `dateModified` instead. Articles marked `doctorReviewed: false` name the clinic, not the doctor, as author. Set the flag back (or delete it) only after she reviews the text.
- New page «دندانپزشکی زیبایی در معالی‌آباد شیراز» (`/dentist-maaliabad-shiraz`): facts only (address, hours, phone, services, booking, council number). Linked from the footer, the sitemap and llms.txt.
- One question, one page: «بلیچینگ چقدر ماندگار است؟» belongs to the whitening article, so the whitening page has no FAQ for it.
- SEO, AEO and GEO text is Persian throughout. The one deliberate English line is the summary in `/llms.txt`, for AI assistants answering in English.

## Languages: Arabic and English (2026-10-04)
- **Why:** to reach Arabic-speaking patients abroad (Iraq, Gulf), with English as a second language. Arabic matters most.
- **Addresses:** Persian stays at the root and does not move. Arabic is under `/ar/…`, English under `/en/…`. Every language page links to its other versions with `hreflang` (also in the sitemap), and `x-default` is the Persian page.
- **Direction:** Arabic is right to left like Persian; English is left to right and mirrors the layout (hero, before/after slider). Each language has its own root layout, so `<html lang dir>` is correct on every page (`app/(fa)`, `app/[lang]`).
- **Rollout:** a page appears in a language only when its translation ships. `lib/i18n.ts` `translatedPaths` is the list; menus, the footer, the language switcher, hreflang and the sitemap all read it, so nothing links to a page that does not exist. Round 1 is the core pages (home first, then about, location, gallery, policies, all 10 services); articles come later.
- **Booking for patients abroad:** the SMS code only works with Iranian numbers. Arabic and English pages send visitors to WhatsApp (+98 917 720 3937, with a ready first message) and the clinic phone; Iranian numbers can still book on the Persian booking page. Booking, admin panel, SMS and the reminder text stay Persian.
- **Text:** written by the assistant from the approved Persian copy, with no new claims (`content/i18n/`). Modern Standard Arabic, Latin digits. Drafts: a native Arabic and English reader must proofread them, and the doctor has not reviewed them (no review claim on these pages).
- **Structured data:** the clinic and doctor names and addresses are localized; service names and the booking action stay Persian-only. `knowsLanguage` stays `fa` until the clinic confirms Arabic or English is spoken.

