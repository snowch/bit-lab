// Copyright © 2026 Christopher Snow
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/educational",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4173/bit-lab/",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "phone",
      use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run preview -w @bl/course -- --host 127.0.0.1",
    url: "http://127.0.0.1:4173/bit-lab/",
    reuseExistingServer: !process.env.CI,
  },
});
