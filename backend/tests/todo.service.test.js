jest.mock('../src/repositories/todo.repository', () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  complete: jest.fn()
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

  it('throws a 404 error when a todo is not found', async () => {
    todoRepository.getById.mockResolvedValue(null);

    await expect(todoService.getTodoById('missing')).rejects.toMatchObject({ statusCode: 404 });
  });
});
