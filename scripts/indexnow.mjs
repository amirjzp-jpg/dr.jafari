// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver) that the site's pages
// changed, so they recrawl right away instead of waiting. Google does not use IndexNow.
// Run after a deploy on the real domain: `npm run indexnow`. It reads the live sitemap,
// so it always submits exactly the URLs the site lists.
//
// The key is public by design: search engines verify it at /<key>.txt (public/).
// Never fails the deploy: any error is printed and the script exits 0.

const KEY = "4ba3ae2f06139493b65e815135ee927b";

async function main() {
  if (process.env.SITE_INDEXABLE !== "true") {
    console.log("indexnow: skipped (SITE_INDEXABLE is not true, so this is not the real domain)");
    return;
  }
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (!site.startsWith("https://")) {
    console.log("indexnow: skipped (NEXT_PUBLIC_SITE_URL is not an https URL)");
    return;
  }
  const host = new URL(site).host;

  const res = await fetch(`${site}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`sitemap answered ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => new URL(u).host === host);
  if (urls.length === 0) throw new Error("no URLs found in the sitemap");

  const submit = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
    signal: AbortSignal.timeout(20_000),
  });
  // 200 = accepted, 202 = accepted and the key is still being checked.
  console.log(`indexnow: submitted ${urls.length} URLs, answer ${submit.status}`);
}

main().catch((err) => console.log(`indexnow: not submitted (${err.message})`));
