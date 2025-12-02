const express = require('express');
const { body, validationResult } = require('express-validator');
const Tip = require('../models/Tip');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const tipValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content must be at least 1 character'),
  body('category').isIn(['daily_habit', 'coping_strategy', 'lifestyle', 'relationships', 'student_life', 'self_care']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly', 'as_needed']).withMessage('Invalid frequency'),
  body('targetDisorders').optional().isArray().withMessage('Target disorders must be an array'),
  body('media.videoUrl').optional().isLength({ min: 1, max: 200 }).withMessage('Video URL/ID must be between 1 and 200 characters')
];

// @route   GET /api/tips
// @desc    Get all tips
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, priority, limit = 50, page = 1 } = req.query;

    let query = { isActive: true };

    if (category) query.category = category;
    if (priority) query.priority = priority;

    const tips = await Tip.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Tip.countDocuments(query);

    res.json({
      tips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// @route   GET /api/tips/categories
// @desc    Get tip categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'daily_habit', label: 'Hábitos Diarios', icon: '🌅' },
    { id: 'coping_strategy', label: 'Estrategias de Afrontamiento', icon: '🛡️' },
    { id: 'lifestyle', label: 'Estilo de Vida', icon: '🏠' },
    { id: 'relationships', label: 'Relaciones', icon: '❤️' },
    { id: 'student_life', label: 'Vida Estudiantil', icon: '📚' },
    { id: 'self_care', label: 'Autocuidado', icon: '🧴' }
  ];

  res.json({ categories });
});

// @route   GET /api/tips/:id
// @desc    Get tip by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id).select('-__v');

    if (!tip || !tip.isActive) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ tip });
  } catch (error) {
    console.error('Get tip error:', error);
    res.status(500).json({ error: 'Failed to fetch tip' });
  }
});

// @route   POST /api/tips
// @desc    Create new tip
// @access  Private (Admin only)
router.post('/', authenticateToken, tipValidation, async (req, res) => {
  try {
    console.log('📥 [REDEPLOY TEST] Recibiendo datos para crear consejo:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Errores de validación encontrados:', errors.array());
      console.log('❌ Datos recibidos:', {
        title: req.body.title,
        titleLength: req.body.title ? req.body.title.length : 0,
        content: req.body.content,
        contentLength: req.body.content ? req.body.content.length : 0,
        category: req.body.category,
        videoUrl: req.body.media?.videoUrl,
        videoUrlLength: req.body.media?.videoUrl ? req.body.media.videoUrl.length : 0
      });
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        receivedData: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          media: req.body.media
        }
      });
    }

    const tip = new Tip({
      ...req.body,
      createdBy: req.user._id
    });

    console.log('💾 Intentando guardar consejo:', tip);

    await tip.save();

    console.log('✅ Consejo creado exitosamente:', tip._id);

    res.status(201).json({
      message: 'Tip created successfully',
      tip
    });
  } catch (error) {
    console.error('❌ Create tip error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      error: 'Failed to create tip',
      details: error.message
    });
  }
});

// @route   PUT /api/tips/:id
// @desc    Update tip
// @access  Private (Admin only)
router.put('/:id', authenticateToken, tipValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({
      message: 'Tip updated successfully',
      tip
    });
  } catch (error) {
    console.error('Update tip error:', error);
    res.status(500).json({ error: 'Failed to update tip' });
  }
});

// @route   DELETE /api/tips/:id
// @desc    Delete tip (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const tip = await Tip.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ message: 'Tip deleted successfully' });
  } catch (error) {
    console.error('Delete tip error:', error);
    res.status(500).json({ error: 'Failed to delete tip' });
  }
});

module.exports = router;