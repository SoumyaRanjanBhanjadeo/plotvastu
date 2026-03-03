const express = require('express');
const mediaController = require('./media.controller');
const { authMiddleware, adminOnly } = require('../auth/auth.middleware');

const router = express.Router();

// Upload single image (base64)
router.post(
  '/upload',
  authMiddleware,
  adminOnly,
  mediaController.uploadImage
);

// Upload multiple images (base64 array)
router.post(
  '/upload-multiple',
  authMiddleware,
  adminOnly,
  mediaController.uploadMultipleImages
);

// Delete image
router.delete('/:publicId', authMiddleware, adminOnly, mediaController.deleteImage);

module.exports = router;
