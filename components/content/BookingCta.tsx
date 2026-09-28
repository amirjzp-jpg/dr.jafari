import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { bookingHref, bookingLabel } from "@/lib/site";

export function BookingCta({ title = "از یک جلسه‌ی مشاوره شروع کنید" }: { title?: string }) {
  return (
    <section aria-label="رزرو نوبت" className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start gap-5 rounded-[32px] bg-linear-160 from-tint to-[#EDF1F3] px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-14">
          <div className="flex flex-col gap-3">
            <Eyebrow>رزرو نوبت</Eyebrow>
            <h2 className="font-display text-[24px] leading-normal font-semibold lg:text-[34px]">{title}</h2>
            <p className="text-[15px] text-muted-2">
              یا تماس بگیرید: <PhoneLink />
            </p>
          </div>
          <ButtonLink href={bookingHref} data-umami-event="book_cta">
            {bookingLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
