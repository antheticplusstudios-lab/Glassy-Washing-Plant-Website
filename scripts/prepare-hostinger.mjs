import { access, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const nitroEntry = resolve(projectRoot, ".output/server/index.mjs");
const outputEntry = resolve(projectRoot, ".output/index.mjs");
const rootEntry = resolve(projectRoot, "index.mjs");

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
await access(rootEntry);
await writeFile(outputEntry, 'import "./server/index.mjs";\n', "utf8");
const [serverInfo, outputInfo, rootInfo] = await Promise.all([
  stat(nitroEntry),
  stat(outputEntry),
  stat(rootEntry),
]);
console.log(`[hostinger] Nitro server: .output/server/index.mjs (${serverInfo.size} bytes)`);
console.log(`[hostinger] Output entry: .output/index.mjs (${outputInfo.size} bytes)`);
console.log(`[hostinger] Root entry: index.mjs (${rootInfo.size} bytes)`);
