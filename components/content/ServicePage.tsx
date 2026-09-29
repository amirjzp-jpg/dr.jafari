import Image from "next/image";
import Link from "next/link";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { BookingCta } from "@/components/content/BookingCta";
import { DraftNotice } from "@/components/content/DraftNotice";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { cases } from "@/content/cases";
import { articles } from "@/content/journal";
import { ReviewedBy } from "@/components/content/ReviewedBy";
import { COPY_APPROVED, type Service } from "@/content/services";
import { toFaDigits } from "@/lib/digits";
import { faqSchema, medicalWebPageSchema } from "@/lib/seo";

const H2 = ({ children, id }: { children: React.ReactNode; id: string }) => (
  <h2 id={id} className="font-display text-[24px] leading-normal font-semibold lg:text-[32px]">
    {children}
  </h2>
);

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-3 text-[17px] leading-[1.9] text-muted-2">
          <span aria-hidden="true" className="mt-[13px] size-1.5 shrink-0 rounded-full bg-blue-mid" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/** Full service page (BUILD-SPEC.md section 6): composite and veneers. */
export function ServicePage({ service }: { service: Service }) {
  const d = service.detail!;
  const short = service.name.replace(" دندان", "");
  const related = articles.filter((a) => a.pillar === service.href);
  const relatedCases = cases.filter((c) => service.caseTitles?.includes(c.title));

  return (
    <>
      <PageHeader title={service.title} lead={service.intro.map((p) => <p key={p}>{p}</p>)} crumbs={[{ name: service.name, path: service.href }]} />
      <JsonLd data={[medicalWebPageSchema(service, service.reviewedAt ?? COPY_APPROVED), faqSchema(d.faq)]} />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          <DraftNotice reviewed={service.reviewed} />
          <ReviewedBy reviewed={service.reviewed} date={service.reviewedAt ?? COPY_APPROVED} />

          <section aria-labelledby="what" className="flex flex-col gap-4">
            <H2 id="what">{short} چیست؟</H2>
            {d.whatItIs.map((p) => (
              <p key={p} className="text-[17px] leading-[2] text-muted-2">
                {p}
              </p>
            ))}
          </section>

          <section aria-labelledby="who" className="flex flex-col gap-4">
            <H2 id="who">برای چه کسانی مناسب است؟</H2>
            <List items={d.whoItSuits} />
          </section>

          <section aria-labelledby="process" className="flex flex-col gap-5">
            <H2 id="process">روند درمان</H2>
            <ol className="flex flex-col gap-4">
              {d.process.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tint font-medium text-primary">
                    {toFaDigits(i + 1)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[17px] font-medium">{s.title}</span>
                    <span className="text-[15px] leading-[1.9] text-muted-2">{s.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-10 md:grid-cols-2">
            <section aria-labelledby="benefits" className="flex flex-col gap-4">
              <H2 id="benefits">مزایا</H2>
              <List items={d.benefits} />
            </section>
            <section aria-labelledby="limits" className="flex flex-col gap-4">
              <H2 id="limits">محدودیت‌ها</H2>
              <List items={d.limitations} />
            </section>
          </div>

          <section aria-labelledby="longevity" className="flex flex-col gap-4">
            <H2 id="longevity">ماندگاری</H2>
            {d.longevity.map((p) => (
              <p key={p} className="text-[17px] leading-[2] text-muted-2">
                {p}
              </p>
            ))}
          </section>

          <section aria-labelledby="aftercare" className="flex flex-col gap-4">
            <H2 id="aftercare">مراقبت پس از درمان</H2>
            <List items={d.aftercare} />
          </section>

          <section aria-labelledby="faq" className="flex flex-col gap-4">
            <H2 id="faq">پرسش‌های رایج</H2>
            <Faq items={d.faq} />
          </section>
        </div>

        {relatedCases.length > 0 && (
          <section aria-labelledby="cases" className="flex flex-col gap-8 pt-16">
            <H2 id="cases">نمونه‌کارها</H2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((c) => (
                <BeforeAfter key={c.label} item={c} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="articles" className="flex flex-col gap-8 pt-16">
            <H2 id="articles">مقالات مرتبط</H2>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link href={`/journal/${a.slug}`} className="flex flex-col gap-3 text-ink no-underline hover:text-primary">
                    <Image
                      src={a.image.card}
                      alt={a.image.alt}
                      width={a.image.cardW}
                      height={a.image.cardH}
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="h-[200px] w-full rounded-[20px] bg-tint object-cover"
                    />
                    <span className="font-display text-xl leading-[1.6] font-semibold">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
      <BookingCta />
    </>
  );
}
