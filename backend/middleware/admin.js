const User = require('../models/User');

// Middleware to check if user is admin or owner
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check if user is owner only
const requireOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Owner privileges required.' });
    }

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    console.error('Owner middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { requireAdmin, requireOwner };