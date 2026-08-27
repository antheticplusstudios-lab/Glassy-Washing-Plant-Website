"use client";

import { AnimatePresence, motion } from "motion/react";
import { BatteryLow, Gauge, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

import { useMotionPrefs, type MotionQuality } from "@/lib/motion-prefs";
import { cn } from "@/lib/utils";

const options: { value: MotionQuality | "auto"; label: string; hint: string; icon: typeof Zap }[] = [
  { value: "auto", label: "Auto", hint: "Match this device", icon: Gauge },
  { value: "high", label: "Cinematic", hint: "Full 3D scroll motion", icon: Sparkles },
  { value: "balanced", label: "Balanced", hint: "Lighter transforms", icon: Zap },
  { value: "low", label: "Low power", hint: "Animations off", icon: BatteryLow },
];

/** Quick control for animation quality / low-power mode. */
export function MotionToggle({ compact = false }: { compact?: boolean }) {
  const { preference, quality, setPreference } = useMotionPrefs();
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <div className="mt-3 rounded-3xl border border-border bg-surface-1 p-3">
        <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Motion quality
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold",
                preference === option.value
                  ? "border-primary bg-primary-container text-on-primary-container"
                  : "border-border text-muted-foreground",
              )}
            >
              <option.icon size={13} /> {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Animation quality"
        aria-expanded={open}
        className="state-layer grid size-10 place-items-center rounded-full border border-border text-muted-foreground"
      >
        {quality === "low" ? <BatteryLow size={15} /> : <Gauge size={15} />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-3xl border border-border bg-card p-2 shadow-elev-3"
            >
              <p className="px-3 py-2 text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Motion quality
              </p>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setPreference(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    preference === option.value
                      ? "bg-primary-container text-on-primary-container"
                      : "hover:bg-surface-2",
                  )}
                >
                  <option.icon size={15} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">{option.hint}</span>
                  </span>
                </button>
              ))}
              <p className="px-3 pt-1 pb-2 text-[0.7rem] text-muted-foreground">
                Currently running: <strong className="capitalize">{quality}</strong>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
