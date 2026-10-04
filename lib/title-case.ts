import type { Locale } from "./i18n";

// English titles follow title case ("Cosmetic Dentistry in Shiraz, Iran"): every word
// capitalised except short articles, conjunctions and prepositions, which stay lower
// case unless they start the title, follow a colon or end it. Section headings inside
// a page stay in sentence case; only page titles (H1, search title) use this.

const small = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "up", "via", "vs"]);

const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1) : w);

export function titleCase(text: string): string {
  const words = text.split(" ");
  let startsPhrase = true;
  return words
    .map((word, i) => {
      const m = /^([("“]*)(.*?)([)”?!:;,.]*)$/.exec(word)!;
      const [, open, core, close] = m;
      const last = i === words.length - 1;
      let out = core;
      if (core && !/^[|–—-]+$/.test(core)) {
        // A word that already has a capital after its first letter ("Dr.", "WhatsApp") is kept as written.
        const keep = /[A-Z]/.test(core.slice(1));
        const isSmall = small.has(core.toLowerCase());
        if (keep) out = core;
        else if (isSmall && !startsPhrase && !last) out = core.toLowerCase();
        else out = core.split("-").map(cap).join("-");
      }
      startsPhrase = /[:|]$/.test(word) || word === "|" || word === "–" || word === "—";
      return open + out + close;
    })
    .join(" ");
}

/** The title as shown for a language: English gets title case, Persian and Arabic are unchanged. */
export const displayTitle = (lang: Locale, text: string) => (lang === "en" ? titleCase(text) : text);
