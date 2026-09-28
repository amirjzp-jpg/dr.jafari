"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronIcon } from "@/components/icons/ui";
import { toFaDigits } from "@/lib/digits";

// A fan of photo cards animated with GSAP (adapted from the 21st.dev "card fan
// carousel"). Changes for this site:
// - RTL: the fan is mirrored, so the first card sits on the right and "next"
//   moves toward the left; ArrowLeft / a rightward swipe go to the next card.
// - Cards are buttons that open the photo (onOpen); hidden cards leave the tab order.
// - Site tokens instead of black/white glass; next/image for sized, lazy images.
// - prefers-reduced-motion: cards move without the elastic bounce.
// Sizes live in globals.css (.fan-layout / .fan-card).

export type FanCard = {
  id: string;
  src: string;
  alt: string;
  /** Small chip on the card, e.g. the treatment. */
  tag?: string;
  /** Marks before/after pairs. */
  pair?: boolean;
};

const MAX_VISIBLE = 7;
const HALF = 3;
/** -1 mirrors the fan for right-to-left reading. */
const DIR = -1;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function widthMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/** Scales vertical offsets down when the viewport is too short for the ideal layout height. */
function heightMultiplier(width: number) {
  const rem = 16;
  const ideal = width < 480 ? 22 * rem : width < 640 ? 26 * rem : width < 768 ? 28 * rem : width < 1024 ? 34 * rem : 38 * rem;
  const available = window.innerHeight * 0.7;
  return available >= ideal ? 1 : available / ideal;
}

function slotConfig(total: number, slot: number) {
  const base =
    total >= MAX_VISIBLE
      ? FAN_POSITIONS[slot]
      : (() => {
          const center = total >> 1;
          const d = total > 1 ? (slot - center) / center : 0;
          const a = Math.abs(d);
          return { rot: d * 21, scale: 1.0 - 0.2244 * a * a, x: d * 30, y: a * a * 7.3, zIndex: 10 - Math.abs(slot - center) };
        })();
  return { ...base, x: base.x * DIR, rot: base.rot * DIR };
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function CardFanCarousel({
  cards,
  onOpen,
  label,
}: {
  cards: FanCard[];
  onOpen?: (index: number) => void;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"next" | "prev" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);

  const total = cards.length;
  const paginated = total > MAX_VISIBLE;
  const [center, setCenter] = useState(paginated ? HALF : total >> 1);

  const visibleMap = useCallback(
    (c: number) => {
      const map = new Map<number, number>();
      if (!paginated) {
        for (let i = 0; i < total; i++) map.set(i, i);
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) map.set(mod(c + slot - HALF, total), slot);
      return map;
    },
    [total, paginated],
  );

  const go = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating.current || !paginated) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenter((c) => mod(c + (direction === "next" ? 1 : -1), total));
    },
    [total, paginated],
  );

  const jump = (i: number) => {
    if (isAnimating.current || !paginated || i === center) return;
    const forward = mod(i - center, total);
    isAnimating.current = true;
    directionRef.current = forward <= total / 2 ? "next" : "prev";
    setCenter(i);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !total) return;
    const els = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (s: number) => (reduce ? 0 : s);
    const map = visibleMap(center);
    const before = prevVisible.current;
    const direction = directionRef.current;
    const first = !hasEntered.current;
    const wm = widthMultiplier(window.innerWidth);
    const hm = heightMultiplier(window.innerWidth);
    const slots = paginated ? MAX_VISIBLE : total;
    const config = (slot: number) => slotConfig(slots, slot);

    if (first) isAnimating.current = true;
    let done = 0;
    const finish = () => {
      if (++done >= map.size) {
        isAnimating.current = false;
        hasEntered.current = true;
      }
    };
    const enterSide = direction === "next" ? 40 * DIR : -40 * DIR;

    els.forEach((card, i) => {
      const slot = map.get(i);
      const wasVisible = before.has(i);
      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = { x: `${x * wm}rem`, y: `${y * hm}rem`, rotation: rot, scale, opacity: 1, zIndex };
        if (first) {
          gsap.set(card, { x: 0, y: `${12 * hm}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, {
            ...target,
            duration: t(1.2),
            ease: reduce ? "none" : "elastic.out(1.05,.78)",
            delay: t(0.2 + slot * 0.06),
            onComplete: finish,
          });
        } else if (!wasVisible) {
          gsap.set(card, { x: `${enterSide}rem`, y: `${y * hm}rem`, rotation: direction === "next" ? 30 * DIR : -30 * DIR, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: t(0.6), ease: "power2.out", onComplete: finish });
        } else {
          gsap.to(card, { ...target, duration: t(0.5), ease: "power2.out", onComplete: finish });
        }
      } else if (wasVisible) {
        gsap.to(card, {
          x: `${-enterSide}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "next" ? -30 * DIR : 30 * DIR,
          duration: t(0.4),
          ease: "power2.in",
          zIndex: 0,
        });
      } else if (first) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });
    prevVisible.current = new Set(map.keys());

    // Hover: the pointed card lifts and its neighbours make room (mouse only).
    const entries = els.flatMap((el, i) => (map.has(i) ? [{ el, slot: map.get(i)! }] : [])).sort((a, b) => a.slot - b.slot);
    const centerSlot = entries.length >> 1;
    let active: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;

    const layout = (hovered: number | null) => {
      const m = widthMultiplier(window.innerWidth);
      const h = heightMultiplier(window.innerWidth);
      entries.forEach(({ el, slot }) => {
        const base = config(slot);
        let x = base.x * m;
        let y = base.y * h;
        let rot = base.rot;
        let scale = base.scale;
        let delay = Math.abs(slot - (hovered ?? centerSlot)) * 0.02;
        if (hovered !== null) {
          const distance = Math.abs(slot - hovered);
          if (slot === hovered) {
            y -= 2.5 * h;
            scale *= 1.08;
          } else {
            const n = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const push = 8 * (1 - Math.abs(n)) * (1 + 0.2 * Math.max(0, 3 - distance));
            const side = slot < hovered ? -1 : 1;
            x += side * push * m * DIR;
            rot += (side * 3 * DIR) / (distance + 1);
            if (slot === entries.length - 1 && hovered < centerSlot) y -= 1 * h;
            if (slot === 0 && hovered > centerSlot) y -= 1 * h;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }
        gsap.to(el, {
          x: `${x}rem`,
          y: `${y}rem`,
          rotation: rot,
          scale,
          duration: t(0.5),
          delay: t(delay),
          ease: reduce ? "none" : "elastic.out(1,.75)",
          overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enter = entries.map(({ el, slot }) => {
      const handler = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || isAnimating.current) return;
        if (leaveTimer) clearTimeout(leaveTimer);
        leaveTimer = null;
        if (active !== slot) {
          active = slot;
          layout(slot);
        }
      };
      el.addEventListener("pointerenter", handler);
      return { el, handler };
    });
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        active = null;
        layout(null);
      }, 50);
    };
    container.addEventListener("pointerleave", onLeave);
    const onResize = () => {
      if (!isAnimating.current) layout(active);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enter.forEach(({ el, handler }) => el.removeEventListener("pointerenter", handler));
      container.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [center, total, visibleMap, paginated]);

  if (!total) return null;
  const visible = visibleMap(center);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative flex w-full flex-col items-center"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(DIR < 0 ? "next" : "prev");
        else if (e.key === "ArrowRight") go(DIR < 0 ? "prev" : "next");
        else return;
        e.preventDefault();
      }}
    >
      <div
        ref={containerRef}
        className="fan-layout relative w-full max-w-[80rem]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, moved: false };
        }}
        onPointerMove={(e) => {
          if (swipe.current && Math.abs(e.clientX - swipe.current.x) > 10) swipe.current.moved = true;
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          if (!s) return;
          const dx = e.clientX - s.x;
          // RTL: dragging the fan to the right brings the next card in from the left.
          if (Math.abs(dx) > 40) go(dx * DIR < 0 ? "next" : "prev");
        }}
      >
        {cards.map((card, i) => {
          const slot = visible.get(i);
          const shown = slot !== undefined;
          return (
            <button
              key={card.id}
              type="button"
              tabIndex={shown ? 0 : -1}
              aria-hidden={shown ? undefined : true}
              aria-label={`${card.alt}${card.pair ? " (قبل و بعد)" : ""}، بزرگ‌نمایی`}
              onClick={() => {
                if (swipe.current?.moved) return;
                onOpen?.(i);
              }}
              onFocus={() => {
                // Keyboard users: bring a focused side card to the middle.
                if (paginated && slot !== undefined && slot !== HALF) jump(i);
              }}
              className="fan-card group"
            >
              <Image
                src={card.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 220px, 150px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                draggable={false}
              />
              {(card.tag || card.pair) && (
                <span className="absolute inset-x-2.5 bottom-2.5 hidden flex-wrap justify-between gap-1.5 sm:flex lg:inset-x-3.5 lg:bottom-3.5">
                  {card.tag && (
                    <span className="rounded-pill bg-ivory/95 px-2.5 py-0.5 text-xs leading-5 text-ink lg:px-3 lg:leading-6">
                      {card.tag}
                    </span>
                  )}
                  {card.pair && (
                    <span className="rounded-pill bg-primary px-2.5 py-0.5 text-xs leading-5 text-white lg:px-3 lg:leading-6">
                      قبل و بعد
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {paginated && (
        <div className="relative z-30 mt-6 flex items-center justify-center gap-3 lg:mt-8">
          <button type="button" onClick={() => go("prev")} aria-label="تصویر قبلی" className="fan-arrow">
            <ChevronIcon flip size={20} />
          </button>
          <span aria-live="polite" className="min-w-16 text-center text-sm text-muted-2 sm:hidden">
            {toFaDigits(center + 1)} از {toFaDigits(total)}
          </span>
          <div className="hidden items-center sm:flex">
            {cards.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => jump(i)}
                aria-label={`نمونه‌ی ${toFaDigits(i + 1)}`}
                aria-current={i === center ? "true" : undefined}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={`block size-2 rounded-full transition-all duration-300 ${
                    i === center ? "scale-125 bg-primary" : "bg-[#8A96A2]"
                  }`}
                />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go("next")} aria-label="تصویر بعدی" className="fan-arrow">
            <ChevronIcon size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
