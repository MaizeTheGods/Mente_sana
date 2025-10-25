const mongoose = require('mongoose');

const chatGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'disorder_specific', 'peer_support', 'one_on_one'],
    required: true
  },
  disorderCategory: {
    type: String,
    enum: ['depression', 'anxiety', 'stress', 'ptsd', 'ocd', 'mixed', 'general'],
    required: function() {
      return this.type === 'disorder_specific';
    }
  },
  severityLevel: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'all_levels'],
    default: 'all_levels'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 50,
    min: 2,
    max: 100
  },
  currentMembers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'facilitator'],
      default: 'member'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rules: [{
    rule: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
chatGroupSchema.index({ type: 1, disorderCategory: 1 });
chatGroupSchema.index({ 'currentMembers.userId': 1 });
chatGroupSchema.index({ tags: 1 });

// Virtual for member count
chatGroupSchema.virtual('memberCount').get(function() {
  return this.currentMembers.filter(member => member.isActive).length;
});

// Method to add member
chatGroupSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.currentMembers.find(
    member => member.userId.toString() === userId.toString()
  );

  if (existingMember) {
    existingMember.isActive = true;
    existingMember.role = role;
  } else {
    this.currentMembers.push({
      userId,
      role,
      joinedAt: new Date(),
      isActive: true
    });
  }
};

// Method to remove member
chatGroupSchema.methods.removeMember = function(userId) {
  const member = this.currentMembers.find(
    member => member.userId.toString() === userId.toString()
  );

  if (member) {
    member.isActive = false;
  }
};

// Update updatedAt on save
chatGroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ChatGroup', chatGroupSchema);