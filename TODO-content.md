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
- [ ] Confirm the booking-policy defaults (24 h notice, 15 min lateness, no-show rule)
- [ ] Exact map pins for Neshan, Balad and Google Maps (the «مسیریابی» link currently searches the address), and coordinates for structured data
- [ ] Domain and Iranian hosting account
- [ ] sms.ir account, API key and approved template IDs
- [ ] Clinic legal name, if different from «کلینیک دکتر فاطمه جعفری»
- [ ] Decision on buying a licensed Persian display font
- [ ] Umami analytics host (optional; `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
