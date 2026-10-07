import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/content/BookingCta";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { PhoneIcon, PinIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { services } from "@/content/services";
import { abs, buildMetadata } from "@/lib/seo";
import { bookingHref, bookingLabel, site } from "@/lib/site";

const path = "/dentist-maaliabad-shiraz";

export const metadata: Metadata = buildMetadata({
  title: "دندانپزشکی زیبایی در معالی‌آباد شیراز",
  description:
    "کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز، پل معالی‌آباد، جنب بانک تجارت. نشانی، ساعت کاری، خدمات و رزرو آنلاین نوبت.",
  path,
});

const H2 = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <h2 id={id} className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
    {children}
  </h2>
);
const row = "flex flex-col gap-1.5 border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0";
const label = "text-[13px] text-muted-2";

export default function MaaliabadPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": abs(`${path}#page`),
          url: abs(path),
          name: "دندانپزشکی زیبایی در معالی‌آباد شیراز",
          inLanguage: "fa",
          about: { "@id": abs("/#clinic") },
          isPartOf: { "@id": abs("/#website") },
          dateModified: "2026-10-03",
        }}
      />
      <PageHeader
        title="دندانپزشکی زیبایی در معالی‌آباد شیراز"
        crumbs={[{ name: "دندانپزشکی در معالی‌آباد", path }]}
        lead={
          <p>
            کلینیک دندانپزشکی زیبایی دکتر فاطمه جعفری در شیراز، پل معالی‌آباد قرار دارد: ابتدای تاچارا، روبه‌روی پل و جنب بانک تجارت، در ساختمان موجودی، طبقه‌چهار.
          </p>
        }
      />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          <section aria-labelledby="where" className="flex flex-col gap-5">
            <H2 id="where">نشانی و ساعت کاری</H2>
            <dl className="flex flex-col rounded-[24px] border border-line bg-surface px-6 py-6 text-base leading-[1.9] lg:px-8">
              <div className={row}>
                <dt className={label}>نشانی</dt>
                <dd className="flex gap-2.5">
                  <PinIcon size={20} className="mt-1.5 shrink-0 text-primary" />
                  <address className="not-italic">{site.address}</address>
                </dd>
              </div>
              <div className={row}>
                <dt className={label}>ساعات کاری</dt>
                <dd>
                  {site.hours}
                  <span className="block text-sm text-muted-2">{site.closedDays}</span>
                </dd>
              </div>
              <div className={row}>
                <dt className={label}>تلفن</dt>
                <dd className="flex items-center gap-2.5">
                  <PhoneIcon size={20} className="shrink-0 text-primary" />
                  <PhoneLink />
                </dd>
              </div>
            </dl>
            <div>
              <DirectionsLink />
            </div>
          </section>

          <section aria-labelledby="treatments" className="flex flex-col gap-4">
            <H2 id="treatments">در این کلینیک چه درمان‌هایی انجام می‌شود؟</H2>
            <p className="text-[17px] leading-[2] text-muted-2">
              کامپوزیت دندان، لمینت سرامیکی و طراحی لبخند خدمات اصلی کلینیک هستند. بلیچینگ، ایمپلنت، ترمیم، عصب‌کشی، جراحی و ارتودنسی هم انجام می‌شوند. هر خدمت صفحه‌ی توضیح خودش را دارد.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="flex h-full flex-col gap-1 rounded-[20px] border border-line bg-surface p-5 no-underline transition-colors hover:border-champagne"
                  >
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="text-sm leading-[1.8] text-muted-2">{s.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="booking" className="flex flex-col gap-4">
            <H2 id="booking">نوبت‌گیری</H2>
            <p className="text-[17px] leading-[2] text-muted-2">
              اولین مراجعه معمولاً یک جلسه‌ی «معاینه و مشاوره» ۳۰ دقیقه‌ای است. می‌توانید روز و ساعت دلخواه را از صفحه‌ی رزرو انتخاب و با کد پیامکی تأیید کنید، یا تماس بگیرید.
            </p>
            <div>
              <ButtonLink href={bookingHref} data-umami-event="book_cta">
                {bookingLabel}
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="doctor" className="flex flex-col gap-4">
            <H2 id="doctor">درباره‌ی دکتر</H2>
            <p className="text-[17px] leading-[2] text-muted-2">
              دکتر فاطمه جعفری، دندانپزشک زیبایی با بیش از ۱۰ سال تجربه، شماره‌ی نظام پزشکی {site.councilNumber}.{" "}
              <Link href="/about">درباره‌ی دکتر بیشتر بخوانید</Link>
            </p>
          </section>
        </div>
      </Container>
      <BookingCta />
    </>
  );
}
