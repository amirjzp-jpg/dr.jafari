import { site } from "@/lib/site";

/**
 * The clinic phone as a tap-to-call link. Semibold so it reads as the
 * clinic's contact point, and nowrap so it never breaks at its inner spaces.
 */
export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`tel:${site.phone.tel}`}
      data-umami-event="phone_click"
      className={`ltr-nums -my-2.5 inline-block whitespace-nowrap py-2.5 font-semibold text-ink no-underline hover:text-primary ${className}`}
    >
      {site.phone.display}
    </a>
  );
}
