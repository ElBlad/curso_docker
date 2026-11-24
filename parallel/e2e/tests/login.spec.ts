import { test, expect } from "@playwright/test";

test("valid login @regression", async ({ page }) => {
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
});

test("invalid login @regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Common Goods — thoughtful things, well made");

  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("client");
  await page.getByRole("textbox", { name: "Username" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("WrongPassword");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("alert")).toContainText(
    "Invalid username or password",
  );
});
