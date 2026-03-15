const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['plot', 'residential', 'commercial', 'apartment', 'villa'],
    },
    status: {
      type: String,
      required: [true, 'Please specify property status'],
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
    price: {
      amount: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative'],
      },
      currency: {
        type: String,
        default: 'INR',
        enum: ['INR', 'USD'],
      },
      negotiable: {
        type: Boolean,
        default: false,
      },
    },
    area: {
      value: {
        type: Number,
        required: [true, 'Please provide area'],
        min: [0, 'Area cannot be negative'],
      },
      unit: {
        type: String,
        required: [true, 'Please specify area unit'],
        enum: ['decimal', 'sqft', 'sqyd', 'acre', 'hectare'],
      },
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide a city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide a state'],
      },
      pincode: {
        type: String,
        required: [true, 'Please provide a pincode'],
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, 'Please provide latitude'],
        },
        lng: {
          type: Number,
          required: [true, 'Please provide longitude'],
        },
      },
    },
    features: [{
      type: String,
      trim: true,
    }],
    images: [{
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ 'price.amount': 1 });
propertySchema.index({ isFeatured: 1, isActive: 1 });

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function () {
  const symbol = this.price.currency === 'INR' ? '₹' : '$';
  return `${symbol}${this.price.amount.toLocaleString('en-IN')}`;
});

module.exports = mongoose.model('Property', propertySchema);
