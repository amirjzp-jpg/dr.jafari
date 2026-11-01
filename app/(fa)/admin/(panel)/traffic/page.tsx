import Link from "next/link";
import { notFound } from "next/navigation";
import { btnOutline, btnPrimary } from "@/components/admin/styles";
import { requireAdmin } from "@/lib/auth/session";
import { query } from "@/lib/db";
import type { AuditResult } from "@/lib/seo-audit";
import { trafficPhones } from "@/lib/traffic";
import { runSeoAudit } from "./actions";

export const metadata = { title: "ترافیک و سئو" };

const nf = new Intl.NumberFormat("fa-IR");
const n = (v: number | string) => nf.format(Number(v));
const TZ = "Asia/Tehran";
const day = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "short", timeZone: TZ });
const stamp = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ });

type Row = Record<string, string | number | null>;
const asDate = (v: unknown) => (v instanceof Date ? v : new Date(String(v)));
const q = async (sql: string, p: unknown[] = []) => (await query<Row>(sql, p)).rows;

const REF_LABEL: Record<string, string> = { direct: "مستقیم", search: "موتور جستجو", ai: "هوش مصنوعی", social: "شبکه‌ی اجتماعی", other: "سایر سایت‌ها" };
const BOT_LABEL: Record<string, string> = { ai: "خزنده‌ی هوش مصنوعی", search: "خزنده‌ی موتور جستجو" };
const DEVICE_LABEL: Record<string, string> = { mobile: "موبایل", desktop: "دسکتاپ", tablet: "تبلت" };
const LANG_LABEL: Record<string, string> = { fa: "فارسی", ar: "عربی", en: "انگلیسی" };

function Card({ title, hint, children, wide }: { title: string; hint?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 ${wide ? "md:col-span-2" : ""}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      {hint && <p className="mb-2 text-xs text-muted">{hint}</p>}
      <div className={hint ? "" : "mt-2"}>{children}</div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="font-display text-3xl font-semibold text-primary">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

/** Horizontal share bars: label, bar, count. */
function Bars({ rows, labels }: { rows: { k: string; v: number }[]; labels?: Record<string, string> }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  if (!rows.length) return <p className="text-sm text-muted">هنوز داده‌ای نیست.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <li key={r.k} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-2 text-sm">
          <span className="truncate" dir="auto">{labels?.[r.k] ?? r.k}</span>
          <span className="h-2.5 rounded-pill bg-tint">
            <span className="block h-full rounded-pill bg-primary" style={{ width: `${Math.max(3, (r.v / max) * 100)}%` }} />
          </span>
          <span className="text-end text-muted">{n(r.v)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Column chart in plain SVG. */
function Columns({ data }: { data: { label: string; a: number; b?: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.a));
  const w = 100 / Math.max(1, data.length);
  const bw = Math.min(w * 0.76, 6); // keep a lone day from becoming one huge block
  const bx = (i: number) => i * w + (w - bw) / 2;
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-40 w-full" role="img" aria-label="نمودار">
        {data.map((d, i) => (
          <g key={i}>
            <rect x={bx(i)} y={40 - (d.a / max) * 38} width={bw} height={(d.a / max) * 38} rx="0.6" fill="var(--color-tint-2)" />
            {d.b ? <rect x={bx(i)} y={40 - (d.b / max) * 38} width={bw} height={(d.b / max) * 38} rx="0.6" fill="var(--color-primary)" /> : null}
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const phone = await requireAdmin();
  if (!trafficPhones().has(phone)) notFound();
  const sp = await searchParams;
  const d = [7, 30, 90].includes(Number(sp.d)) ? Number(sp.d) : 30;
  const since = `now() - make_interval(days => ${d})`;
  const V = `kind = 'view' AND at > ${since}`;

  const [tot, byDay, byHour, device, browser, os, pages, refKinds, refHosts, utm, langs, bots, botPages, recent, audit] = await Promise.all([
    q(`SELECT count(*) AS views, count(DISTINCT sid) AS visitors,
         count(*) FILTER (WHERE at > date_trunc('day', now() AT TIME ZONE '${TZ}') AT TIME ZONE '${TZ}') AS today,
         count(*) FILTER (WHERE at > now() - interval '30 minutes') AS live
       FROM analytics_hits WHERE ${V}`),
    q(`SELECT to_char((at AT TIME ZONE '${TZ}')::date, 'YYYY-MM-DD') AS d, count(*) AS v, count(DISTINCT sid) AS u FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 1`),
    q(`SELECT extract(hour FROM at AT TIME ZONE '${TZ}')::int AS h, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1`),
    q(`SELECT device AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC`),
    q(`SELECT browser AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC LIMIT 6`),
    q(`SELECT os AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC LIMIT 6`),
    q(`SELECT path AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC LIMIT 12`),
    q(`SELECT ref_kind AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC`),
    q(`SELECT ref_host AS k, count(*) AS v FROM analytics_hits WHERE ${V} AND ref_host IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 8`),
    q(`SELECT utm_source AS k, count(*) AS v FROM analytics_hits WHERE ${V} AND utm_source IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 6`),
    q(`SELECT lang AS k, count(*) AS v FROM analytics_hits WHERE ${V} GROUP BY 1 ORDER BY 2 DESC`),
    q(`SELECT bot_name AS k, bot_kind, count(*) AS v, max(at) AS last FROM analytics_hits WHERE kind = 'bot' AND at > ${since} GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 15`),
    q(`SELECT path AS k, count(*) AS v FROM analytics_hits WHERE kind = 'bot' AND bot_kind = 'ai' AND at > ${since} GROUP BY 1 ORDER BY 2 DESC LIMIT 6`),
    q(`SELECT at, kind, path, device, browser, os, ref_host, ref_kind, bot_name, bot_kind FROM analytics_hits ORDER BY at DESC LIMIT 60`),
    q(`SELECT at, results FROM analytics_audits ORDER BY at DESC LIMIT 1`),
  ]);

  const t = tot[0];
  const toChart = (rows: Row[], key: "v" | "u") => rows.map((r) => ({ label: day.format(new Date(String(r.d) + "T12:00:00Z")), a: Number(r.v), b: key === "u" ? Number(r.u) : 0 }));
  const hours = Array.from({ length: 24 }, (_, h) => ({ label: String(h), a: Number(byHour.find((r) => r.h === h)?.v ?? 0) }));
  const aiRef = Number(refKinds.find((r) => r.k === "ai")?.v ?? 0);
  const aiBots = bots.filter((b) => b.bot_kind === "ai").reduce((s, b) => s + Number(b.v), 0);
  const a = audit[0]?.results as unknown as AuditResult | undefined;
  const bad = a?.pages.filter((p) => p.issues.length) ?? [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">ترافیک و سئو</h1>
          <p className="text-sm text-muted">بازدیدها بدون کوکی و بدون ذخیره‌ی IP ثبت می‌شوند. زمان‌ها به وقت تهران است.</p>
        </div>
        <nav className="flex gap-1.5" aria-label="بازه">
          {[7, 30, 90].map((x) => (
            <Link key={x} href={`/admin/traffic?d=${x}`} className={`${x === d ? btnPrimary.replace("h-11", "h-9") : btnOutline.replace("h-10", "h-9")} flex items-center no-underline`}>
              {n(x)} روز
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="بازدید صفحه" value={n(t.views ?? 0)} sub={`${n(d)} روز گذشته`} />
        <Stat label="بازدیدکننده‌ی یکتا (جمع روزانه)" value={n(t.visitors ?? 0)} sub="هر روز یک‌بار شمرده می‌شود" />
        <Stat label="امروز" value={n(t.today ?? 0)} sub="بازدید از ساعت ۰۰:۰۰" />
        <Stat label="۳۰ دقیقه‌ی اخیر" value={n(t.live ?? 0)} sub="بازدید زنده" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="بازدید در هر روز" hint="ستون روشن: بازدید صفحه، ستون پررنگ: بازدیدکننده" wide>
          {byDay.length ? <Columns data={toChart(byDay, "u")} /> : <p className="text-sm text-muted">هنوز داده‌ای نیست. بعد از اولین بازدید اینجا پر می‌شود.</p>}
        </Card>
        <Card title="چه ساعتی؟" hint="ساعت شبانه‌روز (وقت تهران)"><Columns data={hours} /></Card>
        <Card title="چه دستگاهی؟"><Bars rows={device.map((r) => ({ k: String(r.k), v: Number(r.v) }))} labels={DEVICE_LABEL} /></Card>
        <Card title="مرورگر"><Bars rows={browser.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></Card>
        <Card title="سیستم‌عامل"><Bars rows={os.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></Card>
        <Card title="از کجا آمدند؟" hint="منبع ورود بازدیدکننده">
          <Bars rows={refKinds.map((r) => ({ k: String(r.k), v: Number(r.v) }))} labels={REF_LABEL} />
          {refHosts.length > 0 && <div className="mt-3 border-t border-line pt-3"><Bars rows={refHosts.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></div>}
          {utm.length > 0 && <div className="mt-3 border-t border-line pt-3"><p className="mb-1 text-xs text-muted">utm_source</p><Bars rows={utm.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></div>}
        </Card>
        <Card title="پربازدیدترین صفحه‌ها"><Bars rows={pages.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></Card>
      </div>

      <h2 className="mt-2 font-display text-xl font-semibold">GEO و AEO (دیده‌شدن در هوش مصنوعی)</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="ورود از چت‌بات‌ها" value={n(aiRef)} sub="ChatGPT، Perplexity، Gemini و …" />
        <Stat label="مراجعه‌ی خزنده‌های هوش مصنوعی" value={n(aiBots)} sub="GPTBot، ClaudeBot و …" />
        <Stat label="llms.txt" value={a ? (a.llmsTxt ? "دارد" : "ندارد") : "—"} sub="نتیجه‌ی آخرین بررسی" />
        <Stat label="مسدودسازی خزنده‌ها" value={a ? (a.aiBlocked.length ? n(a.aiBlocked.length) : "هیچ") : "—"} sub={a?.aiBlocked.join("، ") || "robots.txt"} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="زبان بازدیدکننده‌ها" hint="زبان صفحه‌ای که دیده‌اند. کشور بازدیدکننده بدون پایگاه GeoIP قابل تشخیص نیست."><Bars rows={langs.map((r) => ({ k: String(r.k), v: Number(r.v) }))} labels={LANG_LABEL} /></Card>
        <Card title="صفحه‌هایی که خزنده‌های هوش مصنوعی دیده‌اند"><Bars rows={botPages.map((r) => ({ k: String(r.k), v: Number(r.v) }))} /></Card>
        <Card title="خزنده‌ها (گوگل، بینگ، هوش مصنوعی)" hint="مراجعه‌ی ربات‌ها در بازه‌ی انتخابی" wide>
          {bots.length === 0 ? <p className="text-sm text-muted">هنوز خزنده‌ای ثبت نشده است. بعد از ایندکس شدن این‌جا پر می‌شود.</p> : (
            <table className="w-full text-sm">
              <tbody>
                {bots.map((b) => (
                  <tr key={`${b.k}`} className="border-t border-line first:border-0">
                    <td className="py-1.5" dir="ltr">{b.k}</td>
                    <td className="text-muted">{BOT_LABEL[String(b.bot_kind)] ?? b.bot_kind}</td>
                    <td className="text-end">{n(b.v ?? 0)}</td>
                    <td className="text-end text-xs text-muted">{stamp.format(asDate(b.last))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <h2 className="mt-2 font-display text-xl font-semibold">گزارش سئو</h2>
      <Card title="بررسی فنی همه‌ی صفحه‌ها" hint={a ? `آخرین اجرا: ${stamp.format(asDate(audit[0].at))} · ${n(a.pages.length)} صفحه · ${n(bad.length)} صفحه با نکته` : "هنوز اجرا نشده است. دکمه را بزنید (حدود ۱۰ ثانیه)."} wide>
        <form action={runSeoAudit} className="mb-3"><button type="submit" className={btnPrimary}>اجرای بررسی</button></form>
        {a && (
          <>
            <p className="mb-2 text-sm text-muted">sitemap: {n(a.sitemapUrls)} آدرس · robots.txt: {a.robotsOk ? "سالم" : "مشکل"} · لینک sitemap در robots: {a.sitemapRef ? "دارد" : "ندارد"}</p>
            {bad.length === 0 ? <p className="text-sm text-[#2E6B3B]">همه‌ی صفحه‌ها بدون نکته‌ی فنی‌اند.</p> : (
              <ul className="divide-y divide-line text-sm">
                {bad.slice(0, 40).map((p) => (
                  <li key={p.path} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                    <span dir="ltr" className="font-medium">{p.path}</span>
                    <span className="text-xs text-muted">{p.issues.join(" · ")}</span>
                  </li>
                ))}
              </ul>
            )}
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-primary">جدول کامل صفحه‌ها</summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[640px] text-xs" dir="ltr">
                  <thead className="text-muted"><tr><th className="text-start">path</th><th>status</th><th>ms</th><th>title</th><th>desc</th><th>h1</th><th>hreflang</th><th>schema</th></tr></thead>
                  <tbody>
                    {a.pages.map((p) => (
                      <tr key={p.path} className="border-t border-line">
                        <td className="py-1">{p.path}</td><td className="text-center">{p.status}</td><td className="text-center">{p.ms}</td>
                        <td className="text-center">{p.titleLen}</td><td className="text-center">{p.descLen}</td><td className="text-center">{p.h1}</td>
                        <td className="text-center">{p.hreflang}{p.xdefault ? "+x" : ""}</td><td>{[...new Set(p.ld)].join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </Card>

      <h2 className="mt-2 font-display text-xl font-semibold">گزارش لحظه‌ای (۶۰ رویداد آخر)</h2>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
        {recent.length === 0 && <li className="p-4 text-muted">هنوز رویدادی ثبت نشده است.</li>}
        {recent.map((r, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 p-2.5">
            <span className="text-xs text-muted">{stamp.format(asDate(r.at))}</span>
            <span className={`rounded-pill px-2 py-0.5 text-xs ${r.kind === "bot" ? "bg-[#F1E8D4] text-[#6B4E12]" : "bg-tint text-primary"}`}>{r.kind === "bot" ? String(r.bot_name) : DEVICE_LABEL[String(r.device)] ?? "—"}</span>
            <span dir="ltr" className="font-medium">{r.path}</span>
            <span dir="ltr" className="ms-auto text-xs text-muted">{r.kind === "bot" ? BOT_LABEL[String(r.bot_kind)] : [r.browser, r.os, r.ref_host && `← ${r.ref_host}`].filter(Boolean).join(" · ")}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
