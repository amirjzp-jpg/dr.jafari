import { site } from "@/lib/site";

/** Both clinic phones as tap-to-call links. */
export function PhoneLinks({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      {site.phones.map((p, i) => (
        <span key={p.tel}>
          {i > 0 && (
            <span aria-hidden="true" className="mx-1.5 text-champagne">
              ·
            </span>
          )}
          <a href={`tel:${p.tel}`} data-umami-event="phone_click" className="ltr-nums text-ink no-underline hover:text-primary">
            {p.display}
          </a>
        </span>
      ))}
    </span>
  );
}
