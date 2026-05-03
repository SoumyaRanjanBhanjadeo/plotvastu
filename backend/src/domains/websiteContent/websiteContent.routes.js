const express = require('express');
const websiteContentController = require('./websiteContent.controller');
const { authMiddleware, adminOnly } = require('../auth/auth.middleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/hero', websiteContentController.getHeroContent);
router.get('/testimonials', websiteContentController.getTestimonials);
router.get('/footer', websiteContentController.getFooterContent);
router.get('/settings', websiteContentController.getSiteSettings);

// Admin routes (authentication and admin role required)
router.get('/admin/all', authMiddleware, adminOnly, websiteContentController.getAllContent);
router.put('/admin/hero', authMiddleware, adminOnly, websiteContentController.updateHeroContent);
router.put('/admin/testimonials', authMiddleware, adminOnly, websiteContentController.updateTestimonials);
router.put('/admin/footer', authMiddleware, adminOnly, websiteContentController.updateFooterContent);
router.put('/admin/settings', authMiddleware, adminOnly, websiteContentController.updateSiteSettings);

module.exports = router;
