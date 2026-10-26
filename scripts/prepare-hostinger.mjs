import { access, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const nitroEntry = resolve(projectRoot, ".output/server/index.mjs");
const outputEntry = resolve(projectRoot, ".output/index.mjs");

try {
  await access(nitroEntry);
} catch {
  console.error(
    "[hostinger] Nitro entry is missing at .output/server/index.mjs. Check that the Nitro node-server preset completed successfully.",
  );
  process.exitCode = 1;
  throw new Error("Cannot prepare Hostinger entry: Nitro server bundle not found.");
}

// Some hosting deployers resolve entry_file relative to the configured output
// directory; others resolve it relative to the project root. Make index.mjs
// available in both places to avoid the .output/.output path mismatch.
await writeFile(outputEntry, 'import "./server/index.mjs";\\n', "utf8");
console.log("[hostinger] Entry points ready: index.mjs and .output/index.mjs");
