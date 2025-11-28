const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'general'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
avatarSchema.index({ category: 1, isActive: 1 });
avatarSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Avatar', avatarSchema);