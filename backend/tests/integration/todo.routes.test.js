const request = require('supertest');
const app = require('../../src/app');
const todoRepository = require('../../src/repositories/todo.repository');

beforeEach(() => {
  todoRepository._reset();
});

describe('GET /health', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('elitea-todos-backend');
  });
});

describe('GET /api/v1/todos – filtering and search', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/todos').send({ title: 'Buy groceries', priority: 'LOW', category: 'PERSONAL' });
    await request(app).post('/api/v1/todos').send({ title: 'Fix critical bug', priority: 'HIGH', category: 'WORK' });
    await request(app).post('/api/v1/todos').send({ title: 'Write tests', priority: 'MEDIUM', category: 'WORK' });
    await request(app).post('/api/v1/todos').send({ title: 'Read book', priority: 'LOW', category: 'PERSONAL' });
  });

  it('returns all todos when no filters applied', async () => {
    const response = await request(app).get('/api/v1/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(4);
  });

  it('filters by q – case-insensitive title contains', async () => {
    const response = await request(app).get('/api/v1/todos?q=BUG');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Fix critical bug');
  });

  it('filters by priority', async () => {
    const response = await request(app).get('/api/v1/todos?priority=LOW');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((t) => t.priority === 'LOW')).toBe(true);
  });

  it('filters by category', async () => {
    const response = await request(app).get('/api/v1/todos?category=WORK');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((t) => t.category === 'WORK')).toBe(true);
  });

  it('filters by combined priority and category (AND semantics)', async () => {
    const response = await request(app).get('/api/v1/todos?priority=HIGH&category=WORK');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Fix critical bug');
  });

  it('filters by completed=false', async () => {
    const createRes = await request(app).post('/api/v1/todos').send({ title: 'Done task' });
    await request(app).patch(`/api/v1/todos/${createRes.body._id}/complete`);

    const response = await request(app).get('/api/v1/todos?completed=false');

    expect(response.status).toBe(200);
    expect(response.body.every((t) => t.completed === false)).toBe(true);
  });

  it('filters by completed=true', async () => {
    const createRes = await request(app).post('/api/v1/todos').send({ title: 'Done task' });
    await request(app).patch(`/api/v1/todos/${createRes.body._id}/complete`);

    const response = await request(app).get('/api/v1/todos?completed=true');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].completed).toBe(true);
  });

  it('returns empty array when no todos match filter', async () => {
    const response = await request(app).get('/api/v1/todos?q=nonexistent');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('GET /api/v1/todos – pagination', () => {
  beforeEach(async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app).post('/api/v1/todos').send({ title: `Todo ${i}` });
    }
  });

  it('returns array when no pagination params', async () => {
    const response = await request(app).get('/api/v1/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(5);
  });

  it('returns pagination object when page and limit provided', async () => {
    const response = await request(app).get('/api/v1/todos?page=0&limit=2');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(false);
    expect(response.body).toMatchObject({ page: 0, limit: 2, total: 5 });
    expect(response.body.items).toHaveLength(2);
  });

  it('returns correct items for page 1', async () => {
    const page0 = await request(app).get('/api/v1/todos?page=0&limit=2');
    const page1 = await request(app).get('/api/v1/todos?page=1&limit=2');

    const page0Ids = page0.body.items.map((t) => t._id);
    const page1Ids = page1.body.items.map((t) => t._id);
    expect(page0Ids.every((id) => !page1Ids.includes(id))).toBe(true);
  });

  it('last page has remaining items', async () => {
    const response = await request(app).get('/api/v1/todos?page=2&limit=2');

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.total).toBe(5);
  });

  it('returns correct total when combined with filter', async () => {
    await request(app).post('/api/v1/todos').send({ title: 'High priority', priority: 'HIGH' });

    const response = await request(app).get('/api/v1/todos?priority=HIGH&page=0&limit=10');

    expect(response.body.total).toBe(1);
    expect(response.body.items).toHaveLength(1);
  });
});
