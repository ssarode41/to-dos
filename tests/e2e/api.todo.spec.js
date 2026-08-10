const { test, expect } = require('@playwright/test');
const testData = require('../fixtures/test-data.json');

test('creates and lists a todo through the API', async ({ request }) => {
  const payload = {
    title: testData.api.title,
    description: testData.api.description,
    priority: 'MEDIUM',
    category: 'GENERAL'
  };

  const createResponse = await request.post('/api/v1/todos', { data: payload });
  expect(createResponse.ok()).toBeTruthy();

  const createdTodo = await createResponse.json();
  expect(createdTodo.title).toBe(payload.title);
  expect(createdTodo.description).toBe(payload.description);

  const listResponse = await request.get('/api/v1/todos');
  expect(listResponse.ok()).toBeTruthy();

  const todos = await listResponse.json();
  expect(Array.isArray(todos)).toBeTruthy();
  expect(todos.some((todo) => todo._id === createdTodo._id)).toBeTruthy();
});
