/** Reproducible manual Taste entrypoint. Does not edit/waive any upstream check. */
import { browserRuntime } from "./browser-runtime.mjs";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
const mode = process.argv[2] || "consistency";
const url = process.env.AUDIT_URL || "http://localhost:3000";
const root = ".agents/skills/design-taste-frontend";
const runtime = await browserRuntime();
mkdirSync("reports/design", { recursive: true });
if (mode === "gate" && !existsSync(".taste-skill/build.json")) {
  const armed = spawnSync(
    process.execPath,
    [
      `${root}/scripts/gate.mjs`,
      "--start",
      url,
      "--kind",
      "software",
      "--category",
      "enterprise AI analytics",
      "--primary",
      "Request an audit",
    ],
    { stdio: "inherit", env: process.env },
  );
  if (armed.status !== 0) process.exit(armed.status ?? 2);
}
const commands = {
  consistency: [
    `${root}/scripts/consistency.mjs`,
    url,
    "--page",
    "software",
    "--category",
    "enterprise AI analytics",
    "--primary",
    "Request an audit",
    "--widths",
    "1440,1024,768,390",
    "--out",
    "reports/design/taste",
    "--profile",
    ".taste-skill/chrome-consistency",
  ],
  layout: [
    `${root}/assets/layout/check.mjs`,
    "--url",
    url,
    "--sizes",
    "1440x900,1024x768,768x1024,390x844",
    "--shots",
    "reports/design/layout",
    "--profile",
    ".taste-skill/chrome-layout",
  ],
  perf: [
    `${root}/scripts/perf.mjs`,
    url,
    "--json",
    "reports/design/taste-perf.json",
    "--profile",
    ".taste-skill/chrome-perf",
  ],
  gate: [
    `${root}/scripts/gate.mjs`,
    url,
    "--profile",
    ".taste-skill/chrome-gate",
  ],
  shoot: [
    `${root}/scripts/shoot.mjs`,
    "--url",
    url,
    "--w",
    "1440",
    "--out",
    "reports/design/taste-desktop.png",
    "--profile",
    ".taste-skill/chrome-shoot",
  ],
};
if (!commands[mode])
  throw new Error("Use consistency, layout, perf, gate or shoot.");
const result = spawnSync(process.execPath, commands[mode], {
  stdio: "inherit",
  env: { ...process.env, CHROME_PATH: runtime.executablePath },
});
process.exit(result.status ?? 2);
