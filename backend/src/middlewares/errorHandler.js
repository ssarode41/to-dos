const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error('Request failed', {
    method: req.method,
    path: req.path,
    status: err.statusCode || 500,
    message: err.message
  });

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    status
  });
}

module.exports = errorHandler;
