jest.mock('../src/repositories/todo.repository', () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  complete: jest.fn(),
  reopen: jest.fn()
}));

const todoRepository = require('../src/repositories/todo.repository');
const todoService = require('../src/services/todo.service');

describe('TodoService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns todos from the repository', async () => {
    const todos = [{ id: '1', title: 'Write tests' }];
    todoRepository.list.mockResolvedValue(todos);

    const result = await todoService.listTodos();

    expect(result).toEqual(todos);
    expect(todoRepository.list).toHaveBeenCalled();
  });

  it('passes query to the repository list', async () => {
    todoRepository.list.mockResolvedValue([]);

    await todoService.listTodos({ q: 'ship' });

    expect(todoRepository.list).toHaveBeenCalledWith({ q: 'ship' });
  });

  it('throws a 404 error when a todo is not found', async () => {
    todoRepository.getById.mockResolvedValue(null);

    await expect(todoService.getTodoById('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('reopens a todo and returns it from the repository', async () => {
    todoRepository.reopen.mockResolvedValue({ _id: '1', completed: false, status: 'OPEN' });

    const todo = await todoService.reopenTodo('1');

    expect(todo.status).toBe('OPEN');
    expect(todoRepository.reopen).toHaveBeenCalledWith('1');
  });

  it('throws not found when reopen returns null', async () => {
    todoRepository.reopen.mockResolvedValue(null);

    await expect(todoService.reopenTodo('unknown')).rejects.toMatchObject({statusCode: 404});
  });
});
