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

  it('lists todos', async () => {
    todoService.listTodos.mockResolvedValue([{ title: 'Plan release' }]);

    const response = await request(app).get('/api/v1/todos');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
