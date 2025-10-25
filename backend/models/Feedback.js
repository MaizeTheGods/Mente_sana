const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['exercise', 'tip', 'group_chat', 'app_general', 'feature_request', 'bug_report'],
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceModel'
  },
  resourceModel: {
    type: String,
    enum: ['Exercise', 'Tip', 'ChatGroup']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  categories: [{
    type: String,
    enum: ['helpful', 'confusing', 'too_difficult', 'too_easy', 'engaging', 'boring', 'relevant', 'irrelevant', 'well_designed', 'poor_design', 'bug', 'feature_request']
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'implemented', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
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
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ resourceId: 1, type: 1 });

// Virtual for average rating by resource
feedbackSchema.statics.getAverageRating = async function(resourceId, type) {
  const result = await this.aggregate([
    { $match: { resourceId: mongoose.Types.ObjectId(resourceId), type, rating: { $exists: true } } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, count: 0 };
};

// Update updatedAt on save
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);