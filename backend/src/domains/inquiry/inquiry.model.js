const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      maxlength: [2000, 'Message cannot be more than 2000 characters'],
    },
    type: {
      type: String,
      enum: ['inquiry', 'site_visit', 'callback'],
      default: 'inquiry',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'closed'],
      default: 'new',
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot be more than 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting by date
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ propertyId: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
