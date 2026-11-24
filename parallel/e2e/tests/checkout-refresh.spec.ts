// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Session and history edge cases", () => {
  test("Refresh checkout page @smoke", async ({ page }) => {
    // 1. Add an item, open `/checkout`, and refresh.
    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByRole("button", { name: "Add Cedar candle to bag" }).click();
    await page.getByRole("button", { name: "View bag 1" }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "client" })).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole("button", { name: "client" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toHaveCount(0);
    await expect(page.getByRole("banner")).toContainText("0");
    await expect(page.getByText("0 pieces")).toBeVisible();
    await expect(page.getByText("Your bag is waiting.")).toBeVisible();
    await expect(page.getByText("Total").locator("..")).toContainText("$0.00");
  });
});
