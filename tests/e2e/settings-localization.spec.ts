import { expect, test, type Page } from "@playwright/test";

const DEFAULT_SETTINGS = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  company: "Company Inc.",
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  language: "en",
  currency: "USD",
  theme: "system",
};

async function selectByIndex(page: Page, fieldIndex: number, optionIndex: number) {
  await page.getByRole("combobox").nth(fieldIndex).click();
  await page.getByRole("option").nth(optionIndex).click();
}

test.beforeEach(async ({ request }) => {
  await request.put("/api/settings", {
    data: DEFAULT_SETTINGS,
  });
});

test("applies selected language to UI sections", async ({ page }) => {
  await page.goto("/settings");
  await selectByIndex(page, 0, 0);
  await page.locator('button[form="settings-form"]').click();

  await expect(page.locator("h1").first()).not.toHaveText("Settings");

  await page.goto("/users");
  await expect(page.locator("h1").first()).not.toHaveText("Users");
});

test("applies selected currency to product prices", async ({ page }) => {
  await page.goto("/settings");
  await selectByIndex(page, 1, 2);
  await page.locator('button[form="settings-form"]').click();

  await page.goto("/products");
  const priceCell = page.locator("tbody tr").first().locator("td").nth(3);
  await expect(priceCell).toContainText(/RUB|₽/);
});
