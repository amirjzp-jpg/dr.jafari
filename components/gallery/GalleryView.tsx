"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ChevronIcon, CloseIcon } from "@/components/icons/ui";
import CardFanCarousel from "@/components/ui/card-fan-carousel";
import { cover, treatmentLabel, treatments, type GalleryItem, type Treatment } from "@/content/gallery";
import { track } from "@/lib/analytics";
import { toFaDigits } from "@/lib/digits";

type Filter = Treatment | "all";

/** Filter chips, the card fan, a plain grid of every item, and a full-screen viewer. */
export function GalleryView({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(() => (filter === "all" ? items : items.filter((i) => i.treatment === filter)), [items, filter]);
  const chips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "همه", count: items.length },
    ...treatments
      .map((t) => ({ key: t.key as Filter, label: t.label, count: items.filter((i) => i.treatment === t.key).length }))
      .filter((c) => c.count > 0),
  ];

  const openAt = (i: number) => {
    setOpen(i);
    track("gallery_open", { id: shown[i].id });
  };

  return (
    <>
      <div role="group" aria-label="نمایش بر اساس درمان" className="flex flex-wrap justify-center gap-2.5">
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c.key)}
              className={`flex h-11 items-center gap-2 rounded-pill border px-5 text-sm transition-colors ${
                active ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink hover:border-primary"
              }`}
            >
              {c.label}
              <span className={`text-xs ${active ? "text-white" : "text-muted"}`}>{toFaDigits(c.count)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 lg:mt-10">
        <CardFanCarousel
          key={filter}
          label="نمونه‌کارها"
          onOpen={openAt}
          cards={shown.map((it) => ({
            id: it.id,
            src: cover(it),
            alt: it.alt,
            tag: treatmentLabel(it.treatment),
            pair: it.kind === "pair",
          }))}
        />
        <p className="mt-4 text-center text-sm text-muted">روی هر تصویر بزنید تا بزرگ‌تر ببینید.</p>
      </div>

      <section aria-labelledby="all-title" className="mt-20 lg:mt-28">
        <h2 id="all-title" className="font-display text-[24px] font-semibold lg:text-[34px]">
          همه‌ی نمونه‌ها
          {filter !== "all" && <span className="text-muted"> · {treatmentLabel(filter)}</span>}
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {shown.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => openAt(i)}
                aria-label={`${it.alt}${it.kind === "pair" ? " (قبل و بعد)" : ""}، بزرگ‌نمایی`}
                className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-tint lg:rounded-[24px]"
              >
                <Image
                  src={cover(it)}
                  alt={it.alt}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-2 bottom-2 flex flex-wrap justify-between gap-1.5 lg:inset-x-3 lg:bottom-3">
                  <span className="rounded-pill bg-ivory/95 px-2.5 py-0.5 text-xs leading-5 text-ink">
                    {treatmentLabel(it.treatment)}
                  </span>
                  {it.kind === "pair" && (
                    <span className="rounded-pill bg-primary px-2.5 py-0.5 text-xs leading-5 text-white">قبل و بعد</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Viewer items={shown} index={open} onIndex={setOpen} />
    </>
  );
}

/** Full-screen viewer on a native <dialog>: Esc and the close button dismiss it, focus stays inside. */
function Viewer({ items, index, onIndex }: { items: GalleryItem[]; index: number | null; onIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const start = useRef<number | null>(null);
  const item = index === null ? null : items[index];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (index === null && d.open) {
      d.close();
    }
  }, [index]);

  const step = (delta: number) => index !== null && onIndex((index + delta + items.length) % items.length);

  return (
    <dialog
      ref={ref}
      aria-label="نمایش تصویر"
      onClose={() => {
        document.documentElement.style.overflow = "";
        onIndex(null);
      }}
      onKeyDown={(e) => {
        // The before/after slider uses the arrow keys itself.
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        if (e.key === "ArrowLeft") step(1);
        else if (e.key === "ArrowRight") step(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory/[0.97] p-0 text-ink backdrop:bg-ink/30 backdrop:backdrop-blur-md"
    >
      {item && index !== null && (
        <div className="mx-auto flex h-full max-w-[1100px] flex-col px-4 pt-[max(12px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))] lg:px-8">
          <div className="flex h-14 shrink-0 items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-2">
                {toFaDigits(index + 1)} از {toFaDigits(items.length)}
              </span>
              <span className="rounded-pill border border-line bg-surface px-3 py-0.5">{treatmentLabel(item.treatment)}</span>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => ref.current?.close()}
              aria-label="بستن"
              className="-me-2 flex size-11 items-center justify-center rounded-full text-ink hover:bg-tint"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className="relative flex min-h-0 grow items-center justify-center"
            onPointerDown={(e) => {
              start.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (start.current === null || item.kind === "pair") return;
              const dx = e.clientX - start.current;
              start.current = null;
              // RTL: swipe right for the next photo.
              if (Math.abs(dx) > 50) step(dx > 0 ? 1 : -1);
            }}
          >
            {item.kind === "pair" ? (
              <div className="w-full max-w-[min(900px,calc((100dvh-220px)*1.5))]">
                <BeforeAfter
                  item={{ title: treatmentLabel(item.treatment), label: item.id, before: item.before, after: item.after }}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  caption={false}
                />
              </div>
            ) : (
              <Image
                key={item.id}
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                sizes="(min-width: 1024px) 900px, 100vw"
                className="h-auto max-h-full w-auto max-w-full rounded-[24px] border-[6px] border-surface object-contain shadow-[0_30px_60px_-30px_rgba(28,39,51,0.45)]"
                style={{ touchAction: "pan-y" }}
                draggable={false}
              />
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="تصویر قبلی"
              className="fan-arrow shrink-0"
            >
              <ChevronIcon flip />
            </button>
            <p className="line-clamp-2 text-center text-sm leading-[1.9] text-muted-2">
              {item.alt}
              {item.kind === "pair" && <span className="block text-muted">خط وسط را بکشید تا قبل و بعد را ببینید.</span>}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="تصویر بعدی"
              className="fan-arrow shrink-0"
            >
              <ChevronIcon />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
