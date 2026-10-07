"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { Case } from "@/content/cases";
import type { Locale } from "@/lib/i18n";

const words = {
  fa: { before: "قبل", after: "بعد", imgBefore: "تصویر قبل", imgAfter: "تصویر بعد", afterAlt: "بعد از درمان", beforeAlt: "قبل از درمان", compare: "مقایسه‌ی قبل و بعد", pct: (n: number) => `${n}٪ قبل` },
  ar: { before: "قبل", after: "بعد", imgBefore: "صورة قبل العلاج", imgAfter: "صورة بعد العلاج", afterAlt: "بعد العلاج", beforeAlt: "قبل العلاج", compare: "مقارنة قبل وبعد", pct: (n: number) => `${n}% قبل` },
  en: { before: "Before", after: "After", imgBefore: "Before image", imgAfter: "After image", afterAlt: "After treatment", beforeAlt: "Before treatment", compare: "Before and after comparison", pct: (n: number) => `${n}% before` },
} as const;

// BUILD-SPEC.md section 8. "Before" is clipped by width and anchored to the
// right (read first in RTL); "after" fills the frame. A real range input sits
// on top, so mouse, touch and arrow keys all work, and `touch-action: pan-y`
// keeps vertical page scrolling on phones.
//
// Placeholders use the 378×440 arch. Real photos are close-ups of teeth, which
// the arch would crop, so they use a 3:2 frame with 20px corners (BUILD-SPEC §8).

export function BeforeAfter({
  item,
  sizes = "(min-width: 1024px) 378px, 90vw",
  caption = true,
  lang = "fa",
}: {
  item: Case;
  /** next/image sizes; the gallery's full-screen view passes a larger one. */
  sizes?: string;
  caption?: boolean;
  lang?: Locale;
}) {
  const w = words[lang];
  // Persian and Arabic read right to left, so "before" is anchored to the right; English is the mirror image.
  const rtl = lang !== "en";
  const arch = !(item.before && item.after);
  const [pos, setPos] = useState(50);
  const tracked = useRef(false);

  const radius = arch ? "50% 50% 20px 20px / 42.95% 42.95% 20px 20px" : "20px";

  return (
    <figure className="flex flex-col gap-[18px]">
      <div
        className={`relative mx-auto w-full overflow-hidden bg-[#EEF3F8] select-none ${
          arch ? "aspect-[378/440] max-w-[378px]" : "aspect-[3/2]"
        }`}
        style={{ borderRadius: radius }}
      >
        {/* After: full frame */}
        <Layer src={item.after} sizes={sizes} label={`[${w.imgAfter} — ${item.label}]`} className="bg-[#EEF3F8] text-muted" alt={`${w.afterAlt} — ${item.title}`} />
        {/* Before: clipped from the left edge, so it stays anchored right */}
        <div className="absolute inset-0" style={{ clipPath: rtl ? `inset(0 0 0 ${100 - pos}%)` : `inset(0 ${100 - pos}% 0 0)` }}>
          <Layer src={item.before} sizes={sizes} label={`[${w.imgBefore} — ${item.label}]`} className="bg-[#E2DDD4] text-[#45494E]" alt={`${w.beforeAlt} — ${item.title}`} />
        </div>

        <span className="absolute start-[18px] bottom-[18px] rounded-pill bg-ivory/90 px-3.5 py-[5px] text-xs text-ink">{w.before}</span>
        <span className="absolute end-[18px] bottom-[18px] rounded-pill bg-ivory/90 px-3.5 py-[5px] text-xs text-ink">{w.after}</span>

        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-white" style={rtl ? { right: `${pos}%` } : { left: `${pos}%` }} />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory shadow-[0_1px_4px_rgba(28,39,51,0.15)] ${rtl ? "translate-x-1/2" : "-translate-x-1/2"}`}
          style={rtl ? { right: `${pos}%` } : { left: `${pos}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F4A6E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6" />
            <path d="M15 6l6 6-6 6" />
          </svg>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          dir={rtl ? "rtl" : "ltr"}
          aria-label={`${w.compare} — ${item.title}`}
          aria-valuetext={w.pct(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          onPointerUp={() => {
            if (!tracked.current) track("slider_use", { case: item.title });
            tracked.current = true;
          }}
          className="peer absolute inset-0 m-0 size-full cursor-ew-resize opacity-0"
          style={{ touchAction: "pan-y" }}
        />
        {/* Visible focus ring for keyboard users (the input itself is transparent). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden outline-2 -outline-offset-4 outline-primary peer-focus-visible:block"
          style={{ borderRadius: radius, outlineStyle: "solid" }}
        />
      </div>
      {caption && (
        <figcaption className="flex flex-col gap-1 text-center">
          <span className="font-display text-[21px] font-semibold">{item.title}</span>
          {(item.teeth || item.sessions) && (
            <span className="text-[13px] text-muted">{[item.teeth, item.sessions].filter(Boolean).join(" · ")}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function Layer({ src, sizes, label, className, alt }: { src?: string; sizes: string; label: string; className: string; alt: string }) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" draggable={false} />;
  }
  return <div className={`absolute inset-0 flex items-center justify-center text-sm ${className}`}>{label}</div>;
}
