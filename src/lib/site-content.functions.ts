import { createServerFn } from "@tanstack/react-start";

export type SiteContentMap = Record<string, Record<string, string>>;

/** Public read of editable site content (used by route loaders during SSR). */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];

    // CMS content is an enhancement: all public pages have safe hardcoded
    // fallbacks, so an unavailable CMS must never break server rendering.
    if (!url || !key) {
      console.warn("[site-content] Supabase server configuration is missing; using default site copy.");
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
      console.warn("[site-content] CMS query failed; using default site copy.");
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
  } catch {
    // DNS/network/configuration errors should not turn into failed page requests.
    console.warn("[site-content] CMS unavailable; using default site copy.");
    return {} as SiteContentMap;
  }
});