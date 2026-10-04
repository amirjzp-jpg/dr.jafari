"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon } from "@/components/icons/ui";
import { bookingFor, externalProps, ui } from "@/content/i18n/ui";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Sticky bottom CTA on phones, on every public page except the booking flow. */
export function MobileBookingBar({ lang = "fa" }: { lang?: Locale }) {
  const pathname = usePathname();
  const book = bookingFor(lang);
  if (!book.external && pathname.startsWith(book.href)) return null;

  return (
    <>
      {/* Spacer so the fixed bar never covers the end of the page. */}
      <div aria-hidden="true" className="h-[calc(80px+env(safe-area-inset-bottom))] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-line bg-ivory px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
        <Link
          href={book.href}
          {...(book.external ? externalProps : {})}
          className="flex h-[52px] grow items-center justify-center rounded-pill bg-primary text-base font-medium text-white no-underline hover:bg-primary-hover hover:text-white"
        >
          {book.label}
        </Link>
        <a
          href={`tel:${site.phone.tel}`}
          aria-label={ui[lang].callClinic}
          className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-primary text-primary"
        >
          <PhoneIcon />
        </a>
      </div>
    </>
  );
}
