import "./lib/error-capture";

import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";
import { isSsrResponse, replaceSsrResponse } from "@tanstack/router-core/ssr/server";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type SsrHandlerResult = Awaited<ReturnType<typeof defaultStreamHandler>>;

function errorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
//
// `result` here isn't always a plain Response: handler callbacks in this
// TanStack Start version may return the SsrResponse wrapper shape
// (`{ response, serverSsrCleanup, dispose }`) that `defaultStreamHandler`
// produces for streamed output. Unwrap with `isSsrResponse` before reading
// `.status`/`.headers`, and swap in the fallback via `replaceSsrResponse` so
// the original stream is disposed instead of leaking.
async function normalizeCatastrophicSsrResponse(
  result: SsrHandlerResult,
): Promise<SsrHandlerResult> {
  try {
    const response = isSsrResponse(result) ? result.response : result;

    if (!response || response.status < 500) return result;

    // Not a proper Response (no Headers instance) — this is itself the
    // catastrophic case this function exists to handle, just in a shape we
    // didn't originally account for. Fall through to the fallback page
    // instead of throwing on `.headers.get(...)`.
    if (!response.headers || typeof response.headers.get !== "function") {
      console.error(
        consumeLastCapturedError() ??
          new Error(`SSR produced a malformed >=500 response with no headers (status ${response.status})`),
      );
      return replaceSsrResponse(result, errorResponse());
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return result;

    const body = await response.clone().text();
    if (!isH3SwallowedErrorBody(body)) return result;

    console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    return replaceSsrResponse(result, errorResponse());
  } catch (normalizeError) {
    // Last resort: never let this safety net itself take the request down.
    console.error(consumeLastCapturedError() ?? normalizeError);
    return replaceSsrResponse(result, errorResponse());
  }
}


const PUBLIC_ROUTES = ["/", "/services", "/clients", "/about", "/contact"];

function xmlEscape(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char] ?? char,
  );
}

function seoResponse(request: Request, pathname: string): Response | null {
  const url = new URL(request.url);
  if (pathname === "/sitemap.xml") {
    const urls = PUBLIC_ROUTES.map(
      (route) => `  <url><loc>${xmlEscape(new URL(route, url.origin).toString())}</loc></url>`,
    ).join("\n");
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    return new Response(body, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  if (pathname === "/robots.txt") {
    const body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /auth",
      "Disallow: /admin",
      "Disallow: /dashboard",
      "Disallow: /profile",
      "",
      `Sitemap: ${new URL("/sitemap.xml", url.origin).toString()}`,
      "",
    ].join("\n");
    return new Response(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  return null;
}

const customHandler = defineHandlerCallback(async (ctx) => {
  const response = await defaultStreamHandler(ctx);
  return normalizeCatastrophicSsrResponse(response);
});

const startFetch = createStartHandler(customHandler);

// createServerEntry() is the preset-agnostic entry shape (works the same way
// across Vercel, Node, Cloudflare, etc. — unlike a raw Cloudflare
// Workers-style `fetch(request, env, ctx)` export).
export default createServerEntry({
  async fetch(request: Request) {
    try {
      const seo = seoResponse(request, new URL(request.url).pathname);
      if (seo) return seo;
      return await startFetch(request);
    } catch (error) {
      console.error(error);
      return errorResponse();
    }
  },
});
