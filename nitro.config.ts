import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  routeRules: {
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
