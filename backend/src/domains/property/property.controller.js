const propertyService = require('./property.service');
const ResponseHandler = require('../../utils/response');

class PropertyController {
  // Get all properties (Public)
  async getProperties(req, res, next) {
    try {
      const result = await propertyService.getProperties(req.query);
      return ResponseHandler.paginated(
        res,
        result.properties,
        result.pagination,
        'Properties retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get featured properties (Public)
  async getFeaturedProperties(req, res, next) {
    try {
      const { limit } = req.query;
      const properties = await propertyService.getFeaturedProperties(limit);
      return ResponseHandler.success(res, properties, 'Featured properties retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Get single property (Public)
  async getProperty(req, res, next) {
    try {
      const property = await propertyService.getPropertyById(req.params.id);
      // Increment views asynchronously
      propertyService.incrementViews(req.params.id);
      return ResponseHandler.success(res, property, 'Property retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Create property (Admin)
  async createProperty(req, res, next) {
    try {
      const property = await propertyService.createProperty(req.body);
      return ResponseHandler.success(res, property, 'Property created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Update property (Admin)
  async updateProperty(req, res, next) {
    try {
      const property = await propertyService.updateProperty(req.params.id, req.body);
      return ResponseHandler.success(res, property, 'Property updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete property (Admin)
  async deleteProperty(req, res, next) {
    try {
      await propertyService.deleteProperty(req.params.id);
      return ResponseHandler.success(res, null, 'Property deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get all properties for admin
  async getAllPropertiesAdmin(req, res, next) {
    try {
      const result = await propertyService.getAllPropertiesAdmin(req.query);
      return ResponseHandler.paginated(
        res,
        result.properties,
        result.pagination,
        'Properties retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Toggle featured status
  async toggleFeatured(req, res, next) {
    try {
      const property = await propertyService.toggleFeatured(req.params.id);
      return ResponseHandler.success(
        res,
        property,
        `Property ${property.isFeatured ? 'marked as featured' : 'removed from featured'}`
      );
    } catch (error) {
      next(error);
    }
  }

  // Get property statistics
  async getPropertyStats(req, res, next) {
    try {
      const stats = await propertyService.getPropertyStats();
      return ResponseHandler.success(res, stats, 'Property statistics retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PropertyController();
