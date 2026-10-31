// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";

test("ALU selection changes both the result path and flag provenance", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/lesson/shifts");
  await page
    .getByRole("navigation", { name: "Lesson navigation" })
    .getByRole("link", { name: /ALU/ })
    .click();
  await expect(page).toHaveURL(/#\/lesson\/alu$/);
  await expect(
    page
      .getByRole("navigation", { name: "Lesson navigation" })
      .getByRole("link", { name: /signed or unsigned decision/ }),
  ).toHaveAttribute("href", "#/lesson/compare");
  const cases = [
    ["ADD", 8, "arithmetic", "1", "0", "0", "1"],
    ["SUB", 6, "arithmetic", "0", "0", "1", "0"],
    ["AND", 1, "logic", "0", "0", "—", "—"],
    ["OR", 7, "logic", "0", "0", "—", "—"],
    ["XOR", 6, "logic", "0", "0", "—", "—"],
    ["NOT", 8, "logic", "1", "0", "—", "—"],
    ["LSL", 14, "shift", "1", "0", "0", "—"],
    ["LSR", 3, "shift", "0", "0", "1", "—"],
    ["ASR", 3, "shift", "0", "0", "1", "—"],
  ] as const;
  for (const [operation, result, path, N, Z, C, V] of cases) {
    await page
      .getByRole("combobox", { name: "Operation", exact: true })
      .selectOption(operation);
    await expect(page.locator(".lab-result")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Reveal result", exact: true })
      .click();
    await expect(page.locator("[data-alu-result]")).toHaveAttribute(
      "data-alu-result",
      String(result),
    );
    await expect(
      page.locator('[data-path][data-selected="true"]'),
    ).toHaveAttribute("data-path", path);
    for (const [flag, value] of Object.entries({ N, Z, C, V }))
      await expect(page.locator(`[data-flag="${flag}"] strong`)).toHaveText(
        `${flag} = ${value}`,
      );
  }
  await page.getByRole("button", { name: /^B bit 0:/ }).click();
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await expect(page.locator("[data-alu-result]")).toHaveAttribute(
    "data-alu-result",
    "3",
  );
  await expect(page.getByText(/This operation uses A only/)).toBeVisible();
  await page.getByText("Load a case to investigate", { exact: true }).click();
  await page
    .getByRole("button", { name: "A bit shifted out", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Operation", exact: true })
    .selectOption("ASR");
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await expect(page.locator("[data-alu-result]")).toHaveAttribute(
    "data-alu-result",
    "12",
  );
  await expect(page.locator('[data-flag="C"] strong')).toHaveText("C = 1");
  await page
    .getByRole("button", { name: "Equal inputs with XOR", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await expect(page.locator('[data-flag="Z"] strong')).toHaveText("Z = 1");
  await page
    .getByRole("button", { name: "Reset experiment", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Operation", exact: true }),
  ).toHaveValue("ADD");
  await expect(page.locator(".lab-result")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await page.getByText("Inside the shared adder", { exact: true }).click();
  await expect(page.locator(".carry-diagram")).toBeVisible();
  expect(errors).toEqual([]);
});
