const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatGroup',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    size: Number
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: {
      type: String,
      enum: ['like', 'love', 'laugh', 'sad', 'angry'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'removed'],
    default: 'approved'
  },
  moderationReason: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
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
chatMessageSchema.index({ groupId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1, createdAt: -1 });
chatMessageSchema.index({ moderationStatus: 1 });

// Virtual for formatted timestamp
chatMessageSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleString('es-ES', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'short',
    timeStyle: 'short'
  });
});

// Method to add reaction
chatMessageSchema.methods.addReaction = function(userId, reaction) {
  const existingReaction = this.reactions.find(
    r => r.userId.toString() === userId.toString()
  );

  if (existingReaction) {
    existingReaction.reaction = reaction;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({
      userId,
      reaction,
      createdAt: new Date()
    });
  }
};

// Method to remove reaction
chatMessageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    r => r.userId.toString() !== userId.toString()
  );
};

// Method to flag for moderation
chatMessageSchema.methods.flagForModeration = function(reason, moderatorId) {
  this.moderationStatus = 'flagged';
  this.moderationReason = reason;
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
};

// Update updatedAt on save
chatMessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);