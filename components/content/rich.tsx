import type { ReactNode } from "react";
import { PhoneLink } from "@/components/ui/PhoneLink";
import type { Locale } from "@/lib/i18n";

/** Plain translated text in which "{phone}" becomes the clinic's tap-to-call number. */
export function richText(text: string, lang: Locale): ReactNode {
  const [before, ...rest] = text.split("{phone}");
  if (rest.length === 0) return text;
  return (
    <>
      {before}
      <PhoneLink lang={lang} />
      {rest.join("{phone}")}
    </>
  );
}
