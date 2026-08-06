const todoService = require('../services/todo.service');
const logger = require('../config/logger');

async function listTodos(req, res, next) {
  try {
    const todos = await todoService.listTodos();
    res.json(todos);
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

module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo
};
