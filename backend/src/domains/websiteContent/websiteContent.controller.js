const ResponseHandler = require('../../utils/response');
const websiteContentService = require('./websiteContent.service');

const getHeroContent = async (req, res, next) => {
  try {
    const content = await websiteContentService.getHeroContent();
    return ResponseHandler.success(res, content, 'Hero content fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const content = await websiteContentService.getTestimonials();
    return ResponseHandler.success(res, content, 'Testimonials fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getFooterContent = async (req, res, next) => {
  try {
    const content = await websiteContentService.getFooterContent();
    return ResponseHandler.success(res, content, 'Footer content fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getSiteSettings = async (req, res, next) => {
  try {
    const content = await websiteContentService.getSiteSettings();
    return ResponseHandler.success(res, content, 'Site settings fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getAllContent = async (req, res, next) => {
  try {
    const contents = await websiteContentService.getAllContent();
    return ResponseHandler.success(res, contents, 'All website content fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateHeroContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const updated = await websiteContentService.updateContent('hero', content, req.user._id);
    return ResponseHandler.success(res, updated, 'Hero content updated successfully');
  } catch (error) {
    next(error);
  }
};

const updateTestimonials = async (req, res, next) => {
  try {
    const { content } = req.body;
    const updated = await websiteContentService.updateContent('testimonials', content, req.user._id);
    return ResponseHandler.success(res, updated, 'Testimonials updated successfully');
  } catch (error) {
    next(error);
  }
};

const updateFooterContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const updated = await websiteContentService.updateContent('footer', content, req.user._id);
    return ResponseHandler.success(res, updated, 'Footer content updated successfully');
  } catch (error) {
    next(error);
  }
};

const updateSiteSettings = async (req, res, next) => {
  try {
    const { content } = req.body;
    const updated = await websiteContentService.updateContent('siteSettings', content, req.user._id);
    return ResponseHandler.success(res, updated, 'Site settings updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHeroContent,
  getTestimonials,
  getFooterContent,
  getSiteSettings,
  getAllContent,
  updateHeroContent,
  updateTestimonials,
  updateFooterContent,
  updateSiteSettings,
};
