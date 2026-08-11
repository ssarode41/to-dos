jest.mock('../../src/services/todo.service', () => ({
  listTodos: jest.fn(),
  getTodoById: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  completeTodo: jest.fn()
}));

const request = require('supertest');
const app = require('../../src/app');
const todoService = require('../../src/services/todo.service');

describe('Todo routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('elitea-todos-backend');
  });

  it('lists todos (no params) — returns plain array', async () => {
    todoService.listTodos.mockResolvedValue([{ title: 'Plan release' }]);

    const response = await request(app).get('/api/v1/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it('filters todos by q param', async () => {
    todoService.listTodos.mockResolvedValue([{ title: 'Buy milk' }]);

    const response = await request(app).get('/api/v1/todos?q=milk');

    expect(response.status).toBe(200);
    expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ q: 'milk' }));
  });

  it('filters todos by completed param', async () => {
    todoService.listTodos.mockResolvedValue([]);

    const response = await request(app).get('/api/v1/todos?completed=true');

    expect(response.status).toBe(200);
    expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ completed: 'true' }));
  });

  it('filters todos by status param', async () => {
    todoService.listTodos.mockResolvedValue([]);

    const response = await request(app).get('/api/v1/todos?status=OPEN');

    expect(response.status).toBe(200);
    expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ status: 'OPEN' }));
  });

  it('passes pagination params to service', async () => {
    todoService.listTodos.mockResolvedValue([]);

    const response = await request(app).get('/api/v1/todos?page=1&limit=2');

    expect(response.status).toBe(200);
    expect(todoService.listTodos).toHaveBeenCalledWith(
      expect.objectContaining({ page: '1', limit: '2' })
    );
  });

  it('returns { items, meta } shape when meta=true', async () => {
    const envelope = { items: [{ title: 'Task' }], meta: { total: 1, page: 1, limit: 20, pages: 1 } };
    todoService.listTodos.mockResolvedValue(envelope);

    const response = await request(app).get('/api/v1/todos?meta=true');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toMatchObject({ total: 1, page: 1, limit: 20, pages: 1 });
  });
});
