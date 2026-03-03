const logger = require('../utils/logger');
const ResponseHandler = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return ResponseHandler.error(res, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return ResponseHandler.error(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return ResponseHandler.error(res, 'Validation Error', 400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return ResponseHandler.error(res, message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return ResponseHandler.error(res, message, 401);
  }

  return ResponseHandler.error(
    res,
    error.message || 'Server Error',
    error.statusCode || 500
  );
};

module.exports = errorHandler;
