const request = require('supertest');
const app = require('../../src/app');
const todoRepository = require('../../src/repositories/todo.repository');

describe('Todo list (query params) - integration', () => {
  beforeEach(async () => {
    todoRepository.fallbackTodos = [];
    todoRepository.fallbackId = 1;


    await todoRepository.create({
      title: 'Buy Milk',
      description: 'grocery',
      completed: false,
      priority: 'HIGH',
      category: 'HOME'
    });

    await todoRepository.create({
      title: 'Ship release',
      description: 'release notes',
      completed: true,
      priority: 'LOW',
      category: 'WORK'
    });

    await todoRepository.create({
      title: 'Call doctor',
      description: 'annual check-up',
      completed: false,
      priority: 'HIGH',
      category: 'HEALTH'
    });
  });

  it('filters by q (case-insensitive substring on title)', async () => {
    const response = await request(app).get('/api/v1/todos?q=ship');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Ship release');
  });

  it('filters by completed=true', async () => {
    const response = await request(app).get('/api/v1/todos?completed=true');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].completed).toBe(true);
  });

  it('filters by combined priority and category', async () => {
    const response = await request(app).get('/api/v1/todos?priority=HIGH&category=HOME');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Buy Milk');
  });

  it('returns paginated shape when page/limit provided', async () => {
    const response = await request(app).get('/api/v1/todos?page=1&limit=2');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ page: 1, limit: 2, total: 3 });
    expect(response.body.items).toHaveLength(2);
  });
});
