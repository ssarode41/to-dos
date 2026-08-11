const todoService = require('../services/todo.service');
const { listTodosQuerySchema } = require('../validators/todo.validator');
const logger = require('../config/logger');

async function listTodos(req, res, next) {
  try {
    const { error: validationError, value: query } = listTodosQuerySchema.validate(req.query, { abortEarly: false });
    if (validationError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: validationError.details.map((d) => d.message) });
    }

    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const params = { ...query, page, limit };

    const { data, total } = await todoService.listTodos(params);
    const pages = Math.ceil(total / limit);

    logger.info('Listed todos', { total, page, limit });
    res.json({ data, pagination: { total, page, limit, pages } });
  } catch (error) {
    next(error);
  }
}

async function getTodo(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

async function createTodo(req, res, next) {
  try {
    logger.info('Creating todo', { body: req.body });
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

async function updateTodo(req, res, next) {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

async function deleteTodo(req, res, next) {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function completeTodo(req, res, next) {
  try {
    const todo = await todoService.completeTodo(req.params.id);
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

async function reopenTodo(req, res, next) {
  try {
    const todo = await todoService.reopenTodo(req.params.id);
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  reopenTodo
};
