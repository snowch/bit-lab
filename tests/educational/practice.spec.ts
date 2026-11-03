// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";

test("calculator exercises start collapsed and preserve choices and ticks", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./calculator/");
  const content = page.locator("#excontent");
  const toggle = page.locator("#exToggle");
  await expect(content).toBeHidden();
  await expect(toggle).toHaveText("Show exercises");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".ex")).toHaveCount(110);
  await toggle.focus();
  await toggle.press("Enter");
  await expect(content).toBeVisible();
  await page.reload();
  await expect(content).toBeVisible();
  await page.locator(".exgroup > summary").first().click();
  const first = page.locator(".ex").first();
  await first.getByRole("button", { name: /load FF/ }).click();
  await expect(page.locator('#widthSeg [data-w="8"]')).toHaveClass("on");
  await first.locator(".exans summary").click();
  await expect(first.locator(".exans div")).toContainText("255");
  await first.getByRole("checkbox", { name: "done", exact: true }).check();
  await expect(first).toBeHidden();
  await toggle.click();
  await page.reload();
  await expect(content).toBeHidden();
  await expect(first.locator("input")).toBeChecked();

  // A direct bank link opens the bank without replacing the saved hidden preference.
  await page.goto("./calculator/#exh");
  await expect(content).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("bit-lab:legacy:pc-exercises-hidden"),
    ),
  ).toBe("1");
  await page.getByRole("button", { name: "show 1 done", exact: true }).click();
  await page.locator(".exgroup > summary").first().click();
  await expect(first.locator("input")).toBeChecked();
  await expect(first).toBeVisible();
  await toggle.click();
  await expect(content).toBeHidden();
  await page.evaluate(() => {
    location.hash = "";
  });
  await page.evaluate(() => {
    location.hash = "exh";
  });
  await expect(content).toBeVisible();
  await page.goto("./calculator/");
  await expect(content).toBeHidden();
  expect(errors).toEqual([]);
});

test("final lesson hands learners to the bank and keeps its study mark separate", async ({
  page,
}) => {
  await page.goto("./#/lesson/memory");
  await page
    .getByRole("navigation", { name: "Lesson navigation" })
    .getByRole("link", { name: /Put it into practice/ })
    .click();
  await expect(page).toHaveURL(/#\/lesson\/put-it-into-practice$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Put it into practice",
  );
  await expect(
    page.getByText("Lesson 11 of 11", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".challenge")).toHaveCount(0);
  await page
    .getByRole("checkbox", { name: "Mark lesson as done", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Mark lesson as done", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("link", { name: "Open the calculator", exact: true })
    .click();
  await expect(page.locator("#excontent")).toBeHidden();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("bit-lab:legacy:pc-done") ?? "{}"),
    ),
  ).toEqual({});
  await page
    .getByRole("button", { name: "Show exercises", exact: true })
    .click();
  await expect(page.locator("#excontent")).toBeVisible();
  await page.goto("./");
  await expect(page.getByText("1 / 11 done", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Practice", exact: true }).click();
  await expect(page.locator(".chapter-list li")).toHaveCount(10);
  await page.getByRole("link", { name: /Calculator exercise bank/ }).click();
  await expect(page.locator("#excontent")).toBeVisible();
});
