import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { articleText, journalLabels } from "@/content/i18n/articles";
import { articles, latestArticles } from "@/content/journal";
import { intlStaticParams, metaLang, pageLang } from "@/lib/intl-route";
import { localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = intlStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await metaLang(params);
  if (!lang) return {};
  const l = journalLabels[lang];
  return buildMetadata({ lang, title: l.metaTitle, description: l.metaDescription, path: localePath(lang, "/journal") });
}

export default async function JournalIndex({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await pageLang(params);
  const l = journalLabels[lang];
  return (
    <>
      <PageHeader lang={lang} title={l.indexTitle} lead={l.indexLead} crumbs={[{ name: l.crumb, path: localePath(lang, "/journal") }]} />
      <Container className="pb-24">
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {latestArticles(articles.length).map((a, i) => {
            const t = articleText[lang][a.slug];
            return (
              <li key={a.slug}>
                <Link href={localePath(lang, `/journal/${a.slug}`)} className="flex flex-col gap-4 text-ink no-underline hover:text-ink">
                  <Image
                    src={a.image.card}
                    alt={t.imageAlt}
                    width={a.image.cardW}
                    height={a.image.cardH}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="h-[250px] w-full rounded-[20px] bg-tint object-cover"
                  />
                  <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{t.category}</span>
                  <h2 className="font-display text-[22px] leading-[1.6] font-semibold">{t.title}</h2>
                  <span className="text-[15px] leading-[1.9] text-muted">{t.excerpt}</span>
                  <span className="text-[13px] text-muted">{l.minutes(a.readMinutes)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
