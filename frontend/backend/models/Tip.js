const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['daily_habit', 'coping_strategy', 'lifestyle', 'relationships', 'work_life', 'self_care'],
    required: true
  },
  targetDisorders: [{
    type: String,
    enum: ['depression', 'anxiety', 'stress', 'ptsd', 'ocd', 'general']
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'as_needed'],
    default: 'as_needed'
  },
  tags: [String],
  media: {
    imageUrl: String,
    videoUrl: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
tipSchema.index({ category: 1, priority: 1 });
tipSchema.index({ targetDisorders: 1 });
tipSchema.index({ tags: 1 });

// Virtual for usage stats
tipSchema.virtual('usageStats').get(function() {
  // This would be populated from user interaction data
  return {
    totalViews: 0,
    helpfulVotes: 0,
    averageRating: 0
  };
});

// Method to check if tip is relevant for user
tipSchema.methods.isRelevantFor = function(userDisorders) {
  return this.targetDisorders.includes('general') ||
    userDisorders.some(disorder => this.targetDisorders.includes(disorder));
};

// Update updatedAt on save
tipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tip', tipSchema);