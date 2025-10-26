const mongoose = require('mongoose');

const questionnaireResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionnaireType: {
    type: String,
    enum: ['DASS-21', 'custom'],
    default: 'DASS-21'
  },
  responses: {
    type: Map,
    of: Number, // Question number -> response value (0-3 for DASS-21)
    required: true
  },
  scores: {
    depression: {
      type: Number,
      min: 0,
      max: 42
    },
    anxiety: {
      type: Number,
      min: 0,
      max: 42
    },
    stress: {
      type: Number,
      min: 0,
      max: 42
    },
    total: {
      type: Number,
      min: 0,
      max: 126
    }
  },
  severityLevels: {
    depression: {
      type: String,
      enum: ['normal', 'mild', 'moderate', 'severe', 'extremely_severe']
    },
    anxiety: {
      type: String,
      enum: ['normal', 'mild', 'moderate', 'severe', 'extremely_severe']
    },
    stress: {
      type: String,
      enum: ['normal', 'mild', 'moderate', 'severe', 'extremely_severe']
    }
  },
  recommendations: [{
    type: {
      type: String,
      enum: ['exercise', 'tip', 'group_chat', 'professional_help', 'meditation']
    },
    title: String,
    description: String,
    resourceId: String, // Reference to exercise, tip, or group
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  analysisMetadata: {
    processedBy: String, // 'python-service'
    processingTime: Number, // in milliseconds
    algorithmVersion: String
  },
  isActive: {
    type: Boolean,
    default: true
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

// Index for efficient queries
questionnaireResultSchema.index({ userId: 1, createdAt: -1 });
questionnaireResultSchema.index({ 'scores.depression': 1 });
questionnaireResultSchema.index({ 'scores.anxiety': 1 });
questionnaireResultSchema.index({ 'scores.stress': 1 });

// Update updatedAt on save
questionnaireResultSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('QuestionnaireResult', questionnaireResultSchema);