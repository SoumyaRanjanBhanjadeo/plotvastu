const express = require('express');
const { body } = require('express-validator');
const contactController = require('./contact.controller');
const { publicFormLimiter } = require('../../middleware/rateLimiters');

const router = express.Router();

router.post(
  '/',
  publicFormLimiter,
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
  ],
  contactController.sendContactEmail
);

module.exports = router;
