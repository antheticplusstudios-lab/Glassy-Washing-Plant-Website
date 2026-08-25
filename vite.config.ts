import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Standalone config (no external build-config package). Vercel auto-detects
// TanStack Start + Nitro from this file and needs no extra build settings —
// see vercel.json for the explicit framework fallback.
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  plugins: [
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    viteReact(),
    // No preset: Vercel's zero-config Nitro detection picks the right target
    // at deploy time. Locally / on other hosts this still produces a valid
    // Node build in .output/.
    nitro(),
  ],
});
