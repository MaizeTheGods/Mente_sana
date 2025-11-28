const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticateToken } = require('../middleware/auth');
const Avatar = require('../models/Avatar');

const router = express.Router();

// Configure multer for memory storage (required for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/uploads/avatar
// @desc    Upload avatar image to Cloudinary
// @access  Private (Admin only)
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category = 'general' } = req.body;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mente-sana/avatars',
          public_id: `avatar-${Date.now()}`,
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save to database
    const avatar = new Avatar({
      publicId: result.public_id,
      url: result.secure_url,
      filename: result.public_id.split('/').pop(),
      category,
      uploadedBy: req.user._id
    });

    await avatar.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: {
        _id: avatar._id,
        publicId: avatar.publicId,
        url: avatar.url,
        filename: avatar.filename,
        category: avatar.category
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// @route   DELETE /api/uploads/avatar/:id
// @desc    Delete avatar image from Cloudinary and database
// @access  Private (Admin only)
router.delete('/avatar/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    // Don't allow deleting the default avatar
    if (id === 'default') {
      return res.status(400).json({ error: 'Cannot delete default avatar' });
    }

    // Find avatar in database
    const avatar = await Avatar.findById(id);
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(avatar.publicId);

    if (result.result === 'ok') {
      // Delete from database
      await Avatar.findByIdAndDelete(id);
      res.json({ message: 'Avatar deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete avatar from Cloudinary' });
    }

  } catch (error) {
    console.error('Avatar delete error:', error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

// @route   GET /api/uploads/avatars
// @desc    Get list of uploaded avatars organized by categories
// @access  Private
router.get('/avatars', authenticateToken, async (req, res) => {
  try {
    // Get avatars from database, grouped by category
    const avatars = await Avatar.find({ isActive: true })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Group by category
    const avatarsByCategory = avatars.reduce((acc, avatar) => {
      if (!acc[avatar.category]) {
        acc[avatar.category] = [];
      }
      acc[avatar.category].push({
        _id: avatar._id,
        publicId: avatar.publicId,
        url: avatar.url,
        filename: avatar.filename,
        category: avatar.category,
        uploadedBy: avatar.uploadedBy,
        createdAt: avatar.createdAt
      });
      return acc;
    }, {});

    // Add default avatar option
    if (!avatarsByCategory['default']) {
      avatarsByCategory['default'] = [{
        _id: 'default',
        publicId: 'default-avatar',
        url: 'default-avatar.png',
        filename: 'default-avatar.png',
        category: 'default',
        uploadedBy: null,
        createdAt: new Date()
      }];
    }

    res.json({ avatarsByCategory });

  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({ error: 'Failed to get avatars' });
  }
});

module.exports = router;