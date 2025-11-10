const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    minlength: 10,
    maxlength: 5000
  },
  images: {
    type: [String],
    validate: [array => array.length <= 5, 'Cannot upload more than 5 images']
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    userIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    text: String,
    respondedBy: String,
    respondedAt: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1, productId: 1 });
reviewSchema.index({ verified: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ 'helpful.count': -1 });

// Compound index to ensure one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Set verified to true if orderId exists
reviewSchema.pre('save', function(next) {
  if (this.orderId && !this.verified) {
    this.verified = true;
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
