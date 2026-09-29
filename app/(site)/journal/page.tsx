import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { Container } from "@/components/layout/Container";
import { latestArticles, articles } from "@/content/journal";
import { toFaDigits } from "@/lib/digits";

export const metadata: Metadata = buildMetadata({
  title: "مجله",
  description: "مقاله‌هایی درباره‌ی کامپوزیت، لمینت سرامیکی و مراقبت از لبخند، پیش از تصمیم برای درمان.",
  path: "/journal",
});

export default function JournalIndex() {
  return (
    <>
      <PageHeader title="پیش از تصمیم، بیشتر بدانید" lead="مقاله‌هایی درباره‌ی کامپوزیت، لمینت و مراقبت از لبخند." crumbs={[{ name: "مجله", path: "/journal" }]} />
      <Container className="pb-24">
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {latestArticles(articles.length).map((a, i) => (
            <li key={a.slug}>
              <Link href={`/journal/${a.slug}`} className="flex flex-col gap-4 text-ink no-underline hover:text-ink">
                <Image
                  src={a.image.card}
                  alt={a.image.alt}
                  width={a.image.cardW}
                  height={a.image.cardH}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  className="h-[250px] w-full rounded-[20px] bg-tint object-cover"
                />
                <span className="self-start rounded-pill bg-tint px-3.5 py-[5px] text-xs text-primary">{a.category}</span>
                <h2 className="font-display text-[22px] leading-[1.6] font-semibold">{a.title}</h2>
                <span className="text-[15px] leading-[1.9] text-muted">{a.excerpt}</span>
                <span className="text-[13px] text-muted">{toFaDigits(a.readMinutes)} دقیقه مطالعه</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
