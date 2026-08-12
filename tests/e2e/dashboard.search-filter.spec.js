const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pageObjects/dashboardPage');
const testData = require('../fixtures/test-data.json');

test('SCRUM-487: Da shboard renders heading', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.heading).toBeVisible();
});

test('SCRUM-487: da shboard allows filter selection', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.filterBu(testData.dashboard.filter.done);
  await expect(dashboard.filterSelect).toHaveValue(testData.dashboard.filter.done);
});
