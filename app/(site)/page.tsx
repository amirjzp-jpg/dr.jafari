import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { bookingHref, bookingLabel, site } from "@/lib/site";

// Step 1 placeholder: shows the base layout, tokens and fonts. The real homepage is step 2.
export default function HomePage() {
  return (
    <>
      {/* The hero gradient runs behind the header, as in design/Main.dc.html. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-linear-to-b from-tint via-[#E8EFF3] via-58% to-ivory"
      />
      <Container className="flex flex-col gap-3 py-16 lg:py-28">
        <span className="flex items-center gap-3 text-sm text-muted">
          <span aria-hidden="true" className="h-px w-7 bg-champagne" />
          کلینیک دندانپزشکی زیبایی
        </span>
        <h1 className="font-display text-[34px] leading-normal font-semibold lg:text-[68px] lg:leading-[1.45]">
          {site.tagline}
        </h1>
        <p className="text-[19px] text-primary lg:text-[26px]">کامپوزیت · لمینت سرامیکی</p>
        <p className="max-w-[440px] text-base leading-[2] text-muted-2 lg:text-[17px]">
          کلینیکی مجهز به تجهیزات و فناوری‌های روز دندانپزشکی، برای لبخندی طبیعی و ماندگار.
        </p>
        <div className="mt-4">
          <ButtonLink href={bookingHref}>{bookingLabel}</ButtonLink>
        </div>
      </Container>
    </>
  );
}
