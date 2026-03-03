const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload base64 image to Cloudinary
const uploadImage = async (base64Image, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'plotvastu/properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw error;
  }
};

// Upload multiple base64 images
const uploadMultipleImages = async (base64Images, options = {}) => {
  try {
    const uploadPromises = base64Images.map(img => uploadImage(img, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
};
