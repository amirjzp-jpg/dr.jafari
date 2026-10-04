"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languageNames, locales, splitLocale, switchTarget, type Locale } from "@/lib/i18n";

/**
 * Links to the other languages. Goes to the same page when it has been translated,
 * otherwise to that language's home page. Each name is written in its own language
 * and script, so a visitor who cannot read the current one can still find theirs.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const current = splitLocale(pathname).lang;
  return (
    <ul className={`flex items-center gap-4 text-sm ${className}`}>
      {locales
        .filter((l) => l !== current)
        .map((l: Locale) => (
          <li key={l}>
            <Link
              href={switchTarget(pathname, l)}
              lang={l}
              hrefLang={l}
              data-umami-event={`lang_${l}`}
              className="-my-3 inline-block px-1.5 py-3 text-muted no-underline hover:text-primary md:px-0"
            >
              {languageNames[l]}
            </Link>
          </li>
        ))}
    </ul>
  );
}
