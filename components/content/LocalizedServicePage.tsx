import Image from "next/image";
import Link from "next/link";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { BookingCta } from "@/components/content/BookingCta";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { cases } from "@/content/cases";
import { articleText, journalLabels } from "@/content/i18n/articles";
import { homeCopy } from "@/content/i18n/home";
import { serviceContent, serviceLabels, type ServiceContent } from "@/content/i18n/services";
import { articles } from "@/content/journal";
import type { Service } from "@/content/services";
import { localePath, type IntlLocale } from "@/lib/i18n";
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

/**
 * A service page in Arabic or English. The structure is the Persian ServicePage's;
 * the text comes from content/i18n/services-*.ts. There is no reviewer line: this
 * text has not been reviewed by the doctor.
 */
export function LocalizedServicePage({ lang, service }: { lang: IntlLocale; service: Service }) {
  const text: ServiceContent = serviceContent[lang][service.slug];
  const d = text.detail;
  const l = serviceLabels[lang];
  const crumbs = service.featured
    ? [{ name: text.name, path: localePath(lang, service.href) }]
    : [
        { name: l.servicesTitle, path: localePath(lang, "/services") },
        { name: text.name, path: localePath(lang, service.href) },
      ];
  const relatedCases = cases
    .map((c, i) => ({ ...c, title: homeCopy[lang].cases.titles[i] ?? c.title, label: `${i + 1}`, persianTitle: c.title }))
    .filter((c) => service.caseTitles?.includes(c.persianTitle));
  const faq = d ? d.faq : (text.faq ?? []);
  const related = articles.filter((a) => a.pillar === service.href || a.alsoRelatedTo?.includes(service.href));

  return (
    <>
      <PageHeader lang={lang} title={text.title} lead={text.intro.map((p) => <p key={p}>{p}</p>)} crumbs={crumbs} />
      <JsonLd data={[medicalWebPageSchema(service, { lang, text }), ...(faq.length ? [faqSchema(faq)] : [])]} />
      <Container>
        <div className="flex max-w-[760px] flex-col gap-14 pb-4">
          {d ? (
            <>
              <section aria-labelledby="what" className="flex flex-col gap-4">
                <H2 id="what">{d.whatTitle}</H2>
                {d.whatItIs.map((p) => (
                  <p key={p} className="text-[17px] leading-[2] text-muted-2">
                    {p}
                  </p>
                ))}
              </section>

              <section aria-labelledby="who" className="flex flex-col gap-4">
                <H2 id="who">{d.whoTitle}</H2>
                <List items={d.whoItSuits} />
              </section>

              <section aria-labelledby="process" className="flex flex-col gap-5">
                <H2 id="process">{l.process}</H2>
                <ol className="flex flex-col gap-4">
                  {d.process.map((s, i) => (
                    <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tint font-medium text-primary">
                        {i + 1}
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
                  <H2 id="benefits">{l.benefits}</H2>
                  <List items={d.benefits} />
                </section>
                <section aria-labelledby="limits" className="flex flex-col gap-4">
                  <H2 id="limits">{l.limits}</H2>
                  <List items={d.limitations} />
                </section>
              </div>

              {d.longevity.length > 0 && (
                <section aria-labelledby="longevity" className="flex flex-col gap-4">
                  <H2 id="longevity">{d.longevityTitle}</H2>
                  {d.longevity.map((p) => (
                    <p key={p} className="text-[17px] leading-[2] text-muted-2">
                      {p}
                    </p>
                  ))}
                </section>
              )}

              <section aria-labelledby="aftercare" className="flex flex-col gap-4">
                <H2 id="aftercare">{l.aftercare}</H2>
                <List items={d.aftercare} />
              </section>
            </>
          ) : (
            <p className="text-[17px] leading-[2] text-muted-2">{l.bookingNote}</p>
          )}

          {faq.length > 0 && (
            <section aria-labelledby="faq" className="flex flex-col gap-4">
              <H2 id="faq">{l.faq}</H2>
              <Faq items={faq} />
            </section>
          )}
        </div>

        {relatedCases.length > 0 && (
          <section aria-labelledby="cases" className="flex flex-col gap-8 pt-16">
            <H2 id="cases">{l.cases}</H2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((c) => (
                <BeforeAfter key={c.label} item={c} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="articles" className="flex flex-col gap-8 pt-16">
            <H2 id="articles">{journalLabels[lang].related}</H2>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => {
                const t = articleText[lang][a.slug];
                return (
                  <li key={a.slug}>
                    <Link href={localePath(lang, `/journal/${a.slug}`)} className="flex flex-col gap-3 text-ink no-underline hover:text-primary">
                      <Image
                        src={a.image.card}
                        alt={t.imageAlt}
                        width={a.image.cardW}
                        height={a.image.cardH}
                        sizes="(min-width: 1024px) 380px, 100vw"
                        className="h-[200px] w-full rounded-[20px] bg-tint object-cover"
                      />
                      <span className="font-display text-xl leading-[1.6] font-semibold">{t.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </Container>
      <BookingCta lang={lang} />
    </>
  );
}
