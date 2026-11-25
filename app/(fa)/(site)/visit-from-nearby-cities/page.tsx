import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/content/BookingCta";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { PhoneIcon, PinIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { abs, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { bookingHref, bookingLabel, site } from "@/lib/site";

const path = "/visit-from-nearby-cities";
const title = "دندانپزشکی زیبایی در شیراز برای ساکنان شهرهای فارس";

export const metadata: Metadata = buildMetadata({
  title,
  description:
    "اگر از مرودشت، زرقان، سپیدان، فسا یا شهرهای دیگر فارس برای دندانپزشکی زیبایی به شیراز می‌آیید: نوبت‌گیری، زمان تقریبی درمان‌ها، نشانی و ساعت کاری کلینیک.",
  path,
});

const faq = [
  {
    q: "از شهر دیگری در فارس می‌آیم؛ برای نوبت از کجا شروع کنم؟",
    a: "از جلسه‌ی «معاینه و مشاوره» شروع کنید؛ حدود ۳۰ دقیقه است و برنامه‌ی درمان پس از آن مشخص می‌شود. نوبت را از همین سایت با شماره‌ی موبایل و کد پیامکی بگیرید، یا در واتساب پیام بدهید و بگویید از کدام شهر می‌آیید.",
  },
  {
    q: "برای درمان چند بار باید به شیراز بیایم؟",
    a: "به نوع درمان و وضعیت دندان‌ها بستگی دارد و پس از معاینه مشخص می‌شود. به‌طور تقریبی: درمان‌های سریع و کامپوزیت حدود یک روز، لمینت حدود یک ماه و نصب ایمپلنت حدود یک ماه.",
  },
];

const H2 = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <h2 id={id} className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
    {children}
  </h2>
);
const row = "flex flex-col gap-1.5 border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0";
const label = "text-[13px] text-muted-2";
const para = "text-[17px] leading-[2] text-muted-2";

export default function NearbyCitiesPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": abs(`${path}#page`),
            url: abs(path),
            name: title,
            inLanguage: "fa",
            about: { "@id": abs("/#clinic") },
            isPartOf: { "@id": abs("/#website") },
            dateModified: "2026-11-25",
          },
          breadcrumbSchema([{ name: "شهرهای فارس", path }]),
          faqSchema(faq),
        ]}
      />
      <PageHeader
        title={title}
        crumbs={[{ name: "شهرهای فارس", path }]}
        lead={
          <p>
            ساکنان مرودشت، زرقان، سپیدان، فسا، جهرم، کازرون، داراب و دیگر شهرهای فارس می‌توانند برای نوبت به کلینیک دکتر فاطمه جعفری در معالی‌آباد شیراز مراجعه کنند. این صفحه به برنامه‌ریزی سفرتان کمک می‌کند.
          </p>
        }
      />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          <section aria-labelledby="plan" className="flex flex-col gap-4">
            <H2 id="plan">سفر به شیراز را چطور برنامه‌ریزی کنیم؟</H2>
            <p className={para}>
              اولین مراجعه معمولاً یک جلسه‌ی «معاینه و مشاوره» حدود ۳۰ دقیقه‌ای است. در آن دندان‌ها بررسی می‌شوند و گزینه‌های درمان با هم مرور می‌شوند؛ تعداد جلسه‌ها و هزینه پس از معاینه مشخص می‌شود.
            </p>
            <p className={para}>زمان تقریبی چند درمان، که برای هر فرد پس از معاینه تعیین می‌شود:</p>
            <ul className="flex list-disc flex-col gap-2 ps-6 text-[17px] leading-[1.9] text-muted-2">
              <li>درمان‌های سریع: حدود یک روز</li>
              <li>کامپوزیت: حدود یک روز</li>
              <li>لمینت: حدود یک ماه</li>
              <li>ایمپلنت: حدود یک ماه برای نصب</li>
            </ul>
            <p className={para}>اگر از شهر دیگری می‌آیید، هنگام نوبت‌گیری یا در واتساب بگویید تا درباره‌ی ترتیب جلسه‌ها از کلینیک بپرسید.</p>
          </section>

          <section aria-labelledby="booking" className="flex flex-col gap-4">
            <H2 id="booking">چطور نوبت بگیرم؟</H2>
            <p className={para}>
              از صفحه‌ی رزرو، روز و ساعت دلخواه را انتخاب کنید و با کد پیامکی تأیید کنید، یا در واتساب پیام بدهید، یا تماس بگیرید. ساعت کار: {site.hours}؛ {site.closedDays}.
            </p>
            <div>
              <ButtonLink href={bookingHref} data-umami-event="book_cta">
                {bookingLabel}
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="where" className="flex flex-col gap-5">
            <H2 id="where">نشانی کلینیک</H2>
            <dl className="flex flex-col rounded-[24px] border border-line bg-surface px-6 py-6 text-base leading-[1.9] lg:px-8">
              <div className={row}>
                <dt className={label}>نشانی</dt>
                <dd className="flex gap-2.5">
                  <PinIcon size={20} className="mt-1.5 shrink-0 text-primary" />
                  <address className="not-italic">{site.address}</address>
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
            <p className={para}>
              <Link href="/dentist-maaliabad-shiraz">نشانی کامل و خدمات کلینیک</Link> · <Link href="/services">همه‌ی خدمات</Link> · <Link href="/gallery">نمونه‌کارها</Link>
            </p>
          </section>

          <section aria-labelledby="faq" className="flex flex-col gap-4">
            <H2 id="faq">سؤالات متداول</H2>
            <Faq items={faq} />
          </section>
        </div>
      </Container>
      <BookingCta />
    </>
  );
}
