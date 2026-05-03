const mongoose = require('mongoose');

const websiteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: [true, 'Section is required'],
      enum: ['hero', 'testimonials', 'footer', 'siteSettings'],
      unique: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Content is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WebsiteContent', websiteContentSchema);
