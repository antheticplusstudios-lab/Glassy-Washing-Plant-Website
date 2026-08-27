"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/lib/site-data";

const PERSPECTIVE = 1500;
const SCALE_STEP = 0.15;
const DEPTH = 190;
const AUTOPLAY_MS = 3000;
const EASE = "cubic-bezier(0.2, 0, 0, 1)";

/**
 * A 3D coverflow gallery: the active service sits upright and centred while
 * neighbours fall back in perspective on either side. Click a side card, use
 * the arrow controls, swipe, or the arrow keys to bring another to centre.
 * Every card carries its photo with the service name pinned to the
 * bottom-left corner. Autoplay is on by default and pauses on hover, focus,
 * drag, or when the tab is hidden. Falls back to a plain swipeable strip
 * under reduced motion / low-power settings.
 */
export function ServiceCoverflow({
  items,
  className,
}: {
  items: ServiceItem[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { quality, scale } = useMotionPrefs();
  const n = items.length;

  // Measure the stage so card size adapts to any container width, including
  // small phone screens — re-attaches via callback ref whenever the stage
  // element mounts (e.g. after a motion-quality change swaps branches).
  const [stageWidth, setStageWidth] = useState(960);
  const roRef = useRef<ResizeObserver | null>(null);
  const stageRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setStageWidth(w);
    });
    ro.observe(el);
    roRef.current = ro;
  }, []);
  useEffect(() => () => roRef.current?.disconnect(), []);

  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  // Briefly lock input while a card is mid-move so rapid clicks/keys/swipes
  // don't stack up and look jittery.
  const lockRef = useRef(false);
  const lock = useCallback((ms: number) => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, ms);
  }, []);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current || n < 2) return;
      lock(520);
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock],
  );

  const goTo = useCallback(
    (i: number) => {
      if (lockRef.current || i === active) return;
      lock(520);
      setActive(i);
    },
    [active, lock],
  );

  // Autoplay — paused on hover/focus/drag/hidden tab, and skipped entirely
  // for reduced motion or low-power mode.
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || quality === "low" || !playing || paused || n < 2) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, quality, playing, paused, n, step]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const current = items[active] ?? items[0];

  // Reduced-motion / low-power fallback: a plain, cheap, native scroll-snap
  // strip. Still one section, still every service, still titled bottom-left.
  if (reduce || quality === "low") {
    return (
      <div className={cn("relative", className)}>
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <figure
              key={item.id}
              className="relative aspect-[4/3] w-[80%] shrink-0 snap-center overflow-hidden rounded-3xl border border-border shadow-elev-1 sm:w-[46%] lg:w-[31%]"
            >
              <img
                src={item.image}
                alt={`${item.title} garment wash process`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-inverse-foreground/70">
                  {item.id} / {String(n).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-inverse-foreground">
                  {item.title}
                </h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  const narrow = stageWidth < 640;
  const maxVisible = narrow ? 1 : 2;
  const renderWindow = maxVisible + 1;
  const availableWidth = Math.max(0, stageWidth - 8);
  const cardWidth = Math.max(220, Math.min(narrow ? availableWidth * 0.8 : availableWidth * 0.5, 620));
  const cardHeight = cardWidth * 0.75;
  const spacing = cardWidth * (narrow ? 0.56 : 0.62);
  const tiltDeg = 8 * scale;
  const sideTiltDeg = 6 * scale;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Wash and finishing services"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative flex items-center justify-center overflow-hidden rounded-3xl outline-none"
        style={{ height: cardHeight + 40, width: "100%", maxWidth: "100%", perspective: PERSPECTIVE }}
      >
        <motion.div
          className="relative cursor-grab active:cursor-grabbing"
          style={{ width: cardWidth, height: cardHeight, transformStyle: "preserve-3d" }}
          drag="x"
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          dragMomentum={false}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_e, info) => {
            setPaused(false);
            if (info.offset.x < -50) step(1);
            else if (info.offset.x > 50) step(-1);
          }}
        >
          {items.map((item, i) => {
            let rel = i - active;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;
            const ax = Math.abs(rel);
            if (ax > renderWindow) return null;

            const visible = ax <= maxVisible;
            const isActive = rel === 0;
            const sc = Math.max(0.42, 1 - ax * SCALE_STEP);
            const tx = rel * spacing;
            const tz = -ax * DEPTH * scale;
            const ry = -rel * tiltDeg;
            const rz = rel * sideTiltDeg;

            return (
              <div
                key={item.id}
                onClick={() => !isActive && goTo(i)}
                aria-hidden={!visible}
                className={cn(
                  "absolute top-1/2 left-1/2 overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-elev-2",
                  !isActive && visible && "cursor-pointer",
                )}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transformStyle: "preserve-3d",
                  transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                  transition: `transform 0.55s ${EASE}, opacity 0.55s ${EASE}`,
                  opacity: visible ? 1 : 0,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <img
                  src={item.image}
                  alt={`${item.title} garment wash process`}
                  loading={ax === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="pointer-events-none absolute inset-0 size-full object-cover select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/10 to-transparent" />
                <div
                  className="absolute inset-0 bg-black transition-opacity duration-500"
                  style={{ opacity: isActive ? 0 : 0.32 }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-inverse-foreground/70">
                    {item.id} / {String(n).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-lg leading-tight font-bold text-inverse-foreground sm:text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous service"
          className="state-layer grid size-11 place-items-center rounded-full border border-border bg-surface-1 text-foreground transition-colors hover:bg-surface-2"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="min-w-[68px] text-center font-mono text-xs tracking-widest text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
          aria-pressed={playing}
          className="state-layer grid size-11 place-items-center rounded-full border border-border bg-surface-1 text-foreground transition-colors hover:bg-surface-2"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next service"
          className="state-layer grid size-11 place-items-center rounded-full border border-border bg-surface-1 text-foreground transition-colors hover:bg-surface-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {current ? `Showing ${current.title}, service ${active + 1} of ${n}.` : null}
      </p>
    </div>
  );
}
