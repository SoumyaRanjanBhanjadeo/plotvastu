const express = require('express');
const { body } = require('express-validator');
const inquiryController = require('./inquiry.controller');
const { authMiddleware, adminOnly } = require('../auth/auth.middleware');
const { publicFormLimiter } = require('../../middleware/rateLimiters');

const router = express.Router();

// Public routes — rate limited to prevent spam (10 per hour per IP)
router.post(
  '/',
  publicFormLimiter,
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().trim().withMessage('Phone number is required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
    body('type').optional().isIn(['inquiry', 'site_visit', 'callback']).withMessage('Invalid inquiry type'),
  ],
  inquiryController.createInquiry
);

// Admin routes
router.get('/stream', authMiddleware, adminOnly, inquiryController.streamInquiries);
router.get('/', authMiddleware, adminOnly, inquiryController.getInquiries);
router.get('/stats', authMiddleware, adminOnly, inquiryController.getInquiryStats);
router.get('/recent', authMiddleware, adminOnly, inquiryController.getRecentInquiries);
router.get('/:id', authMiddleware, adminOnly, inquiryController.getInquiry);
router.put('/:id', authMiddleware, adminOnly, inquiryController.updateInquiry);
router.delete('/:id', authMiddleware, adminOnly, inquiryController.deleteInquiry);

module.exports = router;
