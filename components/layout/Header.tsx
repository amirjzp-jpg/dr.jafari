import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { bookingHref, bookingLabel, mainNav, site } from "@/lib/site";

export function Header() {
  return (
    <header className="relative z-10">
      <Container className="flex h-[68px] items-center justify-between lg:h-24">
        <Link href="/" className="flex flex-col text-ink no-underline hover:text-ink">
          <span className="font-display text-[19px] leading-[1.4] font-semibold lg:text-2xl">
            {site.name}
          </span>
          <span className="text-xs leading-normal text-muted">{site.tagline}</span>
        </Link>

        <nav aria-label="منوی اصلی" className="hidden lg:block">
          <ul className="flex gap-10 text-[15px]">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink no-underline hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Below md the sticky bottom bar carries the booking CTA. */}
          <span className="hidden md:contents">
            <ButtonLink href={bookingHref} variant="outline" size="sm">
              {bookingLabel}
            </ButtonLink>
          </span>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
