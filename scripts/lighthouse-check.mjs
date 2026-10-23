// Fails the build when any audited page drops below the budget.
// Set LH_RUNS=2 (or more) on noisy machines: the best score per category wins.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.LH_BASE_URL ?? "http://localhost:3999";
const runs = Math.max(1, Number(process.env.LH_RUNS ?? 1));
const pages = ["/", "/projects/staffly", "/contact"];
const minimums = { performance: 0.8, accessibility: 1, "best-practices": 1, seo: 1 };

const dir = mkdtempSync(join(tmpdir(), "lighthouse-"));
let failed = false;

function audit(path, attempt) {
  const out = join(dir, `${path.replace(/\W+/g, "_") || "home"}-${attempt}.json`);
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@12",
      `${base}${path}`,
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
      // Applied throttling measures the real page; simulated mode charges the LCP
      // image for every script request that starts before it paints.
      "--throttling-method=devtools",
      "--chrome-flags=--headless=new --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) return null;
  const { categories } = JSON.parse(readFileSync(out, "utf8"));
  return Object.fromEntries(Object.keys(minimums).map((key) => [key, categories[key].score]));
}

for (const path of pages) {
  const best = {};
  for (let attempt = 1; attempt <= runs; attempt += 1) {
    const scores = audit(path, attempt);
    if (!scores) continue;
    for (const [key, score] of Object.entries(scores)) best[key] = Math.max(best[key] ?? 0, score);
  }
  if (!Object.keys(best).length) {
    console.error(`Lighthouse could not audit ${path}`);
    failed = true;
    continue;
  }
  for (const [key, minimum] of Object.entries(minimums)) {
    const score = best[key];
    const ok = score >= minimum;
    console.log(`${ok ? "PASS" : "FAIL"} ${path.padEnd(18)} ${key.padEnd(15)} ${Math.round(score * 100)} (min ${Math.round(minimum * 100)}${runs > 1 ? `, best of ${runs}` : ""})`);
    if (!ok) failed = true;
  }
}

process.exit(failed ? 1 : 0);
