import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { reviews, reviewsCopy } from "@/content/reviews";
import type { Locale } from "@/lib/i18n";

/** Real patient comments (content/reviews.ts), shown as quotes. No review markup on purpose. */
export function Reviews({ lang }: { lang: Locale }) {
  const c = reviewsCopy[lang];
  return (
    <section aria-labelledby="reviews-title">
      <Container className="flex flex-col gap-10 pb-24 lg:pb-32">
        <div className="flex flex-col gap-3.5">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 id="reviews-title" className="font-display text-[26px] leading-normal font-semibold lg:text-[40px]">
            {c.title}
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i}>
              <figure className="flex h-full flex-col gap-4 rounded-[24px] border border-line bg-surface p-6">
                <span aria-hidden="true" className="font-display text-[40px] leading-none text-champagne">”</span>
                <blockquote className="grow text-[16px] leading-[2] text-ink">{r.text[lang]}</blockquote>
                <figcaption className="flex flex-wrap gap-x-2 text-[13px] text-muted">
                  <span>{c.patient}</span>
                  {r.treatment && <span>· {r.treatment[lang]}</span>}
                  {r.original !== lang && <span>· {c.translated}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
