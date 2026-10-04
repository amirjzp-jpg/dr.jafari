import Link from "next/link";
import { InstagramIcon, PinIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { DirectionsLink } from "@/components/ui/DirectionsLink";
import { facts, ui } from "@/content/i18n/ui";
import { toFaDigits } from "@/lib/digits";
import { localeHref, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const link = "text-muted no-underline hover:text-primary";
const faYear = toFaDigits(new Date().getFullYear());

export function Footer({ lang = "fa" }: { lang?: Locale }) {
  const t = ui[lang];
  const f = facts[lang];
  const year = lang === "fa" ? faYear : new Date().getFullYear();
  const links = [
    { path: "/gallery", label: t.footer.gallery },
    { path: "/dentist-maaliabad-shiraz", label: t.footer.location },
    { path: "/privacy", label: t.footer.privacy },
    { path: "/booking-policy", label: t.footer.policy },
  ]
    .map((l) => ({ ...l, href: localeHref(lang, l.path) }))
    .filter((l): l is typeof l & { href: string } => l.href !== null);
  return (
    <footer className="text-[13px] text-muted">
      <Container className="flex flex-col gap-5 border-t border-line pt-10 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-ink">
            © {year} {f.name}
          </span>
          <span>
            {t.footer.council}: {f.council}
          </span>
          <address className="mt-2 flex max-w-[460px] gap-2 leading-[1.9] not-italic">
            <PinIcon size={16} className="mt-1 shrink-0 text-primary" />
            <span>
              {f.address}
              <DirectionsLink variant="inline" lang={lang} className="ms-3 whitespace-nowrap" />
            </span>
          </address>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {links.map((l) => (
              <li key={l.path}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
            {site.instagram && (
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.footer.instagramAria(site.instagramHandle)}
                  data-umami-event="instagram_click"
                  className={`${link} -my-2.5 inline-flex items-center gap-1.5 py-2.5`}
                >
                  <InstagramIcon size={16} />
                  {t.instagram}
                </a>
              </li>
            )}
          </ul>
          <nav aria-label={t.language}>
            <LanguageSwitcher />
          </nav>
        </div>
      </Container>
      <Container className="border-t border-line py-5 text-center">
        <span dir="ltr" lang="en" className="text-xs font-semibold tracking-wide text-ink">
          Designed by Razats Creative Studio
        </span>
      </Container>
    </footer>
  );
}
