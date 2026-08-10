const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page, data) {
    this.page = page;
    this.data = data;
    this.titleInput = page.getByLabel('Todo title');
    this.descriptionInput = page.getByLabel('Todo description');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: /todo dashboard/i })).toBeVisible();
  }

  async createTodo() {
    await this.titleInput.fill(this.data.title);
    await this.descriptionInput.fill(this.data.description);
    await this.saveButton.click();
    await expect(this.page.getByText(this.data.title)).toBeVisible();
  }
}

module.exports = { TodoPage };
