// Copyright © 2026 Christopher Snow

import { expect, test, type Page } from "@playwright/test";
import { ADDER_ARCHITECTURE_STRINGS as S } from "../../apps/course/src/strings.adder-architecture";

async function setWord(page: Page, label: "A" | "B", value: number) {
  for (let bit = 0; bit < 4; bit++) {
    const button = page.getByRole("button", {
      name: new RegExp(`^${label} bit ${bit}: [01]$`),
    });
    if (
      (await button.getAttribute("aria-pressed")) !==
      String(Boolean(value & (1 << bit)))
    )
      await button.click();
  }
}

for (const width of [375, 700, 1280])
  for (const theme of ["light", "dark"] as const) {
    test(`the three-input worked column is visible at ${width}px in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("./#/lesson/adder");
      await page.getByLabel("Theme", { exact: true }).selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(".adder-detail")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "A bit 1: 1", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: "B bit 1: 1", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await page
        .getByRole("button", { name: "Reveal result", exact: true })
        .click();
      const detail = page.locator(".adder-detail");
      await expect(detail.locator("[data-adder-column]")).toHaveCount(4);
      await expect(detail.locator("[data-adder-input]")).toHaveText([
        "1",
        "1",
        "1",
      ]);
      await expect(detail.locator("[data-adder-total]")).toHaveText("11");
      await expect(detail.locator("[data-adder-output]")).toHaveText([
        "1",
        "1",
      ]);
      await expect(detail.locator("[data-adder-proof]")).toHaveCount(5);
      await expect(detail.locator("[data-adder-gate]")).toHaveCount(5);
      await expect(detail).toContainText(S.adder.wireGuide);
      await expect(detail).toContainText(S.adder.scope);
      await expect(detail.locator("details")).toHaveCount(0);
      for (const column of await detail.locator("[data-adder-column]").all()) {
        const box = await column.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      const selected = detail.getByRole("button", {
        name: "Bit 2",
        exact: true,
      });
      await selected.scrollIntoViewIfNeeded();
      await selected.focus();
      const scroll = await page.evaluate(() => scrollY);
      const status = await detail.getByRole("status").elementHandle();
      await selected.press("Space");
      await expect(selected).toBeFocused();
      await expect(selected).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => scrollY)).toBe(scroll);
      expect(await status!.evaluate((element) => element.isConnected)).toBe(
        true,
      );
      await expect(detail.getByRole("status")).toContainText("Bit 2");
      await page
        .getByRole("button", { name: "A bit 0: 1", exact: true })
        .click();
      await expect(detail).toHaveCount(0);
      await page
        .getByRole("button", { name: "Reveal result", exact: true })
        .click();
      await expect(detail.locator('[data-adder-input="carry"]')).toHaveText(
        "0",
      );
      await expect(detail.locator("[data-adder-output]")).toHaveText([
        "1",
        "0",
      ]);
      await page
        .getByRole("button", { name: "Reset experiment", exact: true })
        .click();
      await expect(detail).toHaveCount(0);
      await page
        .getByRole("button", { name: "Reveal result", exact: true })
        .click();
      await expect(detail.locator("[data-adder-input]")).toHaveText([
        "1",
        "1",
        "1",
      ]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      expect(errors).toEqual([]);
    });
  }

test("all eight selected-column triples use the visible model proof", async ({
  page,
}) => {
  await page.goto("./#/lesson/adder");
  for (const a of [0, 1])
    for (const b of [0, 1])
      for (const incoming of [0, 1]) {
        await setWord(page, "A", (a << 1) | incoming);
        await setWord(page, "B", (b << 1) | incoming);
        if (
          await page
            .getByRole("button", { name: "Hide result", exact: true })
            .count()
        )
          await page
            .getByRole("button", { name: "Hide result", exact: true })
            .click();
        await page
          .getByRole("button", { name: "Reveal result", exact: true })
          .click();
        const detail = page.locator(".adder-detail");
        const total = a + b + incoming;
        await expect(detail.locator("[data-adder-input]")).toHaveText([
          String(a),
          String(b),
          String(incoming),
        ]);
        await expect(detail.locator('[data-adder-output="sum"]')).toHaveText(
          String(total % 2),
        );
        await expect(detail.locator('[data-adder-output="carry"]')).toHaveText(
          String(Math.floor(total / 2)),
        );
        await expect(detail.locator("[data-adder-total]")).toHaveText(
          total.toString(2).padStart(2, "0"),
        );
      }
});

test("the ALU reuses its full adder for ADD and SUB while keeping its other paths", async ({
  page,
}) => {
  await page.goto("./#/lesson/alu");
  await expect(page.locator(".adder-detail")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  const detail = page.locator(".adder-detail");
  await expect(detail).toHaveAttribute("data-adder-operation", "ADD");
  await expect(detail.locator("[data-adder-input]")).toHaveText([
    "1",
    "1",
    "1",
  ]);
  await expect(detail.locator(".adder-word-context code")).toHaveText([
    "0110",
    "ADD",
    "0110",
  ]);
  await expect(detail).toContainText(S.bitLab.adderResultLabel);
  await expect(detail).toContainText(S.bitLab.selectorLabel);
  await page
    .getByRole("combobox", { name: "Operation", exact: true })
    .selectOption("SUB");
  await expect(detail).toHaveCount(0);
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await expect(detail).toHaveAttribute("data-adder-operation", "SUB");
  await expect(detail.locator("[data-adder-input]")).toHaveText([
    "1",
    "0",
    "1",
  ]);
  await expect(detail.locator(".adder-word-context code")).toHaveText([
    "0000",
    "SUB",
    "0000",
  ]);
  await expect(detail).toContainText(S.bitLab.subNote);
  await expect(page.locator('[data-flag="C"] strong')).toHaveText("C = 1");
  for (const operation of ["XOR", "NOT", "LSL", "LSR", "ASR"]) {
    await page
      .getByRole("combobox", { name: "Operation", exact: true })
      .selectOption(operation);
    await page
      .getByRole("button", { name: "Reveal result", exact: true })
      .click();
    await expect(detail).toHaveCount(0);
    await expect(page.locator("[data-alu-result]")).toBeVisible();
  }
});
