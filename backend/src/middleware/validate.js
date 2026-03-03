const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    return ResponseHandler.error(res, 'Validation Error', 400, messages);
  }
  next();
};

module.exports = validate;
