import { createServerFn } from "@tanstack/react-start";

export type SiteContentMap = Record<string, Record<string, string>>;

/** Public read of editable site content (used by route loaders during SSR). */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];

  // Fail soft: a missing env var here previously threw and took the whole
  // page down via the SSR error boundary. Site content is progressive
  // enhancement (pick() falls back to hardcoded copy), so degrade instead.
  if (!url || !key) {
    console.error(
      "[site-content] Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY — set them in Vercel Project Settings > Environment Variables. Falling back to default copy.",
    );
    return {} as SiteContentMap;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) {
    console.error("Failed to read site content:", error);
    return {} as SiteContentMap;
  }

  const map: SiteContentMap = {};
  for (const row of data ?? []) {
    const fields: Record<string, string> = {};
    for (const [field, value] of Object.entries((row.value ?? {}) as Record<string, unknown>)) {
      if (typeof value === "string") fields[field] = value;
    }
    map[row.key as string] = fields;
  }
  return map;
});

export function pick(
  content: SiteContentMap | undefined,
  key: string,
  field: string,
  fallback: string,
): string {
  const value = content?.[key]?.[field];
  return value && value.trim() ? value : fallback;
}
