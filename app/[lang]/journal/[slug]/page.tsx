import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/content/JsonLd";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { articleDate, articleText, journalLabels, qaFromArticle } from "@/content/i18n/articles";
import { INTL_UPDATED, serviceContent } from "@/content/i18n/services";
import { bookingFor, externalProps } from "@/content/i18n/ui";
import { pagesCopy } from "@/content/i18n/pages";
import { articleBySlug, articles, type Block } from "@/content/journal";
import { services } from "@/content/services";
import { intlLocales, isIntl, localePath } from "@/lib/i18n";
import { abs, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { displayTitle } from "@/lib/title-case";

export const dynamicParams = false;
export function generateStaticParams() {
  return intlLocales.flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = articleBySlug(slug);
  if (!isIntl(lang) || !a) return {};
  const t = articleText[lang][slug];
  return buildMetadata({
    lang,
    title: t.metaTitle,
    description: t.metaDescription,
    path: localePath(lang, `/journal/${a.slug}`),
    type: "article",
    image: { url: a.image.hero, width: 1600, height: 900, alt: t.imageAlt },
    publishedTime: INTL_UPDATED,
    modifiedTime: INTL_UPDATED,
    authors: [abs("/")],
  });
}

function Body({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) =>
    "h2" in b ? (
      <h2 key={i} className="mt-4 font-display text-[24px] leading-normal font-semibold lg:text-[28px]">
        {b.h2}
      </h2>
    ) : "ul" in b ? (
      <ul key={i} className="flex flex-col gap-2.5">
        {b.ul.map((li) => (
          <li key={li} className="flex gap-3 text-[17px] leading-[2] text-muted-2">
            <span aria-hidden="true" className="mt-[14px] size-1.5 shrink-0 rounded-full bg-blue-mid" />
            {li}
          </li>
        ))}
      </ul>
    ) : (
      <p key={i} className="text-[17px] leading-[2.05] text-muted-2">
        {b.p}
      </p>
    ),
  );
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const a = articleBySlug(slug);
  if (!isIntl(lang) || !a) notFound();
  const t = articleText[lang][slug];
  const l = journalLabels[lang];
  const here = localePath(lang, `/journal/${a.slug}`);
  const pillar = services.find((s) => s.href === a.pillar)!;
  const pillarName = serviceContent[lang][pillar.slug].name;
  const book = bookingFor(lang);
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const qa = qaFromArticle(lang, t.title, t.body);
  // The booking box sits about three quarters of the way down, never between a heading and its text.
  let half = Math.ceil(t.body.length * 0.75);
  while (half > 1 && "h2" in t.body[half - 1]) half--;

  return (
    <article>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: displayTitle(lang, t.title),
            description: t.excerpt,
            image: abs(a.image.hero),
            datePublished: INTL_UPDATED,
            dateModified: INTL_UPDATED,
            inLanguage: lang,
            author: { "@id": abs("/#clinic") },
            publisher: { "@id": abs("/#clinic") },
            mainEntityOfPage: abs(here),
          },
          breadcrumbSchema([
            { name: pagesCopy[lang].home, path: localePath(lang, "/") },
            { name: l.crumb, path: localePath(lang, "/journal") },
            { name: t.title, path: here },
          ]),
          ...(qa.length ? [faqSchema(qa)] : []),
        ]}
      />
      <Container className="flex flex-col items-center gap-6 pt-8 lg:pt-14">
        <div className="flex w-full max-w-[680px] flex-col gap-4">
          <nav aria-label={pagesCopy[lang].breadcrumbLabel} className="text-[13px] text-muted">
            <Link href={localePath(lang, "/")} className="-my-2.5 inline-block py-2.5 text-muted no-underline hover:text-primary">
              {pagesCopy[lang].home}
            </Link>{" "}
            /{" "}
            <Link href={localePath(lang, "/journal")} className="-my-2.5 inline-block py-2.5 text-muted no-underline hover:text-primary">
              {l.crumb}
            </Link>
          </nav>
          <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{t.category}</span>
          <h1 className="font-display text-[30px] leading-normal font-semibold lg:text-[44px]">{displayTitle(lang, t.title)}</h1>
          <p className="flex gap-3 text-[13px] text-muted">
            <time dateTime={INTL_UPDATED}>{articleDate(INTL_UPDATED, lang)}</time>
            <span aria-hidden="true">·</span>
            <span>{l.minutes(a.readMinutes)}</span>
          </p>
        </div>
        <Image
          src={a.image.hero}
          alt={t.imageAlt}
          width={1600}
          height={900}
          priority
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="aspect-video w-full max-w-[1000px] rounded-[24px] bg-tint object-cover"
        />
        <div className="flex w-full max-w-[680px] flex-col gap-5 pt-4">
          <Body blocks={t.body.slice(0, half)} />
          <aside className="my-4 flex flex-col gap-3 rounded-[24px] bg-tint p-6">
            <p className="font-display text-xl font-semibold">{l.asideTitle(pillarName)}</p>
            <p className="text-[15px] text-muted-2">{l.asideBody}</p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={book.href} size="md" data-umami-event="book_cta" {...(book.external ? externalProps : {})}>
                {book.label}
              </ButtonLink>
              <Link href={localePath(lang, pillar.href)} className="py-3 text-sm">
                {l.asideLink(pillarName)}
              </Link>
            </div>
          </aside>
          <Body blocks={t.body.slice(half)} />
        </div>
      </Container>
      <Container className="pt-16 pb-24">
        <h2 className="mb-8 font-display text-[24px] font-semibold lg:text-[30px]">{l.related}</h2>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {related.map((r) => {
            const rt = articleText[lang][r.slug];
            return (
              <li key={r.slug}>
                <Link href={localePath(lang, `/journal/${r.slug}`)} className="flex flex-col gap-3 text-ink no-underline hover:text-primary">
                  <Image
                    src={r.image.card}
                    alt={rt.imageAlt}
                    width={r.image.cardW}
                    height={r.image.cardH}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-[220px] w-full rounded-[20px] bg-tint object-cover"
                  />
                  <span className="font-display text-xl leading-[1.6] font-semibold">{rt.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </article>
  );
}
