const todoService = require('../services/todo.service');
const logger = require('../config/logger');

function parseBoolean(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
}

function parseNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return undefined;
  return number;
}

async function listTodos(req, res, next) {
  try {
    const { q, completed, priority, category, page, limit } = req.query;

    const parsedCompleted = parseBoolean(completed);
    const parsedPage = parseNumber(page);
    const parsedLimit = parseNumber(limit);

    const query = {
      q: q ? String(q): undefined,
      completed: parsedCompleted,
      priority: priority ? String(priority): undefined,
      category: category ? String(category) : undefined,
      page: parsedPage,
      limit: parsedLimit
    };

    logger.debug('Listing todos', { query: res.query });
    const todos = await todoService.listTodos(query);
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

[sync function getTodo(req, res, next) {
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

module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo
};
