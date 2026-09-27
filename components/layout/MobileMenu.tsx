"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons/ui";
import { bookingHref, bookingLabel, mainNav, site } from "@/lib/site";

// A native modal <dialog> gives us the focus trap, Escape to close and an inert page for free.
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const close = () => dialogRef.current?.close();

  // Close after navigation (including hash links on the same page).
  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label="منو"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="-me-2.5 flex size-11 items-center justify-center text-ink lg:hidden"
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="منوی اصلی"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-ink backdrop:bg-ink/30"
        onClick={(e) => {
          // A click on a link inside closes the menu; so does a click on the backdrop.
          if ((e.target as HTMLElement).closest("a") || e.target === e.currentTarget) close();
        }}
      >
        <div className="flex h-full flex-col px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="flex h-[68px] items-center justify-between">
            <span className="font-display text-[19px] leading-[1.4] font-semibold">{site.name}</span>
            <button
              type="button"
              aria-label="بستن منو"
              onClick={close}
              autoFocus
              className="-me-2.5 flex size-11 items-center justify-center text-ink"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="منوی اصلی" className="mt-4">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    className="flex min-h-14 items-center text-lg text-ink no-underline hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <p className="flex flex-wrap items-center gap-x-2 text-base">
              {site.phones.map((p, i) => (
                <span key={p.tel} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-muted">·</span>}
                  <a href={`tel:${p.tel}`} className="ltr-nums text-ink no-underline">
                    {p.display}
                  </a>
                </span>
              ))}
            </p>
            <Link
              href={bookingHref}
              className="flex h-[52px] items-center justify-center rounded-pill bg-primary text-base font-medium text-white no-underline hover:bg-primary-hover hover:text-white"
            >
              {bookingLabel}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
