import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { bookingHref, bookingLabel } from "@/lib/site";

export const metadata = { title: "صفحه پیدا نشد" };

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-tint to-ivory" />
      <Header />
      <main className="grow">
        <Container className="flex flex-col items-center gap-5 py-24 text-center lg:py-36">
          <span className="font-display text-6xl text-blue-mid" aria-hidden="true">
            ۴۰۴
          </span>
          <h1 className="font-display text-[30px] font-semibold lg:text-[44px]">این صفحه پیدا نشد</h1>
          <p className="text-base text-muted">ممکن است نشانی اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" variant="outline" size="md">
              صفحه‌ی اصلی
            </ButtonLink>
            <ButtonLink href={bookingHref} size="md">
              {bookingLabel}
            </ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
