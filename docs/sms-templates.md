# SMS templates (sms.ir)

**Decision: register templates 1–3** (code, confirmation, reminder). Templates 4 and 5 are optional: while they are not set up, the admin panel shows «بدون پیامک» after a cancel or move, so staff call the patient instead. The texts stay here in case the clinic adds them later.

Final texts to register in the sms.ir panel under «قالب‌ها», one template each. Copy each block exactly; line breaks matter. Parameter names (`#CODE#`, `#NAME#`, `#DATE#`, `#TIME#`) must stay as written, because the site fills them in by name. After approval, put each template's numeric ID in the matching Vercel variable (Sensitive is not needed for IDs); that message type goes live on the next deploy.

Writing rules behind these texts: Persian SMS are Unicode, so one part is 70 characters and longer messages are billed per 67-character part. The phone number is in Latin digits so phones make it tappable. The signature «کلینیک دکتر جعفری» is used instead of a first name. Patient messages open warmly («#NAME# عزیز، سلام», «منتظر دیدارتان هستیم»). Clinic-initiated changes open with an apology. The login code carries an anti-phishing line.

## 1. Login and booking code → `SMSIR_TEMPLATE_OTP`
1 part (67 characters). No name: the patient is not known yet when the code is sent

```
سلام، کد تأیید شما: #CODE#
این کد را به کسی ندهید.
کلینیک دکتر جعفری
```

## 2. Booking confirmed → `SMSIR_TEMPLATE_CONFIRMED`
3 parts (170–183 characters). Sent once per booking, so the warm greeting, address, phone and clinic name are worth the third part

```
#NAME# عزیز، سلام
نوبت شما برای #DATE# ساعت #TIME# با موفقیت ثبت شد. منتظر دیدارتان هستیم.
نشانی: پل معالی‌آباد، ساختمان موجودی، طبقه‌ی ۴
کلینیک دکتر جعفری 09023023120
```

## 3. Reminder, the day before at 18:00 → `SMSIR_TEMPLATE_REMINDER`
2 parts (114–119 characters)

```
#NAME# عزیز، سلام
یادآوری دوستانه: نوبت شما فردا ساعت #TIME# است. منتظر دیدارتان هستیم.
کلینیک دکتر جعفری 09023023120
```

## 4. Cancelled by the clinic → `SMSIR_TEMPLATE_CANCELLED` (optional, not registered for now)
2 parts (about 101 characters)

```
#NAME# عزیز، با پوزش نوبت #DATE# ساعت #TIME# لغو شد.
برای زمان جدید: 09023023120
کلینیک دکتر جعفری
```

## 5. Moved by the clinic → `SMSIR_TEMPLATE_MOVED` (optional, not registered for now)
2 parts (about 111 characters)

```
#NAME# عزیز، با پوزش نوبت شما به #DATE# ساعت #TIME# تغییر کرد.
اگر مناسب نیست: 09023023120
کلینیک دکتر جعفری
```

## What the site sends

| Parameter | Example | Notes |
|---|---|---|
| `#CODE#` | `48213` | 5 digits |
| `#NAME#` | `مریم` | first name only, at most 20 characters |
| `#DATE#` | `دوشنبه ۶ مهر` | weekday and Jalali day and month |
| `#TIME#` | `۱۷:۳۰` | Tehran time |
