# Content still missing

Every `[؟]` placeholder on the site must be listed here. Nothing ships while this list has open items. (As of now the site has none.)

## Done
- [x] Domain dandanpezeshkishiraz.ir (nic.ir) and the HostIran VPS; server set up with nginx, a database and nightly backups
- [x] sms.ir live (2026-10-04): code, confirmation and reminder templates approved and set on the server (docs/sms-templates.md). The confirmation was shortened to about 2 parts after the 4-part version arrived 13 minutes late
- [x] About copy (no university, at the doctor's request) and medical council number 169473
- [x] Final copy for all service pages, journal articles, privacy and booking policy (doctor's full copywriting approval)
- [x] Hero portrait: new photo from the clinic, cut out cleanly (no fringe on the hair)
- [x] Before/after case photos (3 cases, cropped to the mouth at matched scale in `public/images/cases/`)
- [x] Treatment names on the homepage before/after cases, approved by the creative lead
- [x] Gallery: 10 clinic photos with treatment labels approved (creative lead has full creative control); tooth jewellery and the clinic video left out (see docs/decisions.md)
- [x] `OTP_SECRET` rotated and stored as a Sensitive variable (Production + Preview); `CRON_SECRET` added (Sensitive), so reminders and the daily cleanup run
- [x] Instagram: @dr_nedajafarii (footer, contact section, gallery page, structured data)

## Still needed
- [ ] **Arabic and English (round 1 done; needs people).** Home, about, location, contact, gallery, privacy, booking policy, services index and all 10 services exist in both languages. Still needed: (1) a native Arabic and a native English proofreader; (2) the doctor's confirmation of every treatment description; (3) the clinic's approval of the additions that have no Persian original: the contact page, the WhatsApp section of the privacy page, and the WhatsApp/phone line in the booking policy; (4) a plan for WhatsApp messages in Arabic or English, since the staff speak Persian only; (5) later, the journal articles in both languages. Decided: no instalments or prices for patients abroad; WhatsApp +98 917 720 3937 is the right number (it is also an admin login number).
- [ ] Register the site in Google Search Console and Bing Webmaster Tools (domain property by DNS TXT record at HostIran), then submit /sitemap.xml
- [ ] Delete the four sms.ir API keys that were pasted into a chat; keep only the one stored on the server
- [ ] **Doctor approval of the content drafts** in `docs/content-drafts/`: seven service pages (`service-pages.md`) and six articles (`articles.md`). Every `[؟]` must be answered or the sentence removed, and every «✓ تأیید شود» confirmed, before anything goes on the site. Nothing from these files is published yet.
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

- [ ] Clinic legal name, if different from «کلینیک دکتر فاطمه جعفری»
- [ ] Decision on buying a licensed Persian display font
- [ ] Umami analytics host (optional; `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
