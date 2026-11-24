// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Bag and checkout entry", () => {
  test("Increment quantity and recalculate totals @smoke", async ({ page }) => {
    // 1. Open `/checkout` with one Cedar candle.
    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByRole("button", { name: "Add Cedar candle to bag" }).click();
    await expect(page.getByRole("banner")).toContainText("1");

    await page.getByRole("button", { name: "View bag 1" }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toBeVisible();
    await expect(page.getByText("1 pieces")).toBeVisible();
    await expect(page.locator("main")).toContainText("$36.00");

    // 2. Click “Add one Cedar candle” twice.
    const addCedar = page.getByRole("button", { name: "Add one Cedar candle" });
    await addCedar.click();
    await addCedar.click();

    await expect(page.getByRole("banner")).toContainText("3");
    await expect(page.getByText("3 pieces")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toHaveCount(1);
    await expect(page.locator("main")).toContainText("$108.00");
    await expect(page.getByText("Total").locator("..")).toContainText(
      "$108.00",
    );
  });
});
