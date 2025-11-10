const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
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
    maxlength: 1000
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: String,
  metadata: {
    title: String,
    metaDescription: String,
    keywords: [String]
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });
categorySchema.index({ ancestors: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ displayOrder: 1 });
categorySchema.index({ name: 'text' });

// Pre-save middleware to calculate ancestors and level
categorySchema.pre('save', async function(next) {
  if (this.isModified('parentId')) {
    if (this.parentId) {
      const parent = await this.constructor.findById(this.parentId);
      if (parent) {
        this.ancestors = [...parent.ancestors, parent._id];
        this.level = parent.level + 1;
      }
    } else {
      this.ancestors = [];
      this.level = 0;
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
