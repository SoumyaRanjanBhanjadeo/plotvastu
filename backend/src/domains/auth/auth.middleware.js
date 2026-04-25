const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const ResponseHandler = require('../../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    // Check if token exists
    if (!token) {
      return ResponseHandler.error(res, 'Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return ResponseHandler.error(res, 'User not found', 404);
      }

      req.user = user;
      next();
    } catch (error) {
      return ResponseHandler.error(res, 'Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return ResponseHandler.error(res, 'Not authorized as admin', 403);
  }
  next();
};

module.exports = {
  authMiddleware,
  adminOnly,
};
