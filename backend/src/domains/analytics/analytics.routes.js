const express = require('express');
const analyticsController = require('./analytics.controller');
const { authMiddleware, adminOnly } = require('../auth/auth.middleware');

const router = express.Router();

// All analytics routes require admin authentication
router.use(authMiddleware, adminOnly);

// Get dashboard overview
router.get('/dashboard', analyticsController.getDashboardStats);

// Get property analytics
router.get('/properties', analyticsController.getPropertyAnalytics);

// Get leads analytics
router.get('/leads', analyticsController.getLeadAnalytics);

module.exports = router;
