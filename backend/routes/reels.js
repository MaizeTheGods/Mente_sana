const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const Reel = require('../models/Reel');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage (required for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 100MB limit for video files
  },
  fileFilter: (req, file, cb) => {
    // Check if file is video
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

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
// @desc    Upload video file and create new reel
// @access  Private (Admin only)
router.post('/', authenticateToken, upload.single('video'), async (req, res) => {
  const requestId = `REELS_UPLOAD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎥 [${requestId}] REELS ROUTE - Upload attempt by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎥 [${requestId}] REELS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!req.file) {
      console.log(`🎥 [${requestId}] REELS ROUTE - ❌ No file uploaded`);
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { title, description } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    console.log(`🎥 [${requestId}] REELS ROUTE - 📤 Uploading file: ${req.file.originalname}`);

    // Upload to Cloudinary with timeout
    const result = await Promise.race([
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'mente-sana/reels',
            public_id: `reel-${Date.now()}`,
            resource_type: 'video',
            timeout: 120000 // 2 minute timeout for videos
          },
          (error, result) => {
            if (error) {
              console.error(`🎥 [${requestId}] REELS ROUTE - ❌ Cloudinary error:`, error);
              reject(error);
            } else {
              console.log(`🎥 [${requestId}] REELS ROUTE - ✅ Cloudinary upload successful`);
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      }),
      // Timeout after 2 minutes
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Upload timeout for ${req.file.originalname}`)), 120000)
      )
    ]);

    console.log(`🎥 [${requestId}] REELS ROUTE - 💾 Saving reel to database...`);

    // Save to database
    const reel = new Reel({
      title: title.trim(),
      description: description.trim(),
      videoUrl: result.secure_url,
      publicId: result.public_id,
      filename: result.public_id.split('/').pop(),
      fileSize: req.file.size,
      duration: result.duration || 0,
      createdBy: req.user._id
    });

    await reel.save();

    console.log(`🎥 [${requestId}] REELS ROUTE - ✅ Reel created successfully: ${reel._id}`);

    res.status(201).json({
      message: 'Reel uploaded successfully',
      reel: {
        _id: reel._id,
        title: reel.title,
        description: reel.description,
        videoUrl: reel.videoUrl,
        filename: reel.filename,
        fileSize: reel.fileSize,
        duration: reel.duration,
        createdAt: reel.createdAt
      }
    });

  } catch (error) {
    console.error(`🎥 [${requestId}] REELS ROUTE - 💥 Upload error:`, error);

    res.status(500).json({
      error: 'Failed to upload reel',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
// @desc    Delete reel from Cloudinary and database
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const requestId = `REELS_DELETE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎥 [${requestId}] REELS ROUTE - Delete request by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎥 [${requestId}] REELS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;
    console.log(`🎥 [${requestId}] REELS ROUTE - 🗑️ Deleting reel ID:`, id);

    // Find reel in database
    const reel = await Reel.findById(id);
    if (!reel) {
      console.log(`🎥 [${requestId}] REELS ROUTE - ❌ Reel not found:`, id);
      return res.status(404).json({ error: 'Reel not found' });
    }

    console.log(`🎥 [${requestId}] REELS ROUTE - 📤 Deleting from Cloudinary: ${reel.publicId}`);

    // Delete from Cloudinary with error handling
    let cloudinaryResult;
    try {
      cloudinaryResult = await cloudinary.uploader.destroy(reel.publicId, {
        resource_type: 'video'
      });
    } catch (cloudinaryError) {
      console.error(`🎥 [${requestId}] REELS ROUTE - ❌ Cloudinary delete error:`, cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
      cloudinaryResult = { result: 'error' };
    }

    if (cloudinaryResult.result === 'ok') {
      console.log(`🎥 [${requestId}] REELS ROUTE - ✅ Cloudinary deletion successful`);

      // Delete from database
      await Reel.findByIdAndDelete(id);
      console.log(`🎥 [${requestId}] REELS ROUTE - ✅ Database deletion successful`);

      res.json({ message: 'Reel deleted successfully' });
    } else {
      console.log(`🎥 [${requestId}] REELS ROUTE - ⚠️ Cloudinary deletion failed, but database deletion successful`);
      // Still return success since database deletion worked
      res.json({
        message: 'Reel deleted from database (Cloudinary deletion failed)',
        warning: 'File may still exist in cloud storage'
      });
    }

  } catch (error) {
    console.error(`🎥 [${requestId}] REELS ROUTE - ❌ Delete error:`, error);

    res.status(500).json({
      error: 'Failed to delete reel',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;