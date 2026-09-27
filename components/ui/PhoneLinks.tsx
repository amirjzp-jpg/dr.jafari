import { site } from "@/lib/site";

/**
 * Both clinic phones as tap-to-call links, always on one line with a clear
 * divider. Each number is nowrap so it never breaks at its inner spaces.
 */
export function PhoneLinks({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 whitespace-nowrap ${className}`}>
      {site.phones.map((p, i) => (
        <span key={p.tel} className="inline-flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="h-4 w-px bg-champagne" />}
          <a
            href={`tel:${p.tel}`}
            data-umami-event="phone_click"
            className="ltr-nums whitespace-nowrap text-ink no-underline hover:text-primary"
          >
            {p.display}
          </a>
        </span>
      ))}
    </span>
  );
}
