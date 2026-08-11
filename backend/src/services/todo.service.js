const todoRepository = require('../repositories/todo.repository');
const logger = require('../config/logger');
const { buildFilterFromQuery, parseSort } = require('../utils/todoQuery');

class TodoService {
  async listTodos(query = {}) {
    const filter = buildFilterFromQuery(query);
    const sort = parseSort(query.sort);

    logger.info('Listing todos', { query, sort });
    return todoRepository.list({ filter, sort });
  }

  async getTodoById(id) {
    const todo = await todoRepository.getById(id);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  async createTodo(payload) {
    return todoRepository.create(payload);
  }

  async updateTodo(id, payload) {
    const todo = await todoRepository.update(id, payload);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  async deleteTodo(id) {
    const todo = await todoRepository.delete(id);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  async completeTodo(id) {
    const todo = await todoRepository.complete(id);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }
}

module.exports = new TodoService();
