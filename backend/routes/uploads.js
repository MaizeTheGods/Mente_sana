const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticateToken } = require('../middleware/auth');

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

    res.json({
      message: 'Avatar uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// @route   DELETE /api/uploads/avatar/:publicId
// @desc    Delete avatar image from Cloudinary
// @access  Private (Admin only)
router.delete('/avatar/:publicId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
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
// @desc    Get list of uploaded avatars from Cloudinary
// @access  Private (Admin only)
router.get('/avatars', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Get images from Cloudinary folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mente-sana/avatars/',
      max_results: 100
    });

    const avatars = result.resources.map(resource => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      filename: resource.public_id.split('/').pop()
    }));

    res.json({ avatars });

  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({ error: 'Failed to get avatars' });
  }
});

module.exports = router;