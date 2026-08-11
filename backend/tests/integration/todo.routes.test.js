jest.mock('../../src/services/todo.service', () => ({
  listTodos: jest.fn(),
  getTodoById: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  completeTodo: jest.fn(),
  reopenTodo: jest.fn()
}));

const request = require('supertest');
const app = require('../../src/app');
const todoService = require('../../src/services/todo.service');

const makeTodo = (overrides = {}) => ({
  _id: 'abc123',
  title: 'Plan release',
  description: '',
  priority: 'MEDIUM',
  status: 'OPEN',
  category: 'GENERAL',
  completed: false,
  createdDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  ...overrides
});

describe('Todo routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.service).toBe('elitea-todos-backend');
  });

  describe('GET /api/v1/todos', () => {
    it('returns paginated response with default params', async () => {
      todoService.listTodos.mockResolvedValue({ data: [makeTodo()], total: 1 });

      const response = await request(app).get('/api/v1/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toMatchObject({ total: 1, page: 1, limit: 20, pages: 1 });
      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 20 }));
    });

    it('passes status filter to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      const response = await request(app).get('/api/v1/todos?status=OPEN');

      expect(response.status).toBe(200);
      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ status: 'OPEN' }));
    });

    it('passes priority filter to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      await request(app).get('/api/v1/todos?priority=HIGH');

      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ priority: 'HIGH' }));
    });

    it('passes category filter to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      await request(app).get('/api/v1/todos?category=WORK');

      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ category: 'WORK' }));
    });

    it('passes search query to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      await request(app).get('/api/v1/todos?q=release');

      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ q: 'release' }));
    });

    it('passes sortBy and sortOrder to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      await request(app).get('/api/v1/todos?sortBy=title&sortOrder=asc');

      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'title', sortOrder: 'asc' }));
    });

    it('passes page and limit to service', async () => {
      todoService.listTodos.mockResolvedValue({ data: [], total: 0 });

      await request(app).get('/api/v1/todos?page=2&limit=5');

      expect(todoService.listTodos).toHaveBeenCalledWith(expect.objectContaining({ page: 2, limit: 5 }));
    });

    it('calculates correct pages in pagination', async () => {
      todoService.listTodos.mockResolvedValue({ data: Array(5).fill(makeTodo()), total: 23 });

      const response = await request(app).get('/api/v1/todos?page=2&limit=5');

      expect(response.body.pagination).toMatchObject({ total: 23, page: 2, limit: 5, pages: 5 });
    });

    it('returns 400 for invalid status value', async () => {
      const response = await request(app).get('/api/v1/todos?status=INVALID');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid query parameters');
    });

    it('returns 400 for invalid priority value', async () => {
      const response = await request(app).get('/api/v1/todos?priority=CRITICAL');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid query parameters');
    });

    it('returns 400 for invalid sortBy value', async () => {
      const response = await request(app).get('/api/v1/todos?sortBy=hacked');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid query parameters');
    });

    it('returns 400 for limit above 100', async () => {
      const response = await request(app).get('/api/v1/todos?limit=101');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/todos/:id/reopen', () => {
    it('reopens a completed todo', async () => {
      const reopened = makeTodo({ completed: false, status: 'OPEN' });
      todoService.reopenTodo.mockResolvedValue(reopened);

      const response = await request(app).patch('/api/v1/todos/abc123/reopen');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OPEN');
      expect(response.body.completed).toBe(false);
    });

    it('returns 404 when todo not found', async () => {
      const err = new Error('Todo not found');
      err.statusCode = 404;
      todoService.reopenTodo.mockRejectedValue(err);

      const response = await request(app).patch('/api/v1/todos/notfound/reopen');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/todos', () => {
    it('creates a todo', async () => {
      const todo = makeTodo({ title: 'New task' });
      todoService.createTodo.mockResolvedValue(todo);

      const response = await request(app).post('/api/v1/todos').send({ title: 'New task' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New task');
    });

    it('returns 400 when title is missing', async () => {
      const response = await request(app).post('/api/v1/todos').send({ description: 'No title' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/todos/:id', () => {
    it('updates a todo', async () => {
      const updated = makeTodo({ title: 'Updated', priority: 'HIGH' });
      todoService.updateTodo.mockResolvedValue(updated);

      const response = await request(app).put('/api/v1/todos/abc123').send({ title: 'Updated', priority: 'HIGH' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
    });
  });

  describe('PATCH /api/v1/todos/:id/complete', () => {
    it('marks a todo complete', async () => {
      const done = makeTodo({ completed: true, status: 'DONE' });
      todoService.completeTodo.mockResolvedValue(done);

      const response = await request(app).patch('/api/v1/todos/abc123/complete');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });
  });

  describe('DELETE /api/v1/todos/:id', () => {
    it('deletes a todo', async () => {
      todoService.deleteTodo.mockResolvedValue(makeTodo());

      const response = await request(app).delete('/api/v1/todos/abc123');

      expect(response.status).toBe(204);
    });
  });
});
