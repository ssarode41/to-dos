const Joi = require('joi');

const createTodoSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'DONE').optional(),
  category: Joi.string().optional(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().optional(),
  createdBy: Joi.string().optional()
});

const updateTodoSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'DONE').optional(),
  category: Joi.string().optional(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().optional(),
  createdBy: Joi.string().optional()
});

const ALLOWED_SORT_FIELDS = ['createdDate', 'updatedDate', 'dueDate', 'title', 'priority'];

const listTodosQuerySchema = Joi.object({
  status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'DONE').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  category: Joi.string().optional(),
  q: Joi.string().max(200).optional(),
  sortBy: Joi.string().valid(...ALLOWED_SORT_FIELDS).optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

module.exports = { createTodoSchema, updateTodoSchema, listTodosQuerySchema };
