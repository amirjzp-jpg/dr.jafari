import { describe, expect, it } from "vitest";
import { bookingFor, facts, navFor, ui } from "@/content/i18n/ui";
import { homeCopy, serviceText } from "@/content/i18n/home";
import { services } from "@/content/services";
import { dirOf, isIntl, isTranslated, localeHref, localePath, locales, splitLocale, switchTarget } from "@/lib/i18n";
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
    expect(isTranslated("/about")).toBe(false);
    expect(localeHref("ar", "/")).toBe("/ar");
    expect(localeHref("ar", "/about")).toBeNull();
    expect(localeHref("fa", "/about")).toBe("/about");
  });

  it("switches language to the same page, or to that language's home when it is not translated", () => {
    expect(switchTarget("/", "ar")).toBe("/ar");
    expect(switchTarget("/en", "fa")).toBe("/");
    expect(switchTarget("/ar", "en")).toBe("/en");
    expect(switchTarget("/about", "ar")).toBe("/ar");
    expect(switchTarget("/en/about", "fa")).toBe("/about");
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
    expect(facts.ar.hours).toContain("10:00–13:00");
    expect(facts.en.hours).toContain("14:00–19:00");
    expect(facts.ar.addressFa).toBe(site.address);
  });
});

describe("booking route", () => {
  it("sends Persian to the SMS-code booking and the others to WhatsApp until their contact page exists", () => {
    expect(bookingFor("fa")).toMatchObject({ href: "/booking", external: false });
    for (const l of ["ar", "en"] as const) {
      const b = bookingFor(l);
      expect(b.external).toBe(true);
      expect(b.href.startsWith(site.whatsapp.url)).toBe(true);
      expect(decodeURIComponent(b.href.split("text=")[1]).length).toBeGreaterThan(20);
    }
  });
});
