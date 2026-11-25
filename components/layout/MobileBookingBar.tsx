"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons/ui";
import { bookingFor, bookingWithReason, externalProps, ui, waLink } from "@/content/i18n/ui";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Sticky bottom CTA on phones, on every public page except the booking flow. */
export function MobileBookingBar({ lang = "fa" }: { lang?: Locale }) {
  const pathname = usePathname();
  const book = bookingFor(lang);
  // Hidden inside the booking flow only (not on /booking-policy, which shares the prefix).
  if (!book.external && (pathname === book.href || pathname.startsWith(`${book.href}/`))) return null;
  const href = lang === "fa" ? bookingWithReason(pathname) : book.href;

  return (
    <>
      {/* Spacer so the fixed bar never covers the end of the page. */}
      <div aria-hidden="true" className="h-[calc(80px+env(safe-area-inset-bottom))] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-line bg-ivory px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
        <Link
          href={href}
          data-umami-event="book_bar"
          {...(book.external ? externalProps : {})}
          className="flex h-[52px] grow items-center justify-center rounded-pill bg-primary text-base font-medium text-white no-underline hover:bg-primary-hover hover:text-white"
        >
          {book.label}
        </Link>
        {!book.external && (
          <a
            href={waLink(lang)}
            {...externalProps}
            aria-label={ui[lang].whatsapp}
            data-umami-event="whatsapp_click"
            className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-[#1f8f5f] text-[#1f8f5f]"
          >
            <WhatsAppIcon size={22} />
          </a>
        )}
        <a
          href={`tel:${site.phone.tel}`}
          data-umami-event="phone_click"
          aria-label={ui[lang].callClinic}
          className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-primary text-primary"
        >
          <PhoneIcon />
        </a>
      </div>
    </>
  );
}
