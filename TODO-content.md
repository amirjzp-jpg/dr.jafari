# Content still missing

Every `[؟]` placeholder on the site must be listed here. Nothing ships while this list has open items. (As of now the site has none.)

## Done
- [x] About copy (no university, at the doctor's request) and medical council number 169473
- [x] Final copy for all service pages, journal articles, privacy and booking policy (doctor's full copywriting approval)
- [x] Hero portrait: new photo from the clinic, cut out cleanly (no fringe on the hair)
- [x] Before/after case photos (3 cases, cropped to the mouth at matched scale in `public/images/cases/`)
- [x] Treatment names on the homepage before/after cases, approved by the creative lead
- [x] Gallery: 10 clinic photos with treatment labels approved (creative lead has full creative control); tooth jewellery and the clinic video left out (see docs/decisions.md)
- [x] `OTP_SECRET` rotated and stored as a Sensitive variable (Production + Preview); `CRON_SECRET` added (Sensitive), so reminders and the daily cleanup run
- [x] Instagram: @dr_nedajafarii (footer, contact section, gallery page, structured data)

## Still needed
- [ ] SEO audit (2026-09-29), needs the doctor's decision before the code can change:
  - D1 one clinic name everywhere (site «کلینیک دکتر فاطمه جعفری» vs SMS «کلینیک دندانپزشکی دکتر جعفری»)
  - D2 whether «ندا» appears in visible text (today: only in structured data and llms.txt, per the decision to use فاطمه on the site)
  - D3 prices: publish ranges, or only what drives the cost, plus a copy approval for the new «هزینه» section
  - D5 exact Neshan/Balad pins (also unlocks `geo` and `hasMap` in structured data)
  - D6 written patient consent for every before/after photo, and a check against the medical council's advertising rules
  - D7 confirm the spelling «طبقه‌چهار»
  - a real photo of the clinic (entrance or interior) for the `Dentist` structured data image
  - the medical council's public profile URL for number 169473, if one exists (verify by hand before adding to `sameAs`)
  - off-site listings: Instagram bio, Neshan, Balad, Google Maps, Paziresh24, Doctoreto, Nobat.ir (same name, address, phone and hours as the site)
- [ ] Confirm the booking-policy defaults (24 h notice, 15 min lateness, no-show rule)
- [ ] Exact map pins for Neshan, Balad and Google Maps (the «مسیریابی» link currently searches the address), and coordinates for structured data
- [ ] Domain and Iranian hosting account
- [ ] sms.ir: API key saved in Vercel (Sensitive). Still needed: register templates 1–3 (final texts in docs/sms-templates.md) and send their numeric IDs for `SMSIR_TEMPLATE_OTP`, `_CONFIRMED`, `_REMINDER`; each goes live as soon as its ID is set (cancel/move SMS are optional; staff call instead)
- [ ] Clinic legal name, if different from «کلینیک دکتر فاطمه جعفری»
- [ ] Decision on buying a licensed Persian display font
- [ ] Umami analytics host (optional; `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
