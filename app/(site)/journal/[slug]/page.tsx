import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftNotice } from "@/components/content/DraftNotice";
import { JsonLd } from "@/components/content/JsonLd";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { articleBySlug, articles, type Block } from "@/content/journal";
import { ReviewedBy } from "@/components/content/ReviewedBy";
import { COPY_APPROVED, serviceBySlug } from "@/content/services";
import { toFaDigits } from "@/lib/digits";
import { abs, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { bookingHref, bookingLabel } from "@/lib/site";
import { jalali, tehranToUtc } from "@/lib/time";

export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  return buildMetadata({
    title: a.metaTitle ?? a.title,
    description: a.metaDescription ?? a.excerpt,
    path: `/journal/${a.slug}`,
    type: "article",
    image: { url: a.image.hero, width: 1600, height: 900, alt: a.image.alt },
    publishedTime: a.published,
    modifiedTime: a.updated ?? a.published,
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const pillar = serviceBySlug(a.pillar.slice(1))!;
  const date = tehranToUtc(a.published, "12:00");
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const half = Math.ceil(a.body.length * 0.75);

  return (
    <article>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            image: abs(a.image.hero),
            datePublished: a.published,
            dateModified: a.updated ?? a.published,
            inLanguage: "fa",
            author: { "@id": abs("/about#doctor") },
            publisher: { "@id": abs("/#clinic") },
            mainEntityOfPage: abs(`/journal/${a.slug}`),
          },
          breadcrumbSchema([
            { name: "خانه", path: "/" },
            { name: "مجله", path: "/journal" },
            { name: a.title, path: `/journal/${a.slug}` },
          ]),
        ]}
      />
      <Container className="flex flex-col items-center gap-6 pt-8 lg:pt-14">
        <div className="flex w-full max-w-[680px] flex-col gap-4">
          <nav aria-label="مسیر صفحه" className="text-[13px] text-muted">
            <Link href="/" className="-my-2.5 inline-block py-2.5 text-muted no-underline hover:text-primary">خانه</Link> / <Link href="/journal" className="-my-2.5 inline-block py-2.5 text-muted no-underline hover:text-primary">مجله</Link>
          </nav>
          <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{a.category}</span>
          <h1 className="font-display text-[30px] leading-normal font-semibold lg:text-[44px]">{a.title}</h1>
          <p className="flex gap-3 text-[13px] text-muted">
            <time dateTime={a.published}>{jalali.full(date)}</time>
            <span aria-hidden="true">·</span>
            <span>{toFaDigits(a.readMinutes)} دقیقه مطالعه</span>
          </p>
        </div>
        <Image
          src={a.image.hero}
          alt={a.image.alt}
          width={1600}
          height={900}
          priority
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="aspect-video w-full max-w-[1000px] rounded-[24px] bg-tint object-cover"
        />
        <div className="flex w-full max-w-[680px] flex-col gap-5 pt-4">
          <DraftNotice reviewed={a.reviewed} />
          <ReviewedBy reviewed={a.reviewed} date={a.reviewedAt ?? COPY_APPROVED} />
          <Body blocks={a.body.slice(0, half)} />
          {/* Inline booking CTA near the end */}
          <aside className="my-4 flex flex-col gap-3 rounded-[24px] bg-tint p-6">
            <p className="font-display text-xl font-semibold">درباره‌ی {pillar.name} سؤالی دارید؟</p>
            <p className="text-[15px] text-muted-2">در یک جلسه‌ی معاینه و مشاوره، گزینه‌های مناسب شما را با هم مرور می‌کنیم.</p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={bookingHref} size="md" data-umami-event="book_cta">
                {bookingLabel}
              </ButtonLink>
              <Link href={pillar.href} className="py-3 text-sm">
                درباره‌ی {pillar.name} بیشتر بخوانید ←
              </Link>
            </div>
          </aside>
          <Body blocks={a.body.slice(half)} />
        </div>
      </Container>
      <Container className="pt-16 pb-24">
        <h2 className="mb-8 font-display text-[24px] font-semibold lg:text-[30px]">مقالات مرتبط</h2>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/journal/${r.slug}`} className="flex flex-col gap-3 text-ink no-underline hover:text-primary">
                <Image src={r.image.card} alt={r.image.alt} width={r.image.cardW} height={r.image.cardH} sizes="(min-width: 768px) 50vw, 100vw" className="h-[220px] w-full rounded-[20px] bg-tint object-cover" />
                <span className="font-display text-xl leading-[1.6] font-semibold">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </article>
  );
}
