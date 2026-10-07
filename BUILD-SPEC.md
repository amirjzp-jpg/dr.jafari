# Dr. Fatemeh Jafari: Website Build Spec

> **Updated after handoff:** `docs/decisions.md` records later client decisions (no medical council number, a 13:00–14:00 break, an exclusion constraint for double-booking, and more). Where it differs from this spec, it wins.

This is the source of truth for the build. The designs in `design/` show what it should look like; this spec says how it should behave. If they disagree, this spec wins, and the disagreement should be flagged rather than guessed.

---

## 1. Project in one paragraph

A Persian (RTL-first) website for a cosmetic dental clinic in Shiraz, Iran. Its main job is turning visitors into booked consultations. The patient picks a time, verifies their phone by SMS (sms.ir), and the appointment is confirmed automatically if the slot is free. Staff log in by SMS OTP to a small admin panel to view and manage bookings. Secondary jobs: showcase before/after results, explain composite and veneer treatments, and rank in Google through a blog.

Positioning: high-end, calm, editorial. "Experience without arrogance, luxury without excess."

---

## 2. Design reference files

| File | What it is |
|---|---|
| `design/Main.dc.html` | Full desktop homepage, 1440px wide. Includes hero, stats row, about, before/after sliders, services, blog, contact, footer. |
| `design/Mobile.dc.html` | Mobile hero, 390×844, with sticky bottom CTA bar. |
| `design/Booking.dc.html` | Mobile booking flow prototype, 5 steps, with working logic in the script block. |

These files use a design-tool template syntax (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}`, a `DCLogic` class). **Do not reuse that syntax.** Read them as visual and behavioral reference, and rebuild in the real stack. All inline styles give exact colors, sizes, radii and spacing. The booking prototype's script contains the validation rules and state flow in plain JS.

Assets are in `assets/` (WebP, already optimized). Originals are in `assets/source/`.

---

## 3. Recommended stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**, with `dir="rtl"` and `lang="fa"` on `<html>`. Use Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`); never hard-code left/right for layout.
- **PostgreSQL** with Prisma or Drizzle. The double-booking guarantee depends on a database constraint (section 7), so SQLite is not suitable.
- **Content:** MDX files in the repo for blog posts and service pages (low volume, no CMS needed at launch). Keep front-matter structured so a CMS can be added later.
- **Jalali dates:** `date-fns-jalali` (or `dayjs` with a Jalali plugin). Store all times in UTC; display in `Asia/Tehran` (Iran has had no DST since 2022).
- **Hosting (important for Iran):** the audience is in Iran. Recommend an Iranian host or cloud (e.g. ArvanCloud or Liara) for speed and reliability, and because foreign platforms can be blocked or throttled. Confirm with the client before choosing. **Self-host all fonts and scripts**; do not depend on Google Fonts, Google Maps or Google Analytics loading reliably inside Iran.

Claude Code may propose a different stack if it has a strong reason, but must keep: RTL-first, database-level slot locking, server-side OTP, and self-hosted assets.

---

## 4. Design system

### Colors

| Token | Hex | Use |
|---|---|---|
| `ivory` | `#FAF8F4` | Page background (milky white) |
| `surface` | `#FFFFFF` | Cards, inputs, icon tiles |
| `tint` | `#E4EEF6` | Hero background, soft panels, tags |
| `tint-2` | `#D3E2EE` | Arch shape behind portrait |
| `blue-soft` | `#CFE0EE` | Icon fill |
| `blue-mid` | `#7FA6CB` | Icon accent. Decorative only, never text |
| `primary` | `#1F4A6E` | The only action color: buttons, links, selected states |
| `primary-hover` | `#173A57` | Hover and pressed |
| `ink` | `#1C2733` | Body text and headings |
| `muted` | `#5B6875` | Secondary text |
| `muted-2` | `#45505C` | Secondary text on tinted panels |
| `line` | `#E6E1D8` | Hairlines and borders |
| `champagne` | `#C9B79C` | Hairline accents and arch outlines only. Never text; it fails contrast |
| `danger` | `#A3312D` | Form errors |

Contrast has been checked: ink on ivory 14:1, primary on ivory 8.8:1, white on primary 9.3:1, muted on ivory 5.4:1, muted on tint 4.9:1. **Do not introduce new text colors without checking for 4.5:1.**

Rule: deep blue appears only on things you can tap. That is what makes the single CTA work.

### Typography

- **Display (headings, names, card titles):** Noto Naskh Arabic, weights 500 and 600. It's a placeholder for a licensed Persian display face; the client may buy one later, so keep it behind a single CSS variable.
- **Body and UI:** Vazirmatn, weights 300, 400 and 500.
- Self-host both as WOFF2 subsets with `font-display: swap`.
- Use Persian digits (۰۱۲۳…) for all displayed numbers. Store and validate with Latin digits, and convert on input: users will type either.
- Never add `letter-spacing` to Persian text; it breaks letter joining.
- Scale (desktop / mobile): H1 68/34, H2 44/26, card title 22–30, body 16–17 with line-height 1.9–2.1, captions 13–14.

### Shape and style

- Buttons are pills (`border-radius: 999px`). Primary: filled `primary`, white text, height 56–58. Secondary: 1px `primary` outline.
- Cards use 20–24px radius. Icon tiles are 16px radius, white, with a 1px `line` border.
- **The arch motif** (a tall shape with a fully rounded top) frames the hero portrait, the about photo and the before/after images. It echoes the clinic's real interior, which has an arched mirror and a Persian lattice screen.
- Section titles use an eyebrow: a 28px champagne hairline plus a small muted label.
- No hard color breaks between sections. The hero fades from `tint` to `ivory` with a gradient, and sections are separated by whitespace and hairlines.
- Subtle motion only: 150–300ms, respect `prefers-reduced-motion`, no parallax.

### Icons

The ten service icons are custom SVGs in `design/Main.dc.html` (services section). Extract them into an icon component. Style: 24 viewBox, stroke `primary` 1.5, fill `blue-soft`, accent `blue-mid`. Keep them as inline SVG, not an icon font.

---

## 5. Sitemap

```
/                         Homepage
/composite                کامپوزیت دندان (service page)
/veneers                  لمینت سرامیکی (service page)
/services                 All services
/services/[slug]          Other service pages (smile design, whitening, implant…)
/about                    درباره‌ی دکتر
/journal                  مجله (blog index)
/journal/[slug]           Article
/booking                  رزرو نوبت (the 5-step flow)
/contact                  تماس (optional; the homepage section may be enough)
/privacy                  حریم خصوصی
/booking-policy           قوانین نوبت‌دهی
/admin                    Staff panel (OTP login, noindex)
404                       Custom
```

Nav order: **کامپوزیت · لمینت · خدمات · مجله · تماس** plus a «رزرو نوبت» outline button. «نمونه‌کارها» was deliberately removed from the nav; the before/after section stays on the homepage.

Use English slugs in URLs; Persian slugs cause encoding and sharing problems.

---

## 6. Page specs

### Homepage (follow `design/Main.dc.html` in order)

1. **Header:** her name in Naskh, the subtitle «دندانپزشکی زیبایی شیراز», the nav, and an outline «رزرو نوبت» button.
2. **Hero:** tint→ivory gradient. Her cutout portrait on the right inside an arch that fades at the bottom; the image also fades via `mask-image`. A name card overlaps the arch edge. Text on the left: eyebrow, H1 «دندانپزشکی زیبایی شیراز», H2 «کامپوزیت · لمینت سرامیکی», one line of support copy, the primary «رزرو نوبت» button, and both phone numbers as tap-to-call links.
3. **Stats row:** three columns separated by hairlines: «+۱۰ سال», «کامپوزیت و لمینت», «پرداخت اقساطی».
4. **About (آشنایی با دکتر):** an arch photo plus an overlapping inset photo, the bio, and a credentials list. Bio fields are placeholders; see section 12.
5. **Before/after (نمونه‌کارها):** three interactive sliders in arch frames. Spec in section 8.
6. **Services:** two featured cards (composite, veneers) and eight more in a two-column list with icons.
7. **Journal (مجله):** the three latest posts as cards.
8. **Contact panel:** consultation CTA, both phones, address, hours.
9. **Footer:** ©, نظام پزشکی number, links to privacy, booking policy and Instagram.

**Mobile:** follow `design/Mobile.dc.html` for the hero. Everything else stacks to one column. Add a **sticky bottom bar** on all public pages except `/booking`: a full-width «رزرو نوبت» pill plus a round call button.

### Service pages (/composite, /veneers)

Structure for each: what it is, who it suits, the process in steps, benefits, limitations (be honest; it builds trust), longevity, aftercare, FAQ (accordion + FAQPage schema), related before/after cases, related articles, and a booking CTA. Copy to be written; see section 12.

### Article page

Header image (`assets/blog/*-hero.webp`, 16:9), title in Naskh, category tag, read time, date in Jalali, body with a max width of about 680px, inline booking CTA near the end, and related articles. Article schema.

---

## 7. Booking system

### Rules

- Online bookings are **one appointment type: «معاینه و مشاوره»**, 30 minutes. The patient picks a reason (کامپوزیت / لمینت / سایر) as data, not as a type. Treatment sessions are scheduled by staff after the consult.
- **Hours:** Saturday to Wednesday, 10:00–19:00, so the last slot starts at 18:30. Thursday and Friday are closed. ⚠️ **Midday break: not confirmed yet.** Make working hours and breaks configurable in admin, never hard-coded.
- Show the next 14 days.
- **Auto-confirm:** if the slot is free when the patient submits, the booking is confirmed immediately and a confirmation SMS is sent. Staff can then cancel or move it.
- **10-minute hold:** selecting a time creates a hold that lasts 10 minutes. The UI shows a live countdown. On expiry the patient returns to the time picker **with their phone and name kept**.
- One active hold per browser session and per phone number. Choosing another time releases the previous hold, and so does leaving the flow.
- Rate-limit hold creation per IP (for example 10 per hour) so no one can lock out a day.

### Preventing double-booking (the part that must be correct)

The countdown is only UX. The guarantee comes from the database:

- Table `appointments`: `id, start_at (timestamptz), status ('held' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'), hold_expires_at, session_id, phone, name, reason, note, created_at, source ('web' | 'staff')`.
- A **partial unique index** on `start_at WHERE status IN ('held','confirmed')`.
- To take a hold, run in one transaction: (1) delete or cancel any `held` row for that `start_at` whose `hold_expires_at < now()`, then (2) insert the new `held` row. If the unique index rejects it, return "slot taken" and show the next free times.
- To confirm: `UPDATE ... SET status='confirmed' WHERE id=$1 AND status='held' AND hold_expires_at > now()`. If zero rows are affected, the hold expired and the patient is sent back to the picker.
- The availability query treats expired holds as free, so no cron job is needed. An optional nightly cleanup is fine.
- Staff bookings and blocked times go through the same table and constraint. Blocks can be `status='confirmed'` with `source='staff'` and a label, or a separate `blocks` table checked in the same transaction.
- **Write a test** that fires two concurrent confirms at the same slot and asserts exactly one succeeds.

### Patient flow (follow `design/Booking.dc.html`)

1. **Time:** a horizontal day strip (Jalali; closed days disabled and labelled «تعطیل») and time chips grouped «صبح» / «بعدازظهر»; taken slots are struck through. Button: «ادامه».
2. **Phone:** an input with `type="tel"`, `inputmode="numeric"`, `autocomplete="tel"`, LTR. Accepts Persian or Latin digits. Validation: `^09\d{9}$`. Error: «شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.» Button: «دریافت کد تأیید».
3. **OTP:** a single input with `autocomplete="one-time-code"` and `maxlength=5` (not five separate boxes, so SMS autofill works). Shows the masked number, a «تغییر شماره» link, and «ارسال دوباره‌ی کد» with a 2-minute countdown. Button: «تأیید کد».
4. **Details:** a summary card with the time and a «تغییر» link, name (required), reason chips, optional note. Button: «ثبت نوبت».
5. **Success:** «نوبت شما ثبت شد», a summary (time, type, address, both phones), and «مسیریابی» and «افزودن به تقویم» (.ics) buttons.

A hold bar with a clock is shown during steps 2–4: «[زمان] برای شما نگه داشته شده است  ۰۹:۵۸».

If a patient has verified their phone in the last 30 days, a session cookie lets them skip OTP.

### OTP rules (server-side only)

- 5 digits, stored **hashed**, valid for 2 minutes, at most 5 attempts per code.
- Resend is allowed after 2 minutes, up to 3 sends per phone per 30 minutes, with a per-IP limit as well.
- Never return the code in an API response, not even in development. Use a dev-mode logger instead.

### SMS (sms.ir)

- Use the **Verify / template** API: `POST https://api.sms.ir/v1/send/verify` with header `x-api-key`, body `{ mobile, templateId, parameters: [{ name, value }] }`. ⚠️ Confirm the endpoint and payload against sms.ir's current docs before building; this is from memory.
- Templates must be registered and approved in the sms.ir panel first. Keep the template IDs in env vars.
- The API key lives only in server env. **Never ship it to the client.**

Template texts (parameter names must match whatever is registered on sms.ir). **Superseded:** the final, length-checked texts are in `docs/sms-templates.md`; the table below is the original brief.

| Template | Text |
|---|---|
| OTP | `کد تأیید: #CODE#` newline `کلینیک دکتر فاطمه جعفری` |
| Confirmed | `#NAME# عزیز، نوبت شما #DATE# ساعت #TIME# تأیید شد.` newline `نشانی: پل معالی‌آباد، ساختمان موجودی، طبقه‌ی چهارم` newline `۰۹۰۲ ۳۰۲ ۳۱۲۰` |
| Reminder (day before, around 18:00) | `یادآوری: نوبت شما فردا ساعت #TIME# است. برای تغییر تماس بگیرید: ۰۹۰۲ ۳۰۲ ۳۱۲۰` |
| Cancelled by clinic | `#NAME# عزیز، نوبت #DATE# ساعت #TIME# لغو شد. برای هماهنگی: ۰۹۰۲ ۳۰۲ ۳۱۲۰` |
| Moved by clinic | `#NAME# عزیز، نوبت شما به #DATE# ساعت #TIME# تغییر کرد.` |

The reminder needs a scheduled job (a cron on the host, or the framework's scheduler).

---

## 8. Before/after slider

- Two stacked images: "before" is clipped by width percentage and anchored to the **right** (it's read first in RTL). "After" fills the full frame.
- Drag with pointer events (mouse and touch). Include a visible round handle (44px) and a thin white divider.
- Keyboard: a real `<input type="range">` (or `role="slider"` with `aria-valuenow`) driven by arrow keys. Label: «مقایسه‌ی قبل و بعد — [treatment]».
- «قبل» / «بعد» pill labels at the bottom corners.
- Add `touch-action: pan-y` so vertical page scrolling still works on phones.
- Frames: arch shape (radius 189px 189px 20px 20px on a 378×440 frame). **If the real case photos are close-ups of teeth, switch to plain 20px rounded rectangles**, because the arch crops their top.
- Each case: treatment title, tooth count, session count. Real clinical photos only, with written patient consent.

---

## 9. Staff panel (/admin)

Functional over beautiful. Same tokens, simpler layout. `noindex`, and not linked from public pages.

- **Login:** phone plus OTP, only for phone numbers in a `staff` allowlist table. Session in an httpOnly, Secure, SameSite=Lax cookie with 12-hour expiry.
- **Today:** a list of today's appointments with time, name, phone (tap-to-call), reason and note; actions: complete / no-show / cancel.
- **Week view:** a grid of days × slots showing free / held / confirmed / blocked.
- **New booking:** for phone-in patients. It uses the same constraint and sends the confirmation SMS (with a toggle to skip it).
- **Move / cancel:** sends the matching SMS automatically. Confirm before cancelling.
- **Block time:** a single slot, a range or a whole day (holidays).
- **Settings:** working days and hours, breaks, slot length, how many days ahead are bookable.
- **Search** by phone or name.
- An audit log of who changed what.

---

## 10. SEO

- Per-page `<title>` and meta description. Homepage:
  - Title: `دکتر فاطمه جعفری | دندانپزشکی زیبایی در شیراز`
  - Description: `کامپوزیت، لمینت و طراحی لبخند در شیراز با دکتر فاطمه جعفری؛ بیش از ۱۰ سال تجربه، کلینیک مجهز و امکان پرداخت اقساطی. رزرو آنلاین نوبت.`
- Schema: `Dentist` (a LocalBusiness subtype) with name, address, phones, hours, geo; `Person` for the doctor; `FAQPage` on service pages; `Article` on posts; `BreadcrumbList`.
- `sitemap.xml` and `robots.txt` (disallow `/admin` and `/booking` steps beyond the first).
- Open Graph and Twitter images: a 1200×630 card built from the hero.
- Target search terms: کامپوزیت دندان در شیراز، لمینت دندان در شیراز، دندانپزشک زیبایی شیراز، طراحی لبخند در شیراز. Treat «بهترین …» as search intent only; **never** claim "the best" in copy.
- Blog topic clusters are in `docs/master-plan.md`, section 16. Every article links to its pillar service page.
- One H1 per page, and headings in order.

---

## 11. Launch checklist (decisions already made)

| Item | Decision |
|---|---|
| Privacy policy | **Yes.** Required, because phone numbers are collected. Cover: what's stored, why, how long, sms.ir as a processor, deletion on request. |
| Terms | Replace with a short **«قوانین نوبت‌دهی»** page covering cancellation notice, lateness and no-shows. |
| Secrets off the frontend | **Yes.** The sms.ir key and DB credentials are server-only. Check the client bundle. |
| Force HTTPS | **Yes**, plus HSTS. |
| Cookie consent banner | **No.** Iran has no GDPR-style requirement, and with self-hosted, cookieless analytics it adds friction for nothing. Revisit if third-party ad pixels are added. |
| Meta titles and descriptions | Yes, per page (section 10). |
| Social preview image | Yes, 1200×630. |
| Favicon | Yes. Create one from the brand monogram or tooth icon; include apple-touch-icon and the manifest. |
| Sitemap and robots.txt | Yes (section 10). |
| Alt text | Yes, in Persian, descriptive. |
| Image compression | Already WebP. Serve responsive `srcset`, use lazy loading below the fold, and set explicit dimensions to avoid layout shift. |
| Page speed | Target Lighthouse mobile at 90+ and LCP under 2.5s on 4G. The hero portrait is the LCP element, so preload it. |
| Color contrast | Tokens are pre-checked; don't add new text colors without checking. |
| Mobile-friendly | Mobile-first; test at 360, 390 and 430 wide. |
| Custom 404 | Yes. «این صفحه پیدا نشد» with buttons to go home and to book. |
| Broken links | Run a link check in CI before launch. |
| Form validation | Client and server, with Persian messages next to the field and `aria-live` for errors. |
| Spam protection | Rate limits on OTP and holds (section 7) plus a honeypot field. **No reCAPTCHA**; Google services are unreliable in Iran. |
| Analytics | Self-hosted **Umami** or Plausible. Track: book-CTA clicks, phone clicks, each booking step, completions, hold expiries, slider use. |
| One clear CTA | «رزرو نوبت», with the identical label everywhere, and the only filled button on any screen. |

Also: add both phone numbers as tap-to-call links everywhere they appear, and a map link to **Neshan and Google Maps** (many users in Shiraz use Neshan or Balad).

---

## 12. Content and open items

### Final content

- **Phone:** ۰۹۰۲ ۳۰۲ ۳۱۲۰ (`tel:+989023023120`). The second number (۳۱۱۰) was removed at the client's request; see docs/decisions.md.
- **Address:** شیراز، پل معالی‌آباد، ابتدای تاچارا، روبه‌روی پل، جنب بانک تجارت، ساختمان موجودی، طبقه‌ی چهارم
- **Hours:** شنبه تا چهارشنبه، ساعت ۱۰ تا ۱۹ · پنجشنبه و جمعه تعطیل
- **Installments:** mention only, with no terms: «امکان پرداخت اقساطی برای درمان‌های زیبایی»
- **Services:** کامپوزیت، لمینت سرامیکی (featured); طراحی لبخند، بلیچینگ، ایمپلنت، ترمیم، عصب‌کشی، جراحی، ارتودنسی، معاینه و مشاوره
- **Equipment line:** «کلینیکی مجهز به تجهیزات و فناوری‌های روز دندانپزشکی»
- All other homepage copy is final as written in `design/Main.dc.html`.

### Rules for copy

- **Never use «متخصص»** for her title unless she holds an official specialty degree. The medical council regulates it. Use «دندانپزشک زیبایی» or «دندانپزشکی زیبایی».
- No «بهترین», «تضمینی», «دائمی» or «بدون عارضه».
- Service-page and article copy must be approved by Dr. Jafari before publishing. Write drafts, and mark clinical claims for her review.

### Still missing (use visible placeholders `[؟]`; do not invent)

- [ ] نظام پزشکی number (footer and about)
- [ ] Bio: university, graduation year, courses, a sentence on her approach in her own words
- [ ] Midday break, if any
- [ ] Before/after case photos, with written patient consent
- [ ] **Written consent from the patients visible in `about-main.webp` and `about-detail.webp`**, or blur or re-crop them
- [ ] Instagram URL
- [ ] Domain and hosting account
- [ ] sms.ir account, API key and approved template IDs
- [ ] Decision on buying a licensed Persian display font
- [ ] Clinic legal name, if different from «کلینیک دکتر فاطمه جعفری»

### Image notes

- The blog images are AI-generated stock. Use them **only in the journal**, never near before/after cases or on service pages as results.
- `veneer-care-*` has already been cropped to remove a wine glass. **Do not use the uncropped original**; alcohol imagery is a problem for an Iranian clinic site.
- The portrait cutout (`dr-cutout-full.png`) is machine-made and has a faint grey fringe on the hair. Get a hand-refined cutout before launch.

---

## 13. Build order

1. Scaffold, design tokens, fonts, and the RTL base layout (header, footer, sticky mobile bar).
2. Homepage, pixel-matched to `design/Main.dc.html` on desktop and responsive down to 360px.
3. Database, the booking API with holds and the constraint, the concurrency test, then OTP and sms.ir (with a mock provider in dev).
4. The `/booking` flow, matched to `design/Booking.dc.html`.
5. The admin panel.
6. Service pages, `/about`, the journal and article template, privacy, booking policy, 404.
7. SEO, schema, sitemap, analytics, performance pass, accessibility pass.
8. The QA pass against section 14, then deployment.

After each step, show the result and wait for approval before moving on.

## 14. Acceptance criteria

- [ ] Two concurrent bookings of one slot: exactly one succeeds (automated test).
- [ ] A hold expires after 10 minutes; the patient keeps their phone and name and re-picks a time.
- [ ] OTP is hashed, expires, is rate-limited, and never appears in any client response.
- [ ] No secrets in the client bundle.
- [ ] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100.
- [ ] Every interactive element is keyboard reachable with a visible focus ring; the slider works with arrow keys.
- [ ] Persian and Latin digits are both accepted in every numeric input.
- [ ] Every page works at 360px with no horizontal scroll.
- [ ] The site renders correctly with Google services blocked (fonts, maps, analytics).
- [ ] Every placeholder `[؟]` is listed in a `TODO-content.md` so nothing ships by accident.
