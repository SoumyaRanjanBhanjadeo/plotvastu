const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const { authMiddleware, adminOnly } = require('./auth.middleware');
const validate = require('../../middleware/validate');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const createUserValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('role').optional().isIn(['admin']).withMessage('Role must be admin'),
];

const updateProfileValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Routes
router.post('/login', loginValidation, validate, authController.login);
router.post('/register', createUserValidation, validate, authController.register);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.put('/profile', authMiddleware, updateProfileValidation, validate, authController.updateProfile);
router.put('/change-password', authMiddleware, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
