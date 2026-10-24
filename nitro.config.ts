import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  routeRules: {
    // NOTE: /images/** is cached for a year and marked immutable, so browsers
    // and the CDN will never re-download a file at the same URL. To change a
    // photo, save it under a NEW path (e.g. bump public/images/v2 -> v3 and
    // update the paths in src/) instead of overwriting the old file.
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/favicon.ico": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/robots.txt": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
      },
    },
  },
});
