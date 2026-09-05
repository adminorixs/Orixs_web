import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
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
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  readingTime: {
    type: Number,
    required: [true, 'Reading time is required'],
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
  },
});

// Update the updatedAt timestamp before saving
BlogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 