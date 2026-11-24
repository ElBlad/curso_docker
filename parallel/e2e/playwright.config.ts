import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

const workers = Number(process.env.PLAYWRIGHT_WORKERS ?? "2");
const CI = process.env.CI === "true";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: CI ? workers : undefined,
  forbidOnly: Boolean(CI),
  // retries: CI ? 2 : 0,
  retries: 0,
  timeout: 6_000,
  expect: {
    timeout: 3_000,
  },
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  reporter: CI
    ? [
        ["list"],
        [
          "html",
          {
            outputFolder: "/artifacts/playwright-report",
            open: "never",
          },
        ],
        [
          "junit",
          {
            outputFile: "/artifacts/test-results/results.xml",
          },
        ],
      ]
    : [],

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
