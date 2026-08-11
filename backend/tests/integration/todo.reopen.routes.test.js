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

describe('REOPEN todo route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 200 and reopens a todo', async () => {
    todoService.reopenTodo.mockResolvedValue({ _id: '1', completed: false, status: 'OPEN' });
    const response = await request(app).patch('/api/v1/todos/1/reopen');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OPEN');
  });

  it('returns 404 when todo does not exist', async () => {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    todoService.reopenTodo.mockRejectedValue(error);
    const response = await request(app).patch('/api/v1/todos/missing/reopen');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Todo not found');
  });
});
