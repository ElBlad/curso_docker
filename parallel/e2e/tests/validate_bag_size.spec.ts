import { test, expect } from "@playwright/test";

test("has 2 items when 2 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made.",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .dblclick();
  await expect(page.getByRole("banner")).toContainText("2");
});

test("has 3 items when 3 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .click({ clickCount: 3 });
  await expect(page.getByRole("banner")).toContainText("3");
});

test("has 4 items when 4 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made.",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .click({ clickCount: 4 });
  await expect(page.getByRole("banner")).toContainText("4");
});

test("has 5 items when 5 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made.",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .click({ clickCount: 5 });
  await expect(page.getByRole("banner")).toContainText("5");
});

test("has 6 items when 6 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made.",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .click({ clickCount: 6 });
  await expect(page.getByRole("banner")).toContainText("6");
});

test("has 7 items when 7 items are added @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("h1")).toContainText(
    "Thoughtful things, well made.",
  );
  await expect(page.getByRole("banner")).toContainText("0");

  await page
    .getByRole("button", { name: "Add Cedar candle to bag" })
    .click({ clickCount: 7 });
  await expect(page.getByRole("banner")).toContainText("7");
});
