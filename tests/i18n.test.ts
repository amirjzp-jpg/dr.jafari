import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { bookingFor, facts, navFor, ui, waLink } from "@/content/i18n/ui";
import { homeCopy, serviceText } from "@/content/i18n/home";
import { services } from "@/content/services";
import { articleText, qaFromArticle } from "@/content/i18n/articles";
import { articles } from "@/content/journal";
import { serviceContent } from "@/content/i18n/services";
import { pagesCopy } from "@/content/i18n/pages";
import { dirOf, intlOnlyPaths, isIntl, isTranslated, localeHref, localePath, locales, splitLocale, switchTarget, translatedPaths } from "@/lib/i18n";
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
    expect(isTranslated("/journal")).toBe(true);
    expect(isTranslated("/some-new-page")).toBe(false); // a page added in Persian first
    expect(localeHref("ar", "/")).toBe("/ar");
    expect(localeHref("en", "/about")).toBe("/en/about");
    expect(localeHref("ar", "/some-new-page")).toBeNull();
    expect(localeHref("fa", "/some-new-page")).toBe("/some-new-page");
  });

  it("switches language to the same page, or to that language's home when it is not translated", () => {
    expect(switchTarget("/", "ar")).toBe("/ar");
    expect(switchTarget("/en", "fa")).toBe("/");
    expect(switchTarget("/ar", "en")).toBe("/en");
    expect(switchTarget("/about", "ar")).toBe("/ar/about");
    expect(switchTarget("/en/about", "fa")).toBe("/about");
    expect(switchTarget("/some-new-page", "ar")).toBe("/ar");
    expect(switchTarget("/journal/veneer-care", "en")).toBe("/en/journal/veneer-care");
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
    expect(navFor("en").map((n) => n.href)).toContain("/en/journal");
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
    const text = JSON.stringify([homeCopy, serviceText, ui.ar, ui.en, facts.ar, facts.en, articleText]);
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
      const file = p.startsWith("/services/")
        ? "app/[lang]/services/[slug]/page.tsx"
        : p.startsWith("/journal/")
          ? "app/[lang]/journal/[slug]/page.tsx"
          : `app/[lang]${p}/page.tsx`;
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
    const text = JSON.stringify([serviceContent, pagesCopy, articleText]);
    expect(text).not.toMatch(/instalment|installment|تقسيط|اقساط|قسط/i);
    expect(text).not.toMatch(/\b(USD|EUR|\$|€)\b|دولار|يورو/);
  });

  it("states that the clinic team speaks Persian, and nothing more about languages", () => {
    expect(pagesCopy.en.contact.teamNote).toMatch(/speaks Persian/);
    expect(pagesCopy.ar.contact.teamNote).toContain("الفارسية");
  });
});

describe("journal articles in Arabic and English", () => {
  it("translates every article, section by section", () => {
    for (const l of ["ar", "en"] as const) {
      for (const a of articles) {
        const t = articleText[l][a.slug];
        expect(t, `${l} ${a.slug}`).toBeTruthy();
        expect(t.body.length, `${l} ${a.slug} blocks`).toBe(a.body.length);
        // Same shape as the Persian article: headings, paragraphs and lists in the same places.
        a.body.forEach((b, i) => expect(Object.keys(t.body[i])[0], `${l} ${a.slug} block ${i}`).toBe(Object.keys(b)[0]));
        expect(t.metaDescription.length, `${l} ${a.slug} description`).toBeLessThan(200);
        expect(t.metaDescription, `${l} ${a.slug} description`).toMatch(l === "ar" ? /شيراز/ : /Shiraz/);
      }
    }
  });

  it("builds question-and-answer pairs from the article's own text", () => {
    const a = articleText.en["whitening-longevity"];
    const qa = qaFromArticle("en", a.title, a.body);
    expect(qa[0].q).toBe("How long does teeth whitening last?");
    expect(qa[0].a).toBe(a.body.find((b) => "p" in b && b.p)!["p" as keyof typeof a.body[0]]);
    expect(qa.map((x) => x.q)).toContain("Why do teeth darken again?");
    // Every answer comes from the article: nothing is invented.
    const all = JSON.stringify(a.body);
    for (const x of qa.slice(1)) expect(x.a.length).toBeGreaterThan(20);
    expect(all).toContain("Teeth are exposed to coloured foods");
  });

  it("makes the question-style titles produce a question-and-answer entry in both languages", () => {
    for (const l of ["ar", "en"] as const) {
      const a = articleText[l]["composite-vs-veneers"];
      expect(qaFromArticle(l, a.title, a.body)[0].q, l).toBe(a.title);
    }
  });

  it("names porcelain next to ceramic in the Arabic and English veneer articles (Gulf wording)", () => {
    expect(articleText.ar["veneer-care"].title).toContain("البورسلين");
    expect(articleText.en["veneer-care"].title).toContain("porcelain");
  });
});

describe("plan-your-visit page (patients abroad)", () => {
  it("exists only in Arabic and English and links just those two", () => {
    expect(intlOnlyPaths).toContain("/plan-your-visit");
    expect(isTranslated("/plan-your-visit")).toBe(false);
    expect(existsSync("app/[lang]/plan-your-visit/page.tsx")).toBe(true);
    expect(switchTarget("/ar/plan-your-visit", "en")).toBe("/en/plan-your-visit");
    expect(switchTarget("/en/plan-your-visit", "ar")).toBe("/ar/plan-your-visit");
    expect(switchTarget("/en/plan-your-visit", "fa")).toBe("/");
  });

  it("states only the clinic's own approximate figures", () => {
    for (const l of ["ar", "en"] as const) {
      const rows = pagesCopy[l].stay.rows;
      expect(rows.map((r) => r.slug ?? "quick")).toEqual(["quick", "composite", "veneers", "implant"]);
      const day = l === "ar" ? /يوم واحد/ : /1 day/;
      const month = l === "ar" ? /شهر واحد/ : /1 month/;
      expect(rows[0].time).toMatch(day);
      expect(rows[1].time).toMatch(day);
      expect(rows[2].time).toMatch(month);
      expect(rows[3].time).toMatch(month);
      // the implant figure is for installing, not for the whole treatment
      expect(rows[3].time).toMatch(l === "ar" ? /لتركيب الزرعة/ : /installing the implant/);
      // every figure is called approximate and set after the examination
      expect(pagesCopy[l].stay.lead).toMatch(l === "ar" ? /تقريبية.*بعد الفحص/ : /approximate.*after the examination/);
    }
  });
});
