import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { bookingFor, facts, navFor, ui, waLink } from "@/content/i18n/ui";
import { homeCopy, serviceText } from "@/content/i18n/home";
import { services } from "@/content/services";
import { serviceContent } from "@/content/i18n/services";
import { pagesCopy } from "@/content/i18n/pages";
import { dirOf, isIntl, isTranslated, localeHref, localePath, locales, splitLocale, switchTarget, translatedPaths } from "@/lib/i18n";
import { site } from "@/lib/site";

describe("language paths", () => {
  it("keeps Persian at the root and prefixes the others", () => {
    expect(localePath("fa", "/about")).toBe("/about");
    expect(localePath("fa", "/")).toBe("/");
    expect(localePath("ar", "/")).toBe("/ar");
    expect(localePath("en", "/about")).toBe("/en/about");
  });

  it("splits a pathname into language and Persian-style path", () => {
    expect(splitLocale("/")).toEqual({ lang: "fa", path: "/" });
    expect(splitLocale("/about")).toEqual({ lang: "fa", path: "/about" });
    expect(splitLocale("/ar")).toEqual({ lang: "ar", path: "/" });
    expect(splitLocale("/en/services/implant")).toEqual({ lang: "en", path: "/services/implant" });
    // Paths that merely start with "ar" or "en" are not language prefixes.
    expect(splitLocale("/arrival")).toEqual({ lang: "fa", path: "/arrival" });
    expect(splitLocale("/entrance")).toEqual({ lang: "fa", path: "/entrance" });
  });

  it("only offers links to pages that have a translation", () => {
    expect(isTranslated("/")).toBe(true);
    expect(isTranslated("/about")).toBe(true);
    expect(isTranslated("/journal")).toBe(false); // articles are not translated yet
    expect(localeHref("ar", "/")).toBe("/ar");
    expect(localeHref("en", "/about")).toBe("/en/about");
    expect(localeHref("ar", "/journal")).toBeNull();
    expect(localeHref("fa", "/journal")).toBe("/journal");
  });

  it("switches language to the same page, or to that language's home when it is not translated", () => {
    expect(switchTarget("/", "ar")).toBe("/ar");
    expect(switchTarget("/en", "fa")).toBe("/");
    expect(switchTarget("/ar", "en")).toBe("/en");
    expect(switchTarget("/about", "ar")).toBe("/ar/about");
    expect(switchTarget("/en/about", "fa")).toBe("/about");
    expect(switchTarget("/journal", "ar")).toBe("/ar");
    expect(switchTarget("/journal/veneer-care", "en")).toBe("/en");
    expect(switchTarget("/services/implant", "en")).toBe("/en/services/implant");
  });

  it("knows the text direction", () => {
    expect(dirOf("fa")).toBe("rtl");
    expect(dirOf("ar")).toBe("rtl");
    expect(dirOf("en")).toBe("ltr");
    expect(isIntl("ar")).toBe(true);
    expect(isIntl("fa")).toBe(false);
    expect(isIntl("fr")).toBe(false);
  });
});

describe("language content", () => {
  it("has every interface string and fact in every language", () => {
    for (const l of locales) {
      for (const [k, v] of Object.entries(ui[l])) expect(v, `ui.${l}.${k}`).toBeTruthy();
      for (const [k, v] of Object.entries(facts[l])) expect(v, `facts.${l}.${k}`).toBeTruthy();
    }
  });

  it("keeps the Persian interface identical to the strings the site always had", () => {
    expect(facts.fa.name).toBe(site.name);
    expect(facts.fa.address).toBe(site.address);
    expect(facts.fa.hours).toBe(site.hours);
    expect(navFor("fa").map((n) => n.href)).toEqual(["/composite", "/veneers", "/gallery", "/services", "/journal", "/#contact"]);
  });

  it("names and summarises every service in Arabic and English", () => {
    for (const l of ["ar", "en"] as const) {
      for (const s of services) {
        expect(serviceText[l][s.slug]?.name, `${l} ${s.slug}`).toBeTruthy();
        expect(serviceText[l][s.slug]?.short, `${l} ${s.slug}`).toBeTruthy();
      }
    }
  });

  it("never uses the banned superlatives in Arabic or English copy", () => {
    const text = JSON.stringify([homeCopy, serviceText, ui.ar, ui.en, facts.ar, facts.en]);
    expect(text).not.toMatch(/\bbest\b|\bspecialist\b|أفضل|أخصائي|اختصاصي|متخصص|بهترین|متخصص/i);
  });

  it("states the clinic hours and address the same way as the Persian facts", () => {
    expect(facts.ar.hours).toContain("10:00");
    expect(facts.ar.hours).toContain("19:00");
    expect(facts.en.hours).toContain("14:00–19:00");
    expect(facts.ar.addressFa).toBe(site.address);
  });
});

describe("booking route", () => {
  it("sends Persian to the SMS-code booking and the others to their contact page", () => {
    expect(bookingFor("fa")).toMatchObject({ href: "/booking", external: false });
    expect(bookingFor("ar")).toMatchObject({ href: "/ar/booking", external: false });
    expect(bookingFor("en")).toMatchObject({ href: "/en/booking", external: false });
  });

  it("opens WhatsApp on the clinic number with a ready first message", () => {
    for (const l of ["ar", "en"] as const) {
      const href = waLink(l);
      expect(href.startsWith("https://wa.me/989177203937?text=")).toBe(true);
      expect(decodeURIComponent(href.split("text=")[1]).length).toBeGreaterThan(20);
    }
  });
});

describe("translated pages", () => {
  it("lists every service page, and every listed page has a route", () => {
    for (const s of services) expect(isTranslated(s.href), s.href).toBe(true);
    for (const p of translatedPaths) {
      if (p === "/") continue;
      const file = p.startsWith("/services/") ? "app/[lang]/services/[slug]/page.tsx" : `app/[lang]${p}/page.tsx`;
      expect(existsSync(file), `${p} -> ${file}`).toBe(true);
    }
  });

  it("has complete service text: every list filled, every FAQ answered", () => {
    for (const l of ["ar", "en"] as const) {
      for (const s of services) {
        const t = serviceContent[l][s.slug];
        expect(t.intro.length, `${l} ${s.slug} intro`).toBeGreaterThan(0);
        const d = t.detail;
        if (s.detail) {
          expect(d, `${l} ${s.slug} detail`).toBeTruthy();
          expect(d!.process.length, `${l} ${s.slug} process`).toBe(s.detail.process.length);
          expect(d!.whoItSuits.length, `${l} ${s.slug} who`).toBe(s.detail.whoItSuits.length);
          expect(d!.benefits.length, `${l} ${s.slug} benefits`).toBe(s.detail.benefits.length);
          expect(d!.limitations.length, `${l} ${s.slug} limits`).toBe(s.detail.limitations.length);
          expect(d!.aftercare.length, `${l} ${s.slug} aftercare`).toBe(s.detail.aftercare.length);
          // One translated question per Persian one, except where a Persian question was dropped on purpose.
          expect(d!.faq.length, `${l} ${s.slug} faq`).toBe(s.detail.faq.length);
          for (const f of d!.faq) expect(f.q && f.a, `${l} ${s.slug} faq text`).toBeTruthy();
        }
      }
    }
  });

  it("never offers instalments or prices to patients abroad", () => {
    const text = JSON.stringify([serviceContent, pagesCopy]);
    expect(text).not.toMatch(/instalment|installment|تقسيط|اقساط|قسط/i);
    expect(text).not.toMatch(/\b(USD|EUR|\$|€)\b|دولار|يورو/);
  });

  it("states that the clinic team speaks Persian, and nothing more about languages", () => {
    expect(pagesCopy.en.contact.teamNote).toMatch(/speaks Persian/);
    expect(pagesCopy.ar.contact.teamNote).toContain("الفارسية");
  });
});
