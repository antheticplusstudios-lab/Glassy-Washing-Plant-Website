"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { type ReactNode } from "react";

import { useMotionPrefs } from "@/lib/motion-prefs";

type Dir = "up" | "down" | "left" | "right";

const offsets: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: Dir;
  /** Kept for call-site compatibility; entrances no longer tilt or scale. */
  tilt?: boolean;
}) {
  const reduce = useReducedMotion();
  const { quality, scale } = useMotionPrefs();
  const o = offsets[from];

  if (reduce || quality === "low") return <div className={className}>{children}</div>;

  // Entrances are plain slide-ins: no rotation, perspective or scaling. Those
  // transforms squeezed text and cards for a moment while a page loaded.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, x: o.x * scale, y: o.y * scale }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: quality === "high" ? 0.7 : 0.5,
        delay: delay * (quality === "high" ? 0.09 : 0.05),
        ease: [0.2, 0, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function SplitText({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  // Keep headings fully visible in server-rendered HTML. Word-by-word
  // transforms can leave clipped/hidden text on slow or interrupted hydration.
  return <Tag className={className}>{text}</Tag>;
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const { quality } = useMotionPrefs();
  if (reduce || quality === "low") return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      // `className` is often "m3-card ...", which carries its own CSS
      // `transition: transform ...`. Framer writes `transform` on this same
      // element every animation frame, so that CSS transition kept
      // re-triggering against a constantly-moving target — the card would
      // lag behind the pointer instead of tracking it smoothly. Clearing the
      // transform transition here leaves it entirely to Framer's spring,
      // while box-shadow/border-color still animate via the CSS class.
      style={{
        transformPerspective: 1000,
        transition:
          "box-shadow 0.4s var(--ease-emphasized), border-color 0.4s var(--ease-emphasized)",
      }}
      whileHover={quality === "high" ? { rotateX: -4, rotateY: 4, y: -6 } : { y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const { quality } = useMotionPrefs();
  const reduce = useReducedMotion();
  const still = reduce || quality === "low";

  if (still) {
    return (
      <div className="flex gap-10 overflow-hidden border-y border-border bg-surface-1 px-4 py-4">
        {items.map((item) => (
          <span key={item} className="eyebrow whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative flex overflow-hidden border-y border-border bg-surface-1 py-4"
      aria-label="Capabilities"
    >
      <div className="marquee-track flex shrink-0 gap-10 pr-10">
        {items.map((item) => (
          <span key={item} className="eyebrow whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
      <div className="marquee-track flex shrink-0 gap-10 pr-10" aria-hidden="true">
        {items.map((item) => (
          <span key={item} className="eyebrow whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Scroll-linked 3D wrapper: the block tilts in as it enters the viewport and
 * tilts back out as it leaves. Transform-only (GPU) so scrolling stays smooth.
 * Skipped entirely in low-power mode; softened on balanced.
 */
export function Scroll3D({
  children,
  className,
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const { quality, scale } = useMotionPrefs();

  if (reduce || quality === "low") return <div className={className}>{children}</div>;

  const k = intensity * scale;
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 1, y: 16 * k }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
        transition={{
          duration: quality === "high" ? 0.65 : 0.45,
          ease: [0.2, 0, 0, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Thin scroll progress rail, mounted once in the root layout. */
export function ScrollProgress() {
  const { quality } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });

  if (quality !== "high") return null;
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, willChange: "transform" }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-primary"
    />
  );
}
