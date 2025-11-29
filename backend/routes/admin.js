const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Tip = require('../models/Tip');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireOwner } = require('../middleware/admin');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (admin only, owner can change to admin)
// @access  Private/Admin
router.put('/users/:id/role', [
  body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent changing owner role
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'owner') {
      return res.status(403).json({ error: 'Cannot change owner role' });
    }

    // Only owner can assign admin role
    if (role === 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only owner can assign admin role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/deactivate user account
// @access  Private/Admin
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent deactivating owner
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'owner' && !isActive) {
      return res.status(403).json({ error: 'Cannot deactivate owner account' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account (owner only)
// @access  Private/Owner
router.delete('/users/:id', requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting owner
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'owner') {
      return res.status(403).json({ error: 'Cannot delete owner account' });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalExercises,
      totalTips,
      recentUsers,
      userGrowthData
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
      Exercise.countDocuments(),
      Tip.countDocuments(),
      User.find({})
        .select('username email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      // Get user growth data by month for the last 6 months
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // Last 6 months
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])
    ]);

    // Format user growth data for the chart
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentDate = new Date();
    const growthData = [];

    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // MongoDB months are 1-indexed

      const monthData = userGrowthData.find(item =>
        item._id.year === year && item._id.month === month
      );

      growthData.push({
        month: months[date.getMonth()],
        count: monthData ? monthData.count : 0
      });
    }

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        totalExercises,
        totalTips
      },
      recentUsers,
      userGrowth: growthData
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

module.exports = router;