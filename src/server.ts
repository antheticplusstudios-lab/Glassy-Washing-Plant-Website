import "./lib/error-capture";

import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

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
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  try {
    if (!response || response.status < 500) return response;

    // Not a proper Response (no Headers instance) — this is itself the
    // catastrophic case this function exists to handle, just in a shape we
    // didn't originally account for. Fall through to the fallback page
    // instead of throwing on `.headers.get(...)`.
    if (!response.headers || typeof response.headers.get !== "function") {
      console.error(
        consumeLastCapturedError() ??
          new Error(`SSR produced a malformed >=500 response with no headers (status ${response.status})`),
      );
      return errorResponse();
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return response;

    const body = await response.clone().text();
    if (!isH3SwallowedErrorBody(body)) return response;

    console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    return errorResponse();
  } catch (normalizeError) {
    // Last resort: never let this safety net itself take the request down.
    console.error(consumeLastCapturedError() ?? normalizeError);
    return errorResponse();
  }
}

const customHandler = defineHandlerCallback(async (ctx) => {
  const response = await defaultStreamHandler(ctx);
  return normalizeCatastrophicSsrResponse(response);
});

const startFetch = createStartHandler(customHandler);

// createServerEntry() is the preset-agnostic entry shape (works the same way
// across Vercel, Node, Cloudflare, Netlify, etc. — unlike a raw Cloudflare
// Workers-style `fetch(request, env, ctx)` export).
export default createServerEntry({
  async fetch(request: Request) {
    try {
      return await startFetch(request);
    } catch (error) {
      console.error(error);
      return errorResponse();
    }
  },
});
