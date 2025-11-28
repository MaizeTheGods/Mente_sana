const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String
  },
  questionnaireResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionnaireResult'
  }],
  questionnaireCompleted: {
    type: Boolean,
    default: false
  },
  questionnaireCount: {
    type: Number,
    default: 0
  },
  chatGroups: [{
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatGroup'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  progressTracking: {
    completedExercises: [{
      exerciseId: String,
      completedAt: Date,
      rating: Number
    }],
    streakDays: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'es'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    profileImage: {
      type: String,
      default: 'default-avatar.png'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTyping: {
    type: Boolean,
    default: false
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

// Index for location-based queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);