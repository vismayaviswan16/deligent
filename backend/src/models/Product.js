const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  attributes: { type: Map, of: String },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0 }
});

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 5000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  price: {
    regular: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: [0, 'Price must be positive']
    },
    sale: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      uppercase: true
    }
  },
  images: [imageSchema],
  inventory: {
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    status: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'pre_order', 'discontinued'],
      default: 'in_stock'
    },
    warehouse: String
  },
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  variants: [variantSchema],
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ categoryIds: 1 });
productSchema.index({ 'price.regular': 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
