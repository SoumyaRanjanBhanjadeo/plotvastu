const inquiryService = require('./inquiry.service');
const ResponseHandler = require('../../utils/response');

class InquiryController {
  constructor() {
    this.clients = [];
  }

  // SSE Stream
  streamInquiries = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write('data: {"connected": true}\n\n');

    const newClient = { id: Date.now(), res };
    this.clients.push(newClient);

    req.on('close', () => {
      this.clients = this.clients.filter(client => client.id !== newClient.id);
    });
  };

  // Create inquiry (Public)
  createInquiry = async (req, res, next) => {
    try {
      const inquiry = await inquiryService.createInquiry(req.body);
      
      this.clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(inquiry)}\n\n`);
      });

      return ResponseHandler.success(
        res,
        inquiry,
        'Inquiry submitted successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  // Get all inquiries (Admin)
  async getInquiries(req, res, next) {
    try {
      const result = await inquiryService.getInquiries(req.query);
      return ResponseHandler.paginated(
        res,
        result.inquiries,
        result.pagination,
        'Inquiries retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get single inquiry (Admin)
  async getInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.getInquiryById(req.params.id);
      return ResponseHandler.success(res, inquiry, 'Inquiry retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update inquiry (Admin)
  async updateInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.updateInquiry(req.params.id, req.body);
      return ResponseHandler.success(res, inquiry, 'Inquiry updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete inquiry (Admin)
  async deleteInquiry(req, res, next) {
    try {
      await inquiryService.deleteInquiry(req.params.id);
      return ResponseHandler.success(res, null, 'Inquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get inquiry statistics (Admin)
  async getInquiryStats(req, res, next) {
    try {
      const stats = await inquiryService.getInquiryStats();
      return ResponseHandler.success(res, stats, 'Inquiry statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Get recent inquiries (Admin)
  async getRecentInquiries(req, res, next) {
    try {
      const { limit } = req.query;
      const inquiries = await inquiryService.getRecentInquiries(limit);
      return ResponseHandler.success(res, inquiries, 'Recent inquiries retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InquiryController();
