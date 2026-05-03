const rateLimit = require('express-rate-limit');

/**
 * Helper to skip rate limiting in development
 */
const skipInDevelopment = (req) => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Strict rate limiter for login endpoint.
 * Max 5 attempts per 15 minutes per IP to prevent brute-force attacks.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
  skip: skipInDevelopment,
});

/**
 * Rate limiter for public forms (e.g. inquiry submission).
 * Max 10 submissions per hour per IP.
 */
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many submissions from this IP. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
});

/**
 * General API rate limiter.
 * Max 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDevelopment,
});

module.exports = { loginLimiter, publicFormLimiter, generalLimiter };
