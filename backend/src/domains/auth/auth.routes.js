const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const { authMiddleware, adminOnly } = require('./auth.middleware');
const validate = require('../../middleware/validate');
const { loginLimiter } = require('../../middleware/rateLimiters');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const createUserValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('role').optional().isIn(['admin']).withMessage('Role must be admin'),
];

const updateProfileValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Routes
// Apply loginLimiter specifically to the login route (5 attempts per 15 min per IP)
router.post('/login', loginLimiter, loginValidation, validate, authController.login);

// Create user — admin only (was previously an open /register route — SECURITY FIX)
router.post(
  '/create-user',
  authMiddleware,
  adminOnly,
  createUserValidation,
  validate,
  authController.createUser
);

router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.put('/profile', authMiddleware, updateProfileValidation, validate, authController.updateProfile);
router.put('/change-password', authMiddleware, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
