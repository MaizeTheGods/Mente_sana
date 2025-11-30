const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticateToken } = require('../middleware/auth');
const Song = require('../models/Song');

const router = express.Router();

// Configure multer for memory storage (required for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for audio files
  },
  fileFilter: (req, file, cb) => {
    // Check if file is audio
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (MP3, MP4, etc.) are allowed'), false);
    }
  }
});

// @route   POST /api/songs
// @desc    Upload song to Cloudinary
// @access  Private (Admin only)
router.post('/', authenticateToken, upload.single('song'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Song title is required' });
    }

    // Get next order number
    const lastSong = await Song.findOne().sort({ order: -1 });
    const nextOrder = lastSong ? lastSong.order + 1 : 1;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mente-sana/songs',
          public_id: `song-${Date.now()}`,
          resource_type: 'auto' // Allow audio/video
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save to database
    const song = new Song({
      title: title.trim(),
      url: result.secure_url,
      publicId: result.public_id,
      filename: result.public_id.split('/').pop(),
      order: nextOrder,
      duration: result.duration || 0,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    });

    await song.save();

    res.json({
      message: 'Song uploaded successfully',
      song: {
        _id: song._id,
        title: song.title,
        url: song.url,
        order: song.order,
        duration: song.duration,
        filename: song.filename
      }
    });

  } catch (error) {
    console.error('Song upload error:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
});

// @route   GET /api/songs
// @desc    Get list of songs ordered by order field
// @access  Private (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const songs = await Song.find({ isActive: true })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ order: 1 });

    res.json({
      songs: songs.map(song => ({
        _id: song._id,
        title: song.title,
        url: song.url,
        order: song.order,
        duration: song.duration,
        fileSize: song.fileSize,
        filename: song.filename,
        uploadedBy: song.uploadedBy,
        createdAt: song.createdAt
      }))
    });

  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ error: 'Failed to get songs' });
  }
});

// @route   PUT /api/songs/reorder
// @desc    Update song order
// @access  Private (Admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { songOrders } = req.body; // Array of { _id, order }

    if (!Array.isArray(songOrders)) {
      return res.status(400).json({ error: 'songOrders must be an array' });
    }

    // Update orders in batch
    const updatePromises = songOrders.map(({ _id, order }) =>
      Song.findByIdAndUpdate(_id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Song order updated successfully' });

  } catch (error) {
    console.error('Reorder songs error:', error);
    res.status(500).json({ error: 'Failed to reorder songs' });
  }
});

// @route   DELETE /api/songs/:id
// @desc    Delete song from Cloudinary and database
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    // Find song in database
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(song.publicId, {
      resource_type: 'video' // Cloudinary treats audio as video
    });

    if (result.result === 'ok') {
      // Delete from database
      await Song.findByIdAndDelete(id);

      // Reorder remaining songs
      const remainingSongs = await Song.find({ isActive: true }).sort({ order: 1 });
      const reorderPromises = remainingSongs.map((s, index) =>
        Song.findByIdAndUpdate(s._id, { order: index + 1 })
      );
      await Promise.all(reorderPromises);

      res.json({ message: 'Song deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete song from Cloudinary' });
    }

  } catch (error) {
    console.error('Song delete error:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

module.exports = router;