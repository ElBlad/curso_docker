import { test, expect } from "@playwright/test";

const productsSeeded = process.env.SEED_PRODUCTS === "true";

test.describe("Database seeded tests", () => {
  test("client sees no products when products are not seeded @regression", async ({
    page,
  }, testInfo) => {
    test.skip(productsSeeded, "Run this test with SEED_PRODUCTS=false");

    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("main")).toContainText("· 0 pieces");
    await testInfo.attach("no-seeded-products-full-page", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("client sees six products when products are seeded @regression", async ({
    page,
  }, testInfo) => {
    test.skip(!productsSeeded, "Run this test with SEED_PRODUCTS=true");

    await page.goto("/");
    await page.getByRole("textbox", { name: "Username" }).fill("client");
    await page.getByRole("textbox", { name: "Password" }).fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("main")).toContainText("· 6 pieces");
    await testInfo.attach("seeded-products-full-page", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
});
