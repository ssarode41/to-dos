const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pageObjects/todoPage');
const testData = require('../fixtures/test-data.json');

test('creates a todo from the dashboard UI', async ({ page }) => {
  const todoPage = new TodoPage(page, testData.ui);

  await todoPage.goto();
  await todoPage.createTodo();

  await expect(page.getByText(testData.ui.description)).toBeVisible();
});
