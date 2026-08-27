"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MotionQuality = "high" | "balanced" | "low";

const STORAGE_KEY = "glassy:motion-quality";

type Ctx = {
  /** What the user picked, or "auto" to let the device decide. */
  preference: MotionQuality | "auto";
  /** The quality actually in effect right now. */
  quality: MotionQuality;
  /** True when 3D/scroll-linked effects should be skipped entirely. */
  lowPower: boolean;
  /** Multiplier applied to transform distances / tilt angles. */
  scale: number;
  setPreference: (value: MotionQuality | "auto") => void;
};

const MotionPrefsContext = createContext<Ctx>({
  preference: "auto",
  quality: "high",
  lowPower: false,
  scale: 1,
  setPreference: () => {},
});

/** Cheap capability sniff — runs once on the client. */
function detectQuality(): MotionQuality {
  if (typeof window === "undefined") return "high";
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return "low";
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;

    // Phones should stay in the balanced path even when they report desktop-
    // class CPU/RAM figures. This avoids stacking several scroll-linked 3D
    // animations on a small compositor while preserving the site's motion.
    if (narrow) return "balanced";
    if (cores <= 4 || memory <= 4) return "low";
    if (cores <= 6 || memory <= 6) return "balanced";
    return "high";
  } catch {
    return "balanced";
  }
}

export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<MotionQuality | "auto">("auto");
  const [detected, setDetected] = useState<MotionQuality>("high");

  // Client-only: never read storage or device hints during SSR/hydration.
  useEffect(() => {
    setDetected(detectQuality());
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "high" || stored === "balanced" || stored === "low" || stored === "auto") {
        setPreferenceState(stored);
      }
    } catch {
      /* storage blocked — stay on auto */
    }
  }, []);

  const setPreference = useCallback((value: MotionQuality | "auto") => {
    setPreferenceState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  const quality = preference === "auto" ? detected : preference;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset["motion"] = quality;
  }, [quality]);

  const value = useMemo<Ctx>(
    () => ({
      preference,
      quality,
      lowPower: quality === "low",
      scale: quality === "high" ? 1 : quality === "balanced" ? 0.6 : 0,
      setPreference,
    }),
    [preference, quality, setPreference],
  );

  return <MotionPrefsContext.Provider value={value}>{children}</MotionPrefsContext.Provider>;
}

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}
