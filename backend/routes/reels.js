const express = require('express');
const { body, validationResult } = require('express-validator');
const Reel = require('../models/Reel');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const reelValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('videoUrl').isLength({ min: 1, max: 500 }).withMessage('Video URL must be between 1 and 500 characters')
];

// @route   GET /api/reels
// @desc    Get all active reels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const reels = await Reel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('createdBy', 'firstName lastName')
      .select('-__v');

    const total = await Reel.countDocuments({ isActive: true });

    res.json({
      reels,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reels error:', error);
    res.status(500).json({ error: 'Failed to fetch reels' });
  }
});

// @route   GET /api/reels/:id
// @desc    Get reel by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .select('-__v');

    if (!reel || !reel.isActive) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json({ reel });
  } catch (error) {
    console.error('Get reel error:', error);
    res.status(500).json({ error: 'Failed to fetch reel' });
  }
});

// @route   POST /api/reels
// @desc    Create new reel
// @access  Private (Admin only)
router.post('/', authenticateToken, reelValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const reel = new Reel({
      ...req.body,
      createdBy: req.user._id
    });

    await reel.save();

    res.status(201).json({
      message: 'Reel created successfully',
      reel
    });
  } catch (error) {
    console.error('Create reel error:', error);
    res.status(500).json({
      error: 'Failed to create reel',
      details: error.message
    });
  }
});

// @route   PUT /api/reels/:id
// @desc    Update reel
// @access  Private (Admin only)
router.put('/:id', authenticateToken, reelValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName');

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json({
      message: 'Reel updated successfully',
      reel
    });
  } catch (error) {
    console.error('Update reel error:', error);
    res.status(500).json({ error: 'Failed to update reel' });
  }
});

// @route   DELETE /api/reels/:id
// @desc    Delete reel (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('Delete reel error:', error);
    res.status(500).json({ error: 'Failed to delete reel' });
  }
});

module.exports = router;