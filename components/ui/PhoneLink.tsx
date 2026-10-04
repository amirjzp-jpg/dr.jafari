import { facts } from "@/content/i18n/ui";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * The clinic phone as a tap-to-call link. Semibold so it reads as the
 * clinic's contact point, and nowrap so it never breaks at its inner spaces.
 */
export function PhoneLink({ className = "", lang = "fa" }: { className?: string; lang?: Locale }) {
  return (
    <a
      href={`tel:${site.phone.tel}`}
      data-umami-event="phone_click"
      dir={lang === "fa" ? undefined : "ltr"}
      className={`ltr-nums -my-2.5 inline-block whitespace-nowrap py-2.5 font-semibold text-ink no-underline hover:text-primary ${className}`}
    >
      {facts[lang].phoneDisplay}
    </a>
  );
}
