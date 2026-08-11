const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page, data) {
    this.page = page;
    this.data = data;
    this.titleInput = page.getByLabel('Todo title');
    this.descriptionInput = page.getByLabel('Todo description');
    this.prioritySelect = page.getByLabel('Todo priority');
    this.categorySelect = page.getByLabel('Todo category');
    this.dueDateInput = page.getByLabel('Todo due date');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: /todo dashboard/i })).toBeVisible();
  }

  async createTodo() {
    await this.titleInput.fill(this.data.title);
    await this.descriptionInput.fill(this.data.description);

    if (this.data.priority) {
      await this.prioritySelect.selectOption(this.data.priority);
    }

    if (this.data.category) {
      await this.categorySelect.selectOption(this.data.category);
    }

    if (this.data.dueDate) {
      await this.dueDateInput.fill(this.data.dueDate);
    }

    await this.saveButton.click();
    await expect(this.page.getByText(this.data.title)).toBeVisible();
  }

  async startEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
  }

  async cancelEdit() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async saveEdit(updated) {
    await this.titleInput.fill(updated.title);
    await this.descriptionInput.fill(updated.description);

    if (updated.priority) {
      await this.prioritySelect.selectOption(updated.priority);
    }

    if (updated.category) {
      await this.categorySelect.selectOption(updated.category);
    }

    if (updated.dueDate) {
      await this.dueDateInput.fill(updated.dueDate);
    }

    await this.saveButton.click();
    await expect(this.page.getByText(updated.title)).toBeVisible();
  }
}

module.exports = { TodoPage };
