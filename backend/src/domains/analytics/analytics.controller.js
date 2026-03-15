const propertyService = require('../property/property.service');
const inquiryService = require('../inquiry/inquiry.service');
const Property = require('../property/property.model');
const Inquiry = require('../inquiry/inquiry.model');
const ResponseHandler = require('../../utils/response');

class AnalyticsController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.getDashboardStats = this.getDashboardStats.bind(this);
    this.getPropertyAnalytics = this.getPropertyAnalytics.bind(this);
    this.getLeadAnalytics = this.getLeadAnalytics.bind(this);
    this._getMonthlyData = this._getMonthlyData.bind(this);
  }

  // Get dashboard overview stats
  async getDashboardStats(req, res, next) {
    try {
      const [propertyStats, inquiryStats, last6Months] = await Promise.all([
        propertyService.getPropertyStats(),
        inquiryService.getInquiryStats(),
        this._getMonthlyData(),
      ]);

      const dashboardStats = {
        properties: propertyStats,
        inquiries: inquiryStats,
        monthlyData: last6Months,
      };

      return ResponseHandler.success(
        res,
        dashboardStats,
        'Dashboard stats retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get property analytics
  async getPropertyAnalytics(req, res, next) {
    try {
      const { type } = req.query;

      // Get properties by type
      const propertiesByType = await Property.aggregate([
        { $match: type ? { type } : {} },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price.amount' },
            totalViews: { $sum: '$views' },
          },
        },
      ]);

      // Get top viewed properties
      const topViewed = await Property.find()
        .sort({ views: -1 })
        .limit(5)
        .select('title views location.city price images')
        .lean();

      // Get top inquired properties
      const topInquired = await Property.find()
        .sort({ inquiries: -1 })
        .limit(5)
        .select('title inquiries location.city price images')
        .lean();

      return ResponseHandler.success(
        res,
        {
          byType: propertiesByType,
          topViewed,
          topInquired,
        },
        'Property analytics retrieved'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get lead analytics
  async getLeadAnalytics(req, res, next) {
    try {
      // Get inquiries by status
      const byStatus = await Inquiry.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get inquiries by type
      const byType = await Inquiry.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get daily inquiries for last 30 days
      const last30Days = await Inquiry.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return ResponseHandler.success(
        res,
        {
          byStatus,
          byType,
          last30Days,
        },
        'Lead analytics retrieved'
      );
    } catch (error) {
      next(error);
    }
  }

  // Helper method to get monthly data
  async _getMonthlyData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [propertyData, inquiryData] = await Promise.all([
      Property.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Inquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    return {
      properties: propertyData,
      inquiries: inquiryData,
    };
  }
}

module.exports = new AnalyticsController();
