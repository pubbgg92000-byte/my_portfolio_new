import { expect, test } from "@playwright/test";

test("home renders hero, header and projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/building/i);
  await expect(page.locator("header.main-nav")).toBeVisible();
  await expect(page.locator(".project-row").first()).toBeVisible();
});

test("project page shows details and pagination", async ({ page }) => {
  await page.goto("/projects/staffly");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/staffly/i);
  await expect(page.getByRole("navigation", { name: /browse other projects/i })).toBeVisible();
});

test("unknown route returns the styled 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/doesn.t exist/i);
});

test("contact form rejects an empty submission", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.locator(".form-status")).toContainText(/fix the highlighted/i);
  await expect(page.locator(".field-error")).toHaveCount(3);
});

test("command palette opens with the keyboard and navigates", async ({ page }) => {
  await page.goto("/resume");
  const input = page.getByRole("combobox", { name: /search pages/i });
  // The shortcut listener is attached after hydration, so retry until the dialog opens.
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  await expect(input).toBeFocused();
  await input.fill("staffly");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/staffly/);
});

test("project filters narrow the list", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^professional/i }).click();
  await expect(page.locator(".project-row")).toHaveCount(4);
  await page.getByRole("button", { name: /^all/i }).click();
  await expect(page.locator(".project-row")).toHaveCount(7);
});

test("open graph image renders for a project", async ({ request }) => {
  const response = await request.get("/projects/staffly/opengraph-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("3D portfolio exposes accessible navigation and existing project content", async ({ page }) => {
  await page.goto("/3d?fallback=1");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/building interfaces/i);
  await expect(page.getByRole("link", { name: /explore my work/i })).toHaveAttribute("href", "#work");
  await expect(page.getByRole("heading", { name: /staffly/i })).toBeVisible();
  await expect(page.locator('a[href="/projects/staffly"]')).toBeVisible();
});

test("3D portfolio fallback retains content, contact and classic portfolio link", async ({ page }) => {
  await page.goto("/3d?fallback=1");
  await expect(page.getByRole("link", { name: /classic portfolio/i })).toHaveAttribute("href", "/");
  await expect(page.getByRole("heading", { name: /tools arranged/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /mangalarapuarvind@gmail\.com/i })).toBeVisible();
});
