const Joi = require('joi');

const todoQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).optional(),
  completed: Joi.boolean().optional(),
  status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'DONE').optional(),
  category: Joi.string().trim().optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional()
}).unknown(false);

module.exports = { todoQuerySchema };
