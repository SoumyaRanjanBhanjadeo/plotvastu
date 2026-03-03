const express = require('express');
const { body } = require('express-validator');
const propertyController = require('./property.controller');
const { authMiddleware, adminOnly } = require('../auth/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/stats', authMiddleware, adminOnly, propertyController.getPropertyStats);
router.get('/:id', propertyController.getProperty);

// Admin routes
router.get('/admin/all', authMiddleware, adminOnly, propertyController.getAllPropertiesAdmin);

router.post(
  '/',
  authMiddleware,
  adminOnly,
  [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('description').notEmpty().trim().withMessage('Description is required'),
    body('type').isIn(['plot', 'residential', 'commercial', 'apartment', 'villa']).withMessage('Invalid property type'),
    body('price.amount').isNumeric().withMessage('Price must be a number'),
    body('area.value').isNumeric().withMessage('Area must be a number'),
    body('location.address').notEmpty().withMessage('Address is required'),
    body('location.city').notEmpty().withMessage('City is required'),
    body('location.coordinates.lat').isNumeric().withMessage('Valid latitude is required'),
    body('location.coordinates.lng').isNumeric().withMessage('Valid longitude is required'),
  ],
  propertyController.createProperty
);

router.put('/:id', authMiddleware, adminOnly, propertyController.updateProperty);
router.delete('/:id', authMiddleware, adminOnly, propertyController.deleteProperty);
router.patch('/:id/featured', authMiddleware, adminOnly, propertyController.toggleFeatured);

module.exports = router;
