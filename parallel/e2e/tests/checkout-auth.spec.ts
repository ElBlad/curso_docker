// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Session and history edge cases", () => {
  test("Direct unauthenticated checkout navigation @smoke", async ({
    browser,
  }) => {
    // 1. Use a fresh context and navigate directly to `/checkout`.
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/checkout");

    await expect(page).not.toHaveTitle(
      "Common Goods — thoughtful things, well made",
    );

    await context.close();
  });
});
