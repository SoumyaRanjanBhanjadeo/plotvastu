const Inquiry = require('./inquiry.model');
const Property = require('../property/property.model');

class InquiryService {
  // Create inquiry (Public)
  async createInquiry(data) {
    // Check if property exists
    const property = await Property.findById(data.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Create inquiry
    const inquiry = await Inquiry.create(data);

    // Increment property inquiries count
    await Property.findByIdAndUpdate(data.propertyId, {
      $inc: { inquiries: 1 },
    });

    return inquiry;
  }

  // Get all inquiries (Admin)
  async getInquiries(query = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      propertyId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('propertyId', 'title location.city images')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get single inquiry
  async getInquiryById(id) {
    const inquiry = await Inquiry.findById(id)
      .populate('propertyId', 'title location images price type')
      .lean();
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }
    return inquiry;
  }

  // Update inquiry status (Admin)
  async updateInquiry(id, data) {
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('propertyId', 'title location.city');

    if (!inquiry) {
      throw new Error('Inquiry not found');
    }
    return inquiry;
  }

  // Delete inquiry (Admin)
  async deleteInquiry(id) {
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }
    return inquiry;
  }

  // Get inquiry statistics
  async getInquiryStats() {
    const stats = await Inquiry.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        },
      },
    ]);

    return stats[0] || {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
    };
  }

  // Get recent inquiries
  async getRecentInquiries(limit = 5) {
    return await Inquiry.find()
      .populate('propertyId', 'title location.city images')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();
  }
}

module.exports = new InquiryService();
