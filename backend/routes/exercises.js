const express = require('express');
const { body, validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const exerciseValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['breathing', 'meditation', 'mindfulness', 'journaling', 'physical', 'cognitive', 'relaxation']).withMessage('Invalid category'),
  body('duration').isInt({ min: 1, max: 120 }).withMessage('Duration must be between 1 and 120 minutes'),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
  body('targetDisorders').optional().isArray().withMessage('Target disorders must be an array'),
  body('instructions').optional().isArray().withMessage('Instructions must be an array'),
  body('benefits').optional().isArray().withMessage('Benefits must be an array'),
  body('media.videoUrl').optional().isURL().withMessage('Video URL must be valid')
];

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit = 50, page = 1 } = req.query;

    let query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const exercises = await Exercise.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Exercise.countDocuments(query);

    res.json({
      exercises,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// @route   GET /api/exercises/categories
// @desc    Get exercise categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'breathing', label: 'Respiración', icon: '🫁' },
    { id: 'meditation', label: 'Meditación', icon: '🧘' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🌸' },
    { id: 'journaling', label: 'Diario', icon: '📝' },
    { id: 'physical', label: 'Físico', icon: '🏃' },
    { id: 'cognitive', label: 'Cognitivo', icon: '🧠' },
    { id: 'relaxation', label: 'Relajación', icon: '😌' }
  ];

  res.json({ categories });
});

// @route   GET /api/exercises/:id
// @desc    Get exercise by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).select('-__v');

    if (!exercise || !exercise.isActive) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ exercise });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// @route   POST /api/exercises
// @desc    Create new exercise
// @access  Private (Admin only)
router.post('/', authenticateToken, exerciseValidation, async (req, res) => {
  try {
    console.log('📥 Recibiendo datos para crear ejercicio:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Errores de validación:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const exercise = new Exercise({
      ...req.body,
      createdBy: req.user._id
    });

    console.log('💾 Intentando guardar ejercicio:', exercise);

    await exercise.save();

    console.log('✅ Ejercicio creado exitosamente:', exercise._id);

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise
    });
  } catch (error) {
    console.error('❌ Create exercise error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      error: 'Failed to create exercise',
      details: error.message
    });
  }
});

// @route   PUT /api/exercises/:id
// @desc    Update exercise
// @access  Private (Admin only)
router.put('/:id', authenticateToken, exerciseValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({
      message: 'Exercise updated successfully',
      exercise
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// @route   DELETE /api/exercises/:id
// @desc    Delete exercise (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

module.exports = router;