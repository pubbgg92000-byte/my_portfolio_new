// Dev helper: screenshot a page with WebGL. Usage: node scripts/shot.mjs <url> <out.png> [waitMs] [w] [h]
import { chromium } from "@playwright/test";
const [url, out, wait = "8000", w = "1440", h = "900"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text().slice(0, 200)));
page.on("pageerror", (e) => console.log("pageerror:", e.message.slice(0, 200)));
await page.goto(url, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(+wait);
for (const step of (process.env.STEPS || "").split(";").filter(Boolean)) {
  const [kind, value, ms = "1500"] = step.split("|");
  if (kind === "click") await page.getByRole("button", { name: new RegExp(value, "i") }).first().click({ timeout: 90000 });
  if (kind === "key") { await page.keyboard.down(value); await page.waitForTimeout(+ms); await page.keyboard.up(value); }
  if (kind === "wait") await page.waitForTimeout(+value);
}
await page.screenshot({ path: out });
await browser.close();
