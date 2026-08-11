const Joi = require('joi');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const { error } = schema.validate(data, { abortEarly: false, convert: true });
    if (error) {
      return res
        .status(400)
        .json({ message: 'Validation failed', details: error.details.map((detail) => detail.message) });
    }
    return next();
  };
}

module.exports = validate;
