const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breathing', 'meditation', 'mindfulness', 'journaling', 'physical', 'cognitive', 'relaxation'],
    required: true
  },
  targetDisorders: [{
    type: String,
    enum: ['depression', 'anxiety', 'stress', 'ptsd', 'ocd', 'general']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 120
  },
  instructions: [{
    step: Number,
    text: String,
    duration: Number, // optional duration for this step
    audioUrl: String // optional audio guidance
  }],
  benefits: [String],
  prerequisites: [String],
  tags: [String],
  media: {
    imageUrl: String,
    videoUrl: String,
    audioUrl: String
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
exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ targetDisorders: 1 });
exerciseSchema.index({ tags: 1 });

// Virtual for completion stats
exerciseSchema.virtual('completionStats').get(function() {
  // This would be populated from user progress data
  return {
    totalCompletions: 0,
    averageRating: 0,
    completionRate: 0
  };
});

// Method to check if exercise is suitable for user
exerciseSchema.methods.isSuitableFor = function(userDisorders, userExperience = 'beginner') {
  const hasMatchingDisorder = this.targetDisorders.includes('general') ||
    userDisorders.some(disorder => this.targetDisorders.includes(disorder));

  const difficultyMatch = this.difficulty === userExperience ||
    (userExperience === 'intermediate' && this.difficulty === 'beginner') ||
    (userExperience === 'advanced' && ['beginner', 'intermediate'].includes(this.difficulty));

  return hasMatchingDisorder && difficultyMatch;
};

// Update updatedAt on save
exerciseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exercise', exerciseSchema);