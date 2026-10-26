import { access, mkdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const nitroEntry = resolve(projectRoot, ".output/server/index.mjs");
const outputEntry = resolve(projectRoot, ".output/index.mjs");
const rootEntry = resolve(projectRoot, "index.mjs");
const nestedOutputDir = resolve(projectRoot, ".output/.output");
const nestedServerEntry = resolve(nestedOutputDir, "server/index.mjs");
const nestedOutputEntry = resolve(nestedOutputDir, "index.mjs");

try {
  await access(nitroEntry);
} catch {
  console.error(
    "[hostinger] Nitro entry is missing at .output/server/index.mjs. Check that the Nitro node-server preset completed successfully.",
  );
  process.exitCode = 1;
  throw new Error("Cannot prepare Hostinger entry: Nitro server bundle not found.");
}

// Hostinger may resolve an entry file relative to the project root or relative
// to the configured output directory. Keep the root and output bootstraps, and
// create tiny compatibility shims for paths such as
// ".output/server/index.mjs" when resolved from inside ".output".
await access(rootEntry);
await mkdir(resolve(nestedOutputDir, "server"), { recursive: true });
await writeFile(outputEntry, 'import "./server/index.mjs";\n', "utf8");
await writeFile(nestedOutputEntry, 'import "../index.mjs";\n', "utf8");
await writeFile(nestedServerEntry, 'import "../../server/index.mjs";\n', "utf8");

const [serverInfo, outputInfo, rootInfo, nestedServerInfo, nestedOutputInfo] =
  await Promise.all([
    stat(nitroEntry),
    stat(outputEntry),
    stat(rootEntry),
    stat(nestedServerEntry),
    stat(nestedOutputEntry),
  ]);

console.log(`[hostinger] Nitro server: .output/server/index.mjs (${serverInfo.size} bytes)`);
console.log(`[hostinger] Output entry: .output/index.mjs (${outputInfo.size} bytes)`);
console.log(`[hostinger] Root entry: index.mjs (${rootInfo.size} bytes)`);
console.log(
  `[hostinger] Output-relative server shim: .output/.output/server/index.mjs (${nestedServerInfo.size} bytes)`,
);
console.log(
  `[hostinger] Output-relative bootstrap: .output/.output/index.mjs (${nestedOutputInfo.size} bytes)`,
);
