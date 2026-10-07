import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { bookingFor, externalProps } from "@/content/i18n/ui";
import { pagesCopy } from "@/content/i18n/pages";
import type { Locale } from "@/lib/i18n";

export function BookingCta({ title, lang = "fa" }: { title?: string; lang?: Locale }) {
  const c = lang === "fa" ? null : pagesCopy[lang].cta;
  const book = bookingFor(lang);
  return (
    <section aria-label={c ? c.aria : "رزرو نوبت"} className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start gap-5 rounded-[32px] bg-linear-160 from-tint to-[#EDF1F3] px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-14">
          <div className="flex flex-col gap-3">
            <Eyebrow>{c ? c.eyebrow : "رزرو نوبت"}</Eyebrow>
            <h2 className="font-display text-[24px] leading-normal font-semibold lg:text-[34px]">{title ?? (c ? c.title : "از یک جلسه‌ی مشاوره شروع کنید")}</h2>
            <p className="text-[15px] text-muted-2">
              {c ? c.orCall : "یا تماس بگیرید:"} <PhoneLink lang={lang} />
            </p>
          </div>
          <ButtonLink href={book.href} data-umami-event="book_cta" {...(book.external ? externalProps : {})}>
            {book.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
