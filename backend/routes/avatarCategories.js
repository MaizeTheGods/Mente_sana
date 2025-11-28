const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const AvatarCategory = require('../models/AvatarCategory');

const router = express.Router();

// @route   GET /api/avatar-categories
// @desc    Get all avatar categories (active and inactive)
// @access  Private (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const categories = await AvatarCategory.find({})
      .populate('createdBy', 'firstName lastName')
      .sort({ isActive: -1, order: 1, createdAt: -1 });

    res.json({ categories });

  } catch (error) {
    console.error('Get avatar categories error:', error);
    res.status(500).json({ error: 'Failed to get avatar categories' });
  }
});

// @route   POST /api/avatar-categories
// @desc    Create new avatar category
// @access  Private (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { name, label, description, icon, color } = req.body;

    // Validate required fields
    if (!name || !label) {
      return res.status(400).json({ error: 'Name and label are required' });
    }

    // Check if category name already exists
    const existingCategory = await AvatarCategory.findOne({
      name: name.toLowerCase().trim(),
      isActive: true
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // Get the highest order number
    const lastCategory = await AvatarCategory.findOne({ isActive: true })
      .sort({ order: -1 });

    const order = lastCategory ? lastCategory.order + 1 : 1;

    const category = new AvatarCategory({
      name: name.toLowerCase().trim(),
      label: label.trim(),
      description: description?.trim(),
      icon: icon || '📁',
      color: color || '#2e7d32',
      createdBy: req.user._id,
      order
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: {
        _id: category._id,
        name: category.name,
        label: category.label,
        description: category.description,
        icon: category.icon,
        color: category.color,
        order: category.order,
        createdBy: category.createdBy
      }
    });

  } catch (error) {
    console.error('Create avatar category error:', error);
    res.status(500).json({ error: 'Failed to create avatar category' });
  }
});

// @route   PUT /api/avatar-categories/:id
// @desc    Update avatar category
// @access  Private (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;
    const { label, description, icon, color, order } = req.body;

    const category = await AvatarCategory.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update fields
    if (label !== undefined) category.label = label.trim();
    if (description !== undefined) category.description = description?.trim();
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
    if (order !== undefined) category.order = order;

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category: {
        _id: category._id,
        name: category.name,
        label: category.label,
        description: category.description,
        icon: category.icon,
        color: category.color,
        order: category.order
      }
    });

  } catch (error) {
    console.error('Update avatar category error:', error);
    res.status(500).json({ error: 'Failed to update avatar category' });
  }
});

// @route   DELETE /api/avatar-categories/:id
// @desc    Delete avatar category (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    // Check if category has avatars
    const Avatar = require('../models/Avatar');
    const avatarCount = await Avatar.countDocuments({
      category: (await AvatarCategory.findById(id)).name,
      isActive: true
    });

    if (avatarCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with existing avatars. Move or delete avatars first.'
      });
    }

    // Soft delete
    const category = await AvatarCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Delete avatar category error:', error);
    res.status(500).json({ error: 'Failed to delete avatar category' });
  }
});

// @route   PUT /api/avatar-categories/reorder
// @desc    Reorder categories
// @access  Private (Admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ error: 'categoryIds must be an array' });
    }

    // Update order for each category
    const updatePromises = categoryIds.map((id, index) =>
      AvatarCategory.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Categories reordered successfully' });

  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({ error: 'Failed to reorder categories' });
  }
});

module.exports = router;