import { test, expect } from "@playwright/test";

test.describe("Test group", () => {
  test("seed", async ({ page }) => {
    // loginCredentials = {
    //   user: "client",
    //   password: "Password123"
    // };
    // generate code here.
    await page.goto("/");
    await expect(page).toHaveTitle(
      "Common Goods — thoughtful things, well made",
    );
  });
});
