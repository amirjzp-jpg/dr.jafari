import { WhatsAppIcon } from "@/components/icons/ui";
import { facts, ui } from "@/content/i18n/ui";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * The clinic phone as a tap-to-call link. Semibold so it reads as the
 * clinic's contact point, and nowrap so it never breaks at its inner spaces.
 * In Arabic and English a WhatsApp mark sits beside it and opens a chat, since
 * visitors from abroad use WhatsApp rather than a call.
 */
export function PhoneLink({ className = "", lang = "fa" }: { className?: string; lang?: Locale }) {
  const phone = (
    <a
      href={`tel:${site.phone.tel}`}
      data-umami-event="phone_click"
      dir={lang === "fa" ? undefined : "ltr"}
      className={`ltr-nums -my-2.5 inline-block whitespace-nowrap py-2.5 font-semibold text-ink no-underline hover:text-primary ${className}`}
    >
      {facts[lang].phoneDisplay}
    </a>
  );
  if (lang === "fa") return phone;
  return (
    <span className="inline-flex items-center gap-3">
      {phone}
      <a
        href={site.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ui[lang].whatsapp}
        title={ui[lang].whatsapp}
        data-umami-event="whatsapp_click"
        className="-mx-1 -my-3 inline-flex size-11 items-center justify-center text-[#1f8f5f] hover:text-[#176f49]"
      >
        <WhatsAppIcon size={22} />
      </a>
    </span>
  );
}
