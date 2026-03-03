const { cloudinary, uploadImage, uploadMultipleImages } = require('../../config/cloudStorage');
const ResponseHandler = require('../../utils/response');

class MediaController {
  // Upload single image (base64)
  async uploadImage(req, res, next) {
    try {
      const { image } = req.body;

      if (!image) {
        return ResponseHandler.error(res, 'No image provided', 400);
      }

      // Upload base64 image to Cloudinary
      const result = await uploadImage(image);

      return ResponseHandler.success(res, result, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  // Upload multiple images (base64 array)
  async uploadMultipleImages(req, res, next) {
    try {
      const { images } = req.body;

      if (!images || !Array.isArray(images) || images.length === 0) {
        return ResponseHandler.error(res, 'No images provided', 400);
      }

      // Upload all images to Cloudinary
      const uploadedResults = await uploadMultipleImages(images);

      const results = uploadedResults.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        isPrimary: index === 0, // First image is primary
      }));

      return ResponseHandler.success(res, results, 'Images uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete image from Cloudinary
  async deleteImage(req, res, next) {
    try {
      const { publicId } = req.params;
      
      await cloudinary.uploader.destroy(publicId);

      return ResponseHandler.success(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MediaController();
