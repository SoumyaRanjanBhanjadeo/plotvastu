const Property = require('./property.model');

class PropertyService {
  // Get all properties with filters
  async getProperties(query = {}) {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      minPrice,
      maxPrice,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter object
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Property.countDocuments(filter),
    ]);

    return {
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get featured properties
  async getFeaturedProperties(limit = 6) {
    return await Property.find({
      isFeatured: true,
      isActive: true,
      status: 'available',
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();
  }

  // Get single property
  async getPropertyById(id) {
    const property = await Property.findById(id).lean();
    if (!property) {
      throw new Error('Property not found');
    }
    return property;
  }

  // Increment views
  async incrementViews(id) {
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  // Create property (Admin)
  async createProperty(data) {
    const property = await Property.create(data);
    return property;
  }

  // Update property (Admin)
  async updateProperty(id, data) {
    const property = await Property.findByIdAndUpdate(
      id,
      data,
      { returnDocument: 'after', runValidators: true }
    );
    if (!property) {
      throw new Error('Property not found');
    }
    return property;
  }

  // Delete property (Admin)
  async deleteProperty(id) {
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      throw new Error('Property not found');
    }
    return property;
  }

  // Get all properties for admin
  async getAllPropertiesAdmin(query = {}) {
    const { page = 1, limit = 20, search, status } = query;
    
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Property.countDocuments(filter),
    ]);

    return {
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Toggle featured status
  async toggleFeatured(id) {
    const property = await Property.findById(id);
    if (!property) {
      throw new Error('Property not found');
    }
    property.isFeatured = !property.isFeatured;
    await property.save();
    return property;
  }

  // Get property statistics
  async getPropertyStats() {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          sold: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
          reserved: { $sum: { $cond: [{ $eq: ['$status', 'reserved'] }, 1, 0] } },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalViews: { $sum: '$views' },
          totalInquiries: { $sum: '$inquiries' },
        },
      },
    ]);

    return stats[0] || {
      total: 0,
      available: 0,
      sold: 0,
      reserved: 0,
      featured: 0,
      totalViews: 0,
      totalInquiries: 0,
    };
  }
}

module.exports = new PropertyService();
