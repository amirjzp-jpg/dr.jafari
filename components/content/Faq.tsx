import type { Faq as FaqItem } from "@/content/services";

/** Accordion built on <details>, so it works without JavaScript and with the keyboard. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col border-t border-line">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="text-xl text-primary transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-5 text-base leading-[2] text-muted-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
