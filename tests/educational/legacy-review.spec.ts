// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";

test("calculator keyboard supports mode selection, signed remainder and clearing an error", async ({
  page,
}) => {
  await page.goto("./calculator/");
  const hex = page.locator('.baserow[data-base="16"]');
  const dec = page.locator('.baserow[data-base="10"]');
  const signed = page.getByRole("button", { name: "signed", exact: true });
  const unsigned = page.getByRole("button", { name: "unsigned", exact: true });

  const eightBits = page.locator('#widthSeg [data-w="8"]');
  await eightBits.press("Enter");
  await expect(eightBits).toHaveAttribute("aria-pressed", "true");
  await signed.press("Enter");
  await expect(signed).toHaveAttribute("aria-pressed", "true");
  await hex.press("Enter");
  await expect(hex).toHaveAttribute("aria-pressed", "true");

  await page.locator("#rows").focus();
  for (const key of ["f", "9", "%", "3", "Enter"]) {
    await page.keyboard.press(key);
  }
  await expect(dec.locator(".val")).toHaveText("-1");
  await expect(hex.locator(".val")).toHaveText("FF");

  await unsigned.press("Enter");
  await page.locator("#rows").focus();
  for (const key of ["f", "9", "%", "3", "Enter"]) {
    await page.keyboard.press(key);
  }
  await expect(dec.locator(".val")).toHaveText("0");

  await dec.press("Enter");
  await page.locator("#rows").focus();
  for (const key of ["1", "/", "0", "Enter"]) {
    await page.keyboard.press(key);
  }
  await expect(page.locator("#pending")).toHaveText("error: ÷ 0 — press AC");
  await page.keyboard.press("Escape");
  await expect(page.locator("#pending")).toBeEmpty();
  await expect(dec.locator(".val")).toHaveText("0");

  await hex.press("Enter");
  for (const [width, expected] of [
    [8, "0"],
    [16, "FF00"],
    [32, "FF00"],
  ] as const) {
    await page.locator(`#widthSeg [data-w="${width}"]`).press("Enter");
    await page.locator("#rows").focus();
    for (const key of ["Escape", "f", "f", "<", "8", "Enter"]) {
      await page.keyboard.press(key);
    }
    await expect(hex.locator(".val")).toHaveText(expected);
  }
});

test("readings drill checks the visible step and retains bit focus", async ({
  page,
}) => {
  await page.goto("./calculator/docs/readings-drills.html");
  const drill = page.locator("#d2");
  const prompt = await drill.locator(".prompt").innerText();
  const match = /(-?\d+)\s+\(signed, (\d+) bits\)/.exec(prompt);
  expect(match).not.toBeNull();
  const value = Number(match![1]);
  const width = Number(match![2]);
  const want = value < 0 ? value + 2 ** width : value;
  const input = drill.locator(".uin");
  await input.fill("oops");
  await input.press("Enter");
  await expect(drill.locator(".stage1fb")).toContainText(
    "Enter a whole number in decimal",
  );
  await expect(drill.locator(".stage2")).toBeHidden();
  await input.fill(String(want));
  await input.press("Enter");
  await expect(drill.locator(".stage2")).toBeVisible();
  await expect(drill.locator(".feedback")).toBeEmpty();

  for (const cell of await drill.locator(".cells [data-i]").all()) {
    const index = Number(await cell.getAttribute("data-i"));
    if ((want & (1 << index)) === 0) continue;
    await cell.press("Enter");
    await expect(cell).toBeFocused();
    await expect(cell).toHaveText("1");
  }
  await drill.getByRole("button", { name: "Check the bits" }).press("Enter");
  await expect(drill.locator(".feedback")).toContainText(
    want.toString(2).padStart(width, "0"),
  );
});

test("guided AND example isolates a column and shows when it can change", async ({
  page,
}) => {
  await page.goto("./calculator/docs/bit-lab.html#exercises");
  await page.getByRole("button", { name: "Load AND 0xAA, 0x0F" }).click();
  const result = page.locator("#values tr.r");
  await expect(result).toContainText(/0x0A/i);
  const highBit = page.getByRole("switch", { name: /^A bit 7/ });
  await highBit.press("Enter");
  await expect(highBit).toBeFocused();
  await expect(result).toContainText(/0x0A/i);
  await page.getByRole("switch", { name: /^A bit 0/ }).click();
  await expect(result).toContainText(/0x0B/i);
});
