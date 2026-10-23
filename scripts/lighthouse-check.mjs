// Fails the build when any audited page drops below the budget.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.LH_BASE_URL ?? "http://localhost:3999";
const pages = ["/", "/projects/staffly", "/contact"];
const minimums = { performance: 0.8, accessibility: 1, "best-practices": 1, seo: 1 };

const dir = mkdtempSync(join(tmpdir(), "lighthouse-"));
let failed = false;

for (const path of pages) {
  const out = join(dir, `${path.replace(/\W+/g, "_") || "home"}.json`);
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@12",
      `${base}${path}`,
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
      "--chrome-flags=--headless=new --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(`Lighthouse could not audit ${path}`);
    failed = true;
    continue;
  }
  const { categories } = JSON.parse(readFileSync(out, "utf8"));
  for (const [key, minimum] of Object.entries(minimums)) {
    const score = categories[key].score;
    const ok = score >= minimum;
    console.log(`${ok ? "PASS" : "FAIL"} ${path.padEnd(18)} ${key.padEnd(15)} ${Math.round(score * 100)} (min ${Math.round(minimum * 100)})`);
    if (!ok) failed = true;
  }
}

process.exit(failed ? 1 : 0);
