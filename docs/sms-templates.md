# SMS templates (sms.ir)

Final texts to register in the sms.ir panel under «قالب‌ها», one template each. Copy each block exactly; line breaks matter. Parameter names (`#CODE#`, `#NAME#`, `#DATE#`, `#TIME#`) must stay as written, because the site fills them in by name. After approval, put each template's numeric ID in the matching Vercel variable (Sensitive is not needed for IDs); that message type goes live on the next deploy.

Writing rules behind these texts: Persian SMS are Unicode, so one part is 70 characters and longer messages are billed per 67-character part. The phone number is in Latin digits so phones make it tappable. The signature «کلینیک دکتر جعفری» is used instead of a first name. Clinic-initiated changes open with an apology. The login code carries an anti-phishing line.

## 1. Login and booking code → `SMSIR_TEMPLATE_OTP`
1 part (about 61 characters)

```
کد تأیید شما: #CODE#
این کد را به کسی ندهید.
کلینیک دکتر جعفری
```

## 2. Booking confirmed → `SMSIR_TEMPLATE_CONFIRMED`
2 parts (about 121 characters; the address is worth the second part)

```
#NAME# عزیز، نوبت شما #DATE# ساعت #TIME# ثبت شد.
پل معالی‌آباد، ساختمان موجودی، طبقه‌ی ۴
کلینیک دکتر جعفری 09023023120
```

## 3. Reminder, the day before at 18:00 → `SMSIR_TEMPLATE_REMINDER`
1 part (about 63 characters, even for long names, because it has no name)

```
یادآوری: نوبت شما فردا ساعت #TIME#
کلینیک دکتر جعفری 09023023120
```

## 4. Cancelled by the clinic → `SMSIR_TEMPLATE_CANCELLED`
2 parts (about 101 characters)

```
#NAME# عزیز، با پوزش نوبت #DATE# ساعت #TIME# لغو شد.
برای زمان جدید: 09023023120
کلینیک دکتر جعفری
```

## 5. Moved by the clinic → `SMSIR_TEMPLATE_MOVED`
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
