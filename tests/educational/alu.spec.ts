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
    ["ADD", 6, "arithmetic", "0", "0", "0", "0"],
    ["SUB", 0, "arithmetic", "0", "1", "1", "0"],
    ["AND", 3, "logic", "0", "0", "—", "—"],
    ["OR", 3, "logic", "0", "0", "—", "—"],
    ["XOR", 0, "logic", "0", "1", "—", "—"],
    ["NOT", 12, "logic", "1", "0", "—", "—"],
    ["LSL", 6, "shift", "0", "0", "0", "—"],
    ["LSR", 1, "shift", "0", "0", "1", "—"],
    ["ASR", 1, "shift", "0", "0", "1", "—"],
  ] as const;
  const circuit = page.locator(".connected-circuit");
  await expect(circuit).toHaveAttribute("data-revealed", "false");
  await expect(circuit.locator("[data-carry-index][data-value]")).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("img", { name: "Result bit 3: hidden" }),
  ).toBeVisible();
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
    await expect(circuit).toHaveAttribute("data-path", path);
    await expect(circuit.locator('[data-circuit-flag="Z"]')).toHaveText(
      `Z=${Z}`,
    );
    await expect(circuit.locator('[data-circuit-flag="N"]')).toHaveText(
      `N=${N}`,
    );
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
    "1",
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
  for (const [index, value] of [0, 1, 1, 0, 0].entries())
    await expect(
      circuit.locator(`[data-carry-index="${index}"]`),
    ).toHaveAttribute("data-value", String(value));
  await expect(
    circuit.locator('[data-flag-gate="V"] [data-gate="XOR"]'),
  ).toBeVisible();
  await expect(circuit.locator('[data-flag-gate="Z"]')).toBeVisible();
  await expect(page.locator("[data-alu-result] td")).toHaveText([
    "0110",
    "0x6",
    "6",
    "6",
  ]);
  await page.getByText("Operation selection overview", { exact: true }).click();
  await expect(page.locator(".alu-diagram")).toBeVisible();
  await expect(page.locator(".adder-detail")).toBeVisible();
  await expect(
    page.locator('[data-selected-adder-bit="1"] [data-adder-output]'),
  ).toHaveText(["1", "1"]);
  await page
    .getByRole("button", { name: "Signed overflow", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reveal result", exact: true })
    .click();
  await expect(page.locator('[data-flag="V"] strong')).toHaveText("V = 1");
  await expect(page.locator("[data-alu-result]")).toHaveAttribute(
    "data-alu-result",
    "8",
  );
  for (const [index, value] of [0, 1, 1, 1, 0].entries())
    await expect(
      circuit.locator(`[data-carry-index="${index}"]`),
    ).toHaveAttribute("data-value", String(value));
  const input = page.getByRole("button", { name: "A bit 0: 1", exact: true });
  await input.focus();
  await input.press("Space");
  await expect(
    page.getByRole("button", { name: "A bit 0: 0", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(circuit).toHaveAttribute("data-revealed", "false");
  await page
    .getByRole("button", { name: "A bit 0: 0", exact: true })
    .press("Enter");
  await expect(
    page.getByRole("button", { name: "A bit 0: 1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".connected-circuit-scroll")
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  expect(errors).toEqual([]);
});
