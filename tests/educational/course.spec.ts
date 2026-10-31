// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";

const answers = [
  ["patterns", "11"],
  ["readings", "-3"],
  ["adder", "3"],
  ["flags", "0"],
  ["masks", "6"],
  ["shifts", "253"],
  ["alu", "5"],
  ["compare", "1"],
  ["widen", "0xFFEA"],
  ["memory", "0x2D"],
] as const;

test("home, theme, study marks and practice links work", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "process data",
  );
  await page.getByLabel("Theme", { exact: true }).selectOption("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: "Start with bits" }).click();
  await page
    .getByRole("button", { name: "Mark as studied", exact: true })
    .click();
  await page.getByRole("link", { name: "Learning path", exact: false }).click();
  await expect(page.getByText("1 / 10 marked studied")).toBeVisible();
  await page.getByRole("link", { name: "Practice", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /Calculator exercise bank/ }),
  ).toHaveAttribute("href", /calculator\/#exh$/);
  await expect(
    page.getByRole("link", { name: /Two readings: drills/ }),
  ).toHaveAttribute("href", /readings-drills.html$/);
});

for (const [id, value] of answers)
  test(`${id}: predict, reveal, change, answer, restore and reset`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`./#/lesson/${id}`);
    await expect(page.locator(".lab-result")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Reveal result", exact: true })
      .click();
    await expect(page.locator(".lab-result")).toBeVisible();
    const aBit = page.getByRole("button", { name: /^A bit 0:/ });
    await aBit.click();
    await expect(page.locator(".lab-result")).toHaveCount(0);
    for (const theme of ["light", "dark"]) {
      await page.getByLabel("Theme", { exact: true }).selectOption(theme);
      await page
        .getByRole("button", { name: "Reveal result", exact: true })
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Hide result", exact: true })
        .click();
    }
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(
      page.getByText("Check your input", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Your answer", { exact: true }).fill("999999");
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(page.locator(".challenge")).toHaveAttribute(
      "data-complete",
      "false",
    );
    await page.getByLabel("Your answer", { exact: true }).fill(value);
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(page.locator(".challenge")).toHaveAttribute(
      "data-complete",
      "true",
    );
    await page.reload();
    await expect(page.locator(".challenge")).toHaveAttribute(
      "data-complete",
      "true",
    );
    await page.getByRole("button", { name: /^Clear work:/ }).click();
    await page
      .getByRole("button", { name: "Discard work", exact: true })
      .click();
    await expect(page.getByLabel("Your answer", { exact: true })).toHaveValue(
      "",
    );
    await expect(page.locator(".challenge")).toHaveAttribute(
      "data-complete",
      "false",
    );
    expect(errors).toEqual([]);
  });

test("calculator retains exercises, imports old progress once and isolates its cache", async ({
  page,
  context,
}) => {
  await page.goto("./");
  await page.evaluate(async () => {
    localStorage.setItem("pc-done", JSON.stringify({ 1: true }));
    localStorage.setItem("pc-done-layout", "5");
    await caches.open("assembly-lab-keep-me");
  });
  await page.goto("./calculator/");
  await expect(page.locator(".ex")).toHaveCount(110);
  await expect(page.locator('.ex input[data-n="1"]')).toBeChecked();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  expect(await page.evaluate(() => caches.has("assembly-lab-keep-me"))).toBe(
    true,
  );
  expect(await page.evaluate(() => localStorage.getItem("pc-done"))).toBe(
    '{"1":true}',
  );
  await page.evaluate(() =>
    localStorage.setItem("bit-lab:legacy:pc-done", "{}"),
  );
  await page.reload();
  await expect(page.locator('.ex input[data-n="1"]')).not.toBeChecked();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Programmer Calculator", exact: true }),
  ).toBeVisible();
  await context.setOffline(false);
});

test("original interactive pages still run", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const file of [
    "gates-to-alu",
    "adding-to-subtracting",
    "readings-drills",
    "c-meets-the-wheel",
    "bit-lab",
    "gates-to-register",
    "who-decides",
    "bytes-to-registers",
    "flag-drills",
  ]) {
    await page.goto(`./calculator/docs/${file}.html`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "← Bit Lab lessons", exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
