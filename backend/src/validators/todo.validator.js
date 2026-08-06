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

module.exports = { createTodoSchema, updateTodoSchema };
