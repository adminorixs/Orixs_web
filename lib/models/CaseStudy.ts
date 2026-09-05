import mongoose from 'mongoose';

const CaseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please use a valid slug format (lowercase letters, numbers, and hyphens only)']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  metrics: {
    efficiencyIncrease: {
      type: Number,
      required: [true, 'Efficiency increase metric is required'],
      min: [0, 'Efficiency increase must be between 0 and 100'],
      max: [100, 'Efficiency increase must be between 0 and 100']
    },
    operationalCostSavings: {
      type: Number,
      required: [true, 'Operational cost savings metric is required'],
      min: [0, 'Operational cost savings must be between 0 and 100'],
      max: [100, 'Operational cost savings must be between 0 and 100']
    },
    customerSatisfactionIncrease: {
      type: Number,
      required: [true, 'Customer satisfaction increase metric is required'],
      min: [0, 'Customer satisfaction increase must be between 0 and 100'],
      max: [100, 'Customer satisfaction increase must be between 0 and 100']
    }
  },
  keyBenefits: [{
    type: String,
    required: [true, 'Key benefits are required']
  }],
  challenges: [{
    type: String,
    required: [true, 'Challenges are required']
  }],
  implementationPlan: [{
    type: String,
    required: [true, 'Implementation plan is required']
  }],
  results: {
    type: String,
    required: [true, 'Results are required'],
  },
  testimonial: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
CaseStudySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add index for faster queries
CaseStudySchema.index({ slug: 1 });
CaseStudySchema.index({ status: 1 });
CaseStudySchema.index({ category: 1 });

export default mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema); 