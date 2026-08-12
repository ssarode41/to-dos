class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /todo dashboard/i });
    this.searchInput = page.getByLabel('Search todos');
    this.filterSelect = page.getByLabel('Filter todos');
    this.loadingText = page.getByText('Loading...');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async filterBu(value) {
    await this.filterSelect.selectOption(value);
  }
}

module.exports = { DashboardPage };
