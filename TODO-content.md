# Content still missing

Every `[؟]` placeholder on the site must be listed here. Nothing ships while this list has open items. (As of now the site has none.)

## Done
- [x] About copy (no university, at the doctor's request) and medical council number 169473
- [x] Final copy for all service pages, journal articles, privacy and booking policy (doctor's full copywriting approval)
- [x] Before/after case photos (3 cases, cropped to the mouth at matched scale in `public/images/cases/`)

## Still needed
- [ ] Written consent from the 3 before/after patients, kept on file by the clinic
- [ ] Written consent from the patients visible in `about-main.webp` and `about-detail.webp`, or blur/re-crop them
- [ ] Confirm the treatment named on each before/after case («کامپوزیت ونیر», «لمینت سرامیکی», «طراحی لبخند»); optionally tooth and session counts (`content/cases.ts`; the line is hidden until set)
- [ ] Confirm the booking-policy defaults (24 h notice, 15 min lateness, no-show rule)
- [ ] Hand-refined portrait cutout (the current one has a grey fringe on the hair)
- [ ] Exact map pins for Neshan, Balad and Google Maps (the «مسیریابی» link currently searches the address), and coordinates for structured data
- [ ] Instagram URL (the footer link is hidden until set in `lib/site.ts`)
- [ ] Domain and Iranian hosting account
- [ ] sms.ir account, API key and approved template IDs
- [ ] Clinic legal name, if different from «کلینیک دکتر ندا جعفری»
- [ ] Decision on buying a licensed Persian display font
- [ ] Umami analytics host (optional; `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
- [ ] Before launch: re-save `OTP_SECRET` in Vercel as a Sensitive variable
