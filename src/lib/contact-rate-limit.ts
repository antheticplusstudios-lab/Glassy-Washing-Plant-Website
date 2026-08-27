/**
 * Lightweight client-side spam brake for the contact form. This is not a
 * security boundary (it lives in localStorage, so it is trivially reset) —
 * it just stops accidental double-sends and casual abuse. The server
 * function still re-validates the honeypot, timing and math-challenge
 * fields on every request.
 */

const STORAGE_KEY = "contact-brief-submissions";

export const CONTACT_RATE_LIMIT = {
  shortWindowMs: 60_000,
  shortWindowMax: 1,
  longWindowMs: 60 * 60_000,
  longWindowMax: 3,
};

function readTimestamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === "number") : [];
  } catch {
    return [];
  }
}

function writeTimestamps(timestamps: number[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // localStorage unavailable (private browsing, storage disabled, quota) — fail open.
  }
}

export type ContactRateLimitResult = { allowed: true } | { allowed: false; reason: string };

export function checkContactRateLimit(): ContactRateLimitResult {
  const now = Date.now();
  const timestamps = readTimestamps().filter((t) => now - t < CONTACT_RATE_LIMIT.longWindowMs);

  const recentShort = timestamps.filter((t) => now - t < CONTACT_RATE_LIMIT.shortWindowMs);
  if (recentShort.length >= CONTACT_RATE_LIMIT.shortWindowMax) {
    return { allowed: false, reason: "Please wait a minute before sending another brief." };
  }

  if (timestamps.length >= CONTACT_RATE_LIMIT.longWindowMax) {
    return { allowed: false, reason: "You've reached the hourly limit — please try again later." };
  }

  return { allowed: true };
}

export function recordContactSubmission() {
  const now = Date.now();
  const timestamps = readTimestamps().filter((t) => now - t < CONTACT_RATE_LIMIT.longWindowMs);
  timestamps.push(now);
  writeTimestamps(timestamps);
}
