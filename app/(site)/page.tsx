import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { PhoneIcon } from "@/components/icons/ui";
import { ServiceIcon } from "@/components/icons/services";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneLinks } from "@/components/ui/PhoneLinks";
import { cases } from "@/content/cases";
import { latestArticles } from "@/content/journal";
import { featuredServices, otherServices } from "@/content/services";
import { toFaDigits } from "@/lib/digits";
import { dentistSchema, personSchema } from "@/lib/seo";
import { bookingHref, bookingLabel, site } from "@/lib/site";
import aboutDetail from "@/public/images/doctor/about-detail.webp";
import aboutMain from "@/public/images/doctor/about-main.webp";
import drHero from "@/public/images/doctor/dr-hero.webp";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={[dentistSchema(), personSchema()]} />
      <Hero />
      <Stats />
      <About />
      <Cases />
      <Services />
      <Journal />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <>
      {/* The tint→ivory gradient runs behind the header too. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[900px] bg-linear-to-b from-tint via-[#E8EFF3] via-58% to-ivory lg:h-[816px]"
      />
      <Container className="flex flex-col lg:h-[720px] lg:flex-row lg:items-stretch lg:gap-10">
        {/* Text: first in reading order, shown after the portrait block on desktop (left side in RTL). */}
        <div className="order-1 flex flex-col gap-2 pt-[18px] lg:order-2 lg:grow lg:justify-center lg:gap-[22px] lg:pt-0 lg:pb-[60px]">
          <div className="hidden lg:block">
            <Eyebrow>کلینیک دندانپزشکی زیبایی</Eyebrow>
          </div>
          <h1 className="font-display text-[34px] leading-normal font-semibold lg:text-[54px] lg:leading-normal xl:text-[68px] xl:whitespace-nowrap">
            {site.tagline}
          </h1>
          <p className="text-[19px] text-primary lg:text-[26px]">کامپوزیت · لمینت سرامیکی</p>
          <p className="hidden max-w-[440px] text-[17px] leading-[2] text-muted lg:block">
            کلینیکی مجهز به تجهیزات و فناوری‌های روز دندانپزشکی، برای لبخندی طبیعی و ماندگار.
          </p>
          <div className="mt-3.5 hidden items-center gap-7 lg:flex">
            <ButtonLink href={bookingHref} data-umami-event="book_cta">
              {bookingLabel}
            </ButtonLink>
            <span className="flex items-center gap-2.5 text-[15px]">
              <PhoneIcon size={18} className="text-primary" />
              <PhoneLinks />
            </span>
          </div>
        </div>

        {/* Portrait in the arch (positions from design/Mobile.dc.html and Main.dc.html, inline-start = right in RTL) */}
        <div className="relative order-2 -mx-5 mt-4 h-[460px] w-[calc(100%+40px)] max-w-[390px] shrink-0 self-center overflow-x-clip md:mx-auto md:w-full lg:order-1 lg:m-0 lg:h-auto lg:w-[600px] lg:max-w-none lg:overflow-visible">
          <div className="absolute start-[55px] bottom-0 h-[400px] w-[280px] rounded-t-[140px] bg-linear-to-b from-tint-2 via-[#D8E4EE] via-70% to-[rgba(232,239,243,0)] lg:start-[70px] lg:h-[600px] lg:w-[440px] lg:rounded-t-[220px]" />
          <div className="absolute start-[54px] bottom-0 h-[401px] w-[282px] rounded-t-[141px] border border-b-0 border-champagne opacity-55 lg:start-[69px] lg:h-[601px] lg:w-[442px] lg:rounded-t-[221px]" />
          <Image
            src={drHero}
            alt="دکتر ندا جعفری"
            priority
            sizes="(min-width: 1024px) 500px, 350px"
            className="absolute start-[22px] bottom-0 h-[460px] w-auto max-w-none [mask-image:linear-gradient(180deg,#000_80%,transparent_100%)] lg:start-[40px] lg:h-[660px]"
          />
          <div className="absolute end-5 bottom-[38px] flex flex-col gap-0.5 rounded-[14px] border border-line bg-ivory px-4 py-3 lg:end-auto lg:start-[420px] lg:bottom-[150px] lg:min-w-[170px] lg:gap-1 lg:rounded-2xl lg:px-[22px] lg:py-4">
            <span aria-hidden="true" className="mb-1 h-px w-[22px] bg-champagne lg:mb-1.5 lg:w-7" />
            <span className="font-display text-base font-semibold lg:text-[19px]">{site.name}</span>
            <span className="text-xs text-muted lg:text-[13px]">بیش از ۱۰ سال تجربه</span>
          </div>
        </div>

        {/* Phones on mobile (the sticky bar carries the booking button). */}
        <p className="order-3 mt-6 flex items-center justify-center gap-2.5 text-[15px] lg:hidden">
          <PhoneIcon size={18} className="text-primary" />
          <PhoneLinks />
        </p>
      </Container>
    </>
  );
}

function Stats() {
  const items = [
    { big: "+۱۰ سال", small: "تجربه در دندانپزشکی زیبایی" },
    { big: "کامپوزیت و لمینت", small: "تمرکز اصلی کلینیک" },
    { big: "پرداخت اقساطی", small: "برای درمان‌های زیبایی" },
  ];
  return (
    <section aria-label="درباره‌ی کلینیک">
      <Container className="pt-10 pb-6 lg:pt-14">
        <ul className="grid grid-cols-1 border-y border-line md:grid-cols-3">
          {items.map((it, i) => (
            <li
              key={it.big}
              className={`flex flex-col gap-1.5 py-6 md:py-9 ${
                i > 0 ? "border-t border-line md:border-t-0 md:border-s" : ""
              } ${i === 0 ? "md:pe-10" : i === 1 ? "md:px-10" : "md:ps-10"}`}
            >
              <span className="font-display text-[26px] font-semibold text-primary lg:text-[34px]">{it.big}</span>
              <span className="text-[15px] text-muted">{it.small}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function About() {
  const rows = [
    { k: "رویکرد", v: "حفظ حداکثری بافت دندان" },
    { k: "طراحی", v: "متناسب با چهره" },
    { k: "مشاوره", v: "بررسی همه‌ی گزینه‌ها پیش از درمان" },
  ];
  return (
    <section id="about" aria-labelledby="about-title">
      <Container className="flex flex-col items-center gap-12 pt-20 pb-10 lg:flex-row lg:gap-24 lg:pt-32">
        <div className="relative aspect-[560/640] w-full max-w-[560px] shrink-0 lg:w-[560px]">
          <div className="absolute start-0 top-0 h-[90.6%] w-[75%] overflow-hidden rounded-[50%_50%_24px_24px/36.2%_36.2%_24px_24px] bg-tint">
            <Image
              src={aboutMain}
              alt="دکتر ندا جعفری در حال درمان یک بیمار در کلینیک"
              fill
              sizes="(min-width: 1024px) 420px, 75vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-px -top-px h-[calc(90.6%+1px)] w-[calc(75%+2px)] rounded-[50%_50%_25px_25px/36.2%_36.2%_25px_25px] border border-champagne opacity-55"
          />
          <div className="absolute end-0 bottom-0 h-[42%] w-[44.6%] overflow-hidden rounded-[20px] border-8 border-ivory bg-tint">
            <Image
              src={aboutDetail}
              alt="دکتر ندا جعفری هنگام معاینه"
              fill
              sizes="(min-width: 1024px) 250px, 45vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
        </div>
        <div className="flex grow flex-col gap-[18px]">
          <Eyebrow>آشنایی با دکتر</Eyebrow>
          <h2 id="about-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[44px]">
            دقت در جزئیات، برای لبخندی طبیعی
          </h2>
          <p className="text-[17px] leading-[2.1] text-muted-2">
            دکتر ندا جعفری، دانش‌آموخته‌ی دندانپزشکی از [دانشگاه ؟]، بیش از ده سال است که در زمینه‌ی دندانپزشکی زیبایی
            فعالیت می‌کند. [یک یا دو جمله درباره‌ی رویکرد درمان، از زبان خود دکتر.]
          </p>
          <dl className="mt-2 flex flex-col text-[15px]">
            {rows.map((r, i) => (
              <div
                key={r.k}
                className={`flex justify-between gap-6 border-t border-line py-3.5 ${i === rows.length - 1 ? "border-b" : ""}`}
              >
                <dt className="text-muted">{r.k}</dt>
                <dd className="text-end">{r.v}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/about" variant="outline" size="md" className="mt-2.5 self-start !h-12 !px-[30px] text-sm">
            درباره‌ی دکتر جعفری
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function Cases() {
  return (
    <section id="cases" aria-labelledby="cases-title">
      <Container className="flex flex-col items-center gap-14 pt-24 pb-24 lg:pt-[120px] lg:pb-28">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <Eyebrow centered>نمونه‌کارها</Eyebrow>
          <h2 id="cases-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[46px]">
            نتیجه را خودتان مقایسه کنید
          </h2>
          <p className="text-base text-muted">خط وسط هر تصویر را بکشید تا قبل و بعد از درمان را ببینید.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cases.map((c) => (
            <BeforeAfter key={c.label} item={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Services() {
  return (
    <section id="services" aria-labelledby="services-title">
      <Container className="flex flex-col gap-12 pt-10 pb-24 lg:flex-row lg:gap-24 lg:pb-[120px]">
        <div className="flex shrink-0 flex-col gap-4 pt-2 lg:w-[340px]">
          <Eyebrow>خدمات کلینیک</Eyebrow>
          <h2 id="services-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[44px]">
            لبخند شما، با دقت و ظرافت
          </h2>
          <p className="text-base leading-[2] text-muted">
            تمرکز اصلی کلینیک بر کامپوزیت و لمینت سرامیکی است؛ در کنار آن، خدمات کامل دندانپزشکی نیز ارائه می‌شود.
          </p>
        </div>
        <div className="flex grow flex-col gap-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredServices.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="group flex min-h-[250px] flex-col gap-3 rounded-[24px] bg-linear-160 from-tint to-[#EEF2F3] p-8 text-ink no-underline hover:text-ink lg:p-10"
              >
                <span className="mb-1 flex size-16 items-center justify-center rounded-[20px] bg-surface">
                  <ServiceIcon name={s.icon} size={34} />
                </span>
                <span className="font-display text-[26px] font-semibold lg:text-[30px]">{s.name}</span>
                <span className="text-[15px] leading-[1.9] text-muted-2">{s.short}</span>
                <span className="mt-auto text-sm font-medium text-primary group-hover:text-primary-hover">
                  بیشتر بدانید ←
                </span>
              </Link>
            ))}
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
            {otherServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className="flex h-[84px] items-center gap-[18px] border-b border-line text-ink no-underline hover:text-primary"
                >
                  <span className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl border border-line bg-surface">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span className="grow text-lg">{s.name}</span>
                  <span aria-hidden="true" className="text-[15px] text-primary">
                    ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Journal() {
  const posts = latestArticles(3);
  return (
    <section id="journal" aria-labelledby="journal-title">
      <Container className="flex flex-col gap-12 pt-10 pb-24 lg:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>مجله</Eyebrow>
            <h2 id="journal-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[44px]">
              پیش از تصمیم، بیشتر بدانید
            </h2>
          </div>
          <ButtonLink href="/journal" variant="outline" size="md" className="!h-12 !px-[30px] text-sm">
            همه‌ی مقالات
          </ButtonLink>
        </div>
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((a) => (
            <li key={a.slug}>
              <Link href={`/journal/${a.slug}`} className="flex flex-col gap-4 text-ink no-underline hover:text-ink">
                <Image
                  src={a.image.card}
                  alt={a.image.alt}
                  width={a.image.cardW}
                  height={a.image.cardH}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  className="h-[250px] w-full rounded-[20px] bg-tint object-cover"
                />
                <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{a.category}</span>
                <span className="font-display text-[22px] leading-[1.6] font-semibold">{a.title}</span>
                <span className="text-[15px] leading-[1.9] text-muted">{a.excerpt}</span>
                <span className="text-[13px] text-muted">{toFaDigits(a.readMinutes)} دقیقه مطالعه</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-6">
      <Container>
        <div className="flex flex-col justify-between gap-12 rounded-[32px] bg-linear-160 from-tint to-[#EDF1F3] px-6 py-12 lg:flex-row lg:gap-20 lg:px-[88px] lg:py-20">
          <div className="flex max-w-[480px] flex-col gap-[18px]">
            <Eyebrow>رزرو نوبت</Eyebrow>
            <h2 id="contact-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[42px]">
              از یک جلسه‌ی مشاوره شروع کنید
            </h2>
            <p className="text-base leading-[2] text-muted-2">
              در این جلسه وضعیت دندان‌ها بررسی می‌شود و گزینه‌های درمان مناسب شما را با هم مرور می‌کنیم.
            </p>
            <div className="mt-2">
              <ButtonLink href={bookingHref} data-umami-event="book_cta">
                {bookingLabel}
              </ButtonLink>
            </div>
          </div>
          <dl className="flex flex-col text-base leading-[1.9] lg:w-[440px]">
            <div className="flex flex-col gap-1 border-b border-[#D2DCE4] pb-5">
              <dt className="text-[13px] text-muted-2">تلفن</dt>
              <dd>
                <PhoneLinks />
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[#D2DCE4] py-5">
              <dt className="text-[13px] text-muted-2">نشانی</dt>
              <dd>
                {site.address}
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="ms-2 text-sm whitespace-nowrap">
                  مسیریابی
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-1 pt-5">
              <dt className="text-[13px] text-muted-2">ساعات کاری</dt>
              <dd>
                {site.hours}
                <span className="block text-sm text-muted-2">{site.closedDays}</span>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
