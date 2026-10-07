import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import {
  bookingFor,
  externalProps,
  facts,
  navFor,
  ui,
} from "@/content/i18n/ui";
import { localePath, type Locale } from "@/lib/i18n";

export function Header({ lang = "fa" }: { lang?: Locale }) {
  const t = ui[lang];
  const f = facts[lang];
  const book = bookingFor(lang);
  // Latin and Arabic text is wider than Persian: keep each item on one line and let the gaps shrink
  // on narrower desktops so the brand, menu and language links never collide.
  const intl = lang !== "fa";
  return (
    <header className="relative z-10">
      <Container className="flex h-[68px] items-center justify-between lg:h-24">
        <Link
          href={localePath(lang, "/")}
          className={`flex flex-col text-ink no-underline hover:text-ink ${intl ? "shrink-0 whitespace-nowrap" : ""}`}
        >
          <span
            className={`font-display text-[19px] leading-[1.4] font-semibold ${intl ? "lg:text-[21px] xl:text-2xl" : "lg:text-2xl"}`}
          >
            {f.name}
          </span>
          <span className="text-xs leading-normal text-muted">{f.tagline}</span>
        </Link>

        <nav aria-label={t.mainMenu} className="hidden lg:block">
          <ul
            className={`flex ${intl ? "gap-4 text-sm whitespace-nowrap xl:gap-6 xl:text-[15px] min-[1360px]:gap-9" : "gap-10 text-[15px]"}`}
          >
            {navFor(lang).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink no-underline hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`flex items-center gap-3 ${intl ? "shrink-0 whitespace-nowrap" : ""}`}
        >
          {/* One tap on every screen size: the language links sit in the bar itself, not inside the menu. */}
          <nav aria-label={t.language}>
            <LanguageSwitcher className="gap-1 text-[13px] md:me-2 md:gap-4 md:text-sm" />
          </nav>
          {/* Below md the sticky bottom bar carries the booking CTA. */}
          <span className="hidden md:contents">
            <ButtonLink
              href={book.href}
              variant="outline"
              size="sm"
              {...(book.external ? externalProps : {})}
            >
              {book.label}
            </ButtonLink>
          </span>
          <MobileMenu lang={lang} />
        </div>
      </Container>
    </header>
  );
}
