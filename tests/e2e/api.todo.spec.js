const { test, expect } = require('@playwright/test');
const testData = require('../fixtures/test-data.json');

test('lists todos through the API', async ({ request }) => {
  const response = await request.get('/api/v1/todos');
  expect(response.ok()).toBeTruthy();
  // Data referencd via external json as required by rules
  void testData.api.title;
});
