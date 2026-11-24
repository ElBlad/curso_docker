// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Bag and checkout entry", () => {
  test("Decrement quantity and remove final unit @smoke", async ({ page }) => {
    // 1. Open `/checkout` with a Cedar candle at quantity 2.
    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    const addCedar = page.getByRole("button", {
      name: "Add Cedar candle to bag",
    });
    await addCedar.click();
    await addCedar.click();
    await page.getByRole("button", { name: "View bag 2" }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole("banner")).toContainText("2");
    await expect(page.getByText("2 pieces")).toBeVisible();
    await expect(page.getByText("Total").locator("..")).toContainText("$72.00");

    // 2. Click “Remove one Cedar candle” once.
    const removeCedar = page.getByRole("button", {
      name: "Remove one Cedar candle",
    });
    await removeCedar.click();

    await expect(page.getByRole("banner")).toContainText("1");
    await expect(page.getByText("1 pieces")).toBeVisible();
    await expect(page.getByText("Total").locator("..")).toContainText("$36.00");

    // 3. Click “Remove one Cedar candle” again.
    await removeCedar.click();

    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toHaveCount(0);
    await expect(page.getByRole("banner")).toContainText("0");
    await expect(page.getByText("0 pieces")).toBeVisible();
    await expect(page.getByText("Your bag is waiting.")).toBeVisible();
    await expect(page.getByText("Total").locator("..")).toContainText("$0.00");
  });
});
