// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Session and history edge cases", () => {
  test("Browser back and forward navigation @smoke", async ({ page }) => {
    // 1. Open `/checkout` from `/shop`, then use browser Back.
    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByRole("button", { name: "Add Cedar candle to bag" }).click();
    await page.getByRole("button", { name: "View bag 1" }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("banner")).toContainText("1");

    // 2. Use browser Forward.
    await page.goForward();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(
      page.getByRole("heading", { name: "Cedar candle" }),
    ).toBeVisible();
    await expect(page.getByText("1 pieces")).toBeVisible();
    await expect(page.getByText("Total").locator("..")).toContainText("$36.00");

    // 3. Place an order and use browser Back.
    await page.getByRole("textbox", { name: "First name" }).fill("Maya");
    await page.getByRole("textbox", { name: "Last name" }).fill("Chen");
    await page
      .getByRole("textbox", { name: "Delivery address" })
      .fill("123 Main St, Seattle, WA 98101");
    await page.getByRole("button", { name: "Place your order" }).click();

    await expect(
      page.getByRole("heading", { name: "Thank you." }),
    ).toBeVisible();
    await expect(page.getByText(/Your order CG-\d+ is in/)).toBeVisible();

    await page.goBack();
    await expect(
      page.getByRole("heading", { name: "Thank you." }),
    ).toBeVisible();
    await expect(page.getByText(/Your order CG-\d+ is in/)).toBeVisible();
  });
});
