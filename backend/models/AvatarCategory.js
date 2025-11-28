const mongoose = require('mongoose');

const avatarCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#2e7d32'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
avatarCategorySchema.index({ isActive: 1, order: 1 });
avatarCategorySchema.index({ name: 1 });

// Middleware para asegurar que siempre haya al menos una categoría
avatarCategorySchema.pre('findOneAndDelete', async function(next) {
  const count = await this.model.countDocuments({ isActive: true });
  if (count <= 1) {
    return next(new Error('No se puede eliminar la última categoría activa'));
  }
  next();
});

module.exports = mongoose.model('AvatarCategory', avatarCategorySchema);