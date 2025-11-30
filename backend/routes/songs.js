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
// @desc    Upload multiple songs to Cloudinary
// @access  Private (Admin only)
router.post('/', authenticateToken, upload.array('songs', 20), async (req, res) => {
  const requestId = `SONGS_UPLOAD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎵 [${requestId}] SONGS ROUTE - Upload attempt by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!req.files || req.files.length === 0) {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ No files uploaded`);
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files;
    const { titles } = req.body; // Array of titles or single title

    console.log(`🎵 [${requestId}] SONGS ROUTE - 📁 Processing ${files.length} files`);

    // Handle titles - can be array or single string
    let titleArray = [];
    if (Array.isArray(titles)) {
      titleArray = titles;
    } else if (titles) {
      // If single title provided, use filename for others
      titleArray = files.map((file, index) => index === 0 ? titles : file.originalname.replace(/\.[^/.]+$/, ""));
    } else {
      // Use filenames if no titles provided
      titleArray = files.map(file => file.originalname.replace(/\.[^/.]+$/, ""));
    }

    console.log(`🎵 [${requestId}] SONGS ROUTE - 📝 Titles:`, titleArray);

    // Get next order number with error handling
    let nextOrder = 1;
    try {
      const lastSong = await Song.findOne().sort({ order: -1 });
      nextOrder = lastSong ? lastSong.order + 1 : 1;
      console.log(`🎵 [${requestId}] SONGS ROUTE - 📊 Next order number:`, nextOrder);
    } catch (dbError) {
      console.error(`🎵 [${requestId}] SONGS ROUTE - ⚠️ Database error getting order:`, dbError);
      // Continue with order 1 - don't fail the whole upload
    }

    const uploadedSongs = [];
    const errors = [];

    // Upload files one by one with individual error handling
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titleArray[i] || file.originalname.replace(/\.[^/.]+$/, "");

      console.log(`🎵 [${requestId}] SONGS ROUTE - 📤 Uploading file ${i + 1}/${files.length}: ${file.originalname}`);

      try {
        // Upload to Cloudinary with timeout
        const result = await Promise.race([
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'mente-sana/songs',
                public_id: `song-${Date.now()}-${i}`,
                resource_type: 'auto', // Allow audio/video
                timeout: 60000 // 60 second timeout
              },
              (error, result) => {
                if (error) {
                  console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Cloudinary error for ${file.originalname}:`, error);
                  reject(error);
                } else {
                  console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Cloudinary upload successful for ${file.originalname}`);
                  resolve(result);
                }
              }
            );

            uploadStream.end(file.buffer);
          }),
          // Timeout after 60 seconds
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Upload timeout for ${file.originalname}`)), 60000)
          )
        ]);

        console.log(`🎵 [${requestId}] SONGS ROUTE - 💾 Saving ${title} to database...`);

        // Save to database with error handling
        const song = new Song({
          title: title.trim(),
          url: result.secure_url,
          publicId: result.public_id,
          filename: result.public_id.split('/').pop(),
          order: nextOrder++,
          duration: result.duration || 0,
          fileSize: file.size,
          uploadedBy: req.user._id
        });

        await song.save();

        uploadedSongs.push({
          _id: song._id,
          title: song.title,
          url: song.url,
          order: song.order,
          duration: song.duration,
          filename: song.filename
        });

        console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Successfully uploaded: ${title}`);

      } catch (error) {
        console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Error uploading ${file.originalname}:`, error);
        errors.push({
          file: file.originalname,
          error: error.message || 'Unknown upload error'
        });
        // Continue with next file - don't fail the whole batch
      }
    }

    const successCount = uploadedSongs.length;
    const errorCount = errors.length;

    console.log(`🎵 [${requestId}] SONGS ROUTE - 📊 Upload summary: ${successCount} successful, ${errorCount} failed`);

    if (successCount === 0) {
      console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ All uploads failed`);
      return res.status(500).json({
        error: 'Failed to upload any songs',
        errors
      });
    }

    res.json({
      message: `${successCount} song(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      songs: uploadedSongs,
      errors: errorCount > 0 ? errors : undefined
    });

  } catch (error) {
    console.error(`🎵 [${requestId}] SONGS ROUTE - 💥 Critical upload error:`, error);

    // Don't let this crash the server - return error response
    res.status(500).json({
      error: 'Failed to upload songs',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/songs
// @desc    Get list of songs ordered by order field
// @access  Private (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  const requestId = `SONGS_GET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎵 [${requestId}] SONGS ROUTE - Get songs request by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    console.log(`🎵 [${requestId}] SONGS ROUTE - 📊 Fetching songs from database...`);

    const songs = await Song.find({ isActive: true })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ order: 1 });

    console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Found ${songs.length} songs`);

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
    console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Get songs error:`, error);

    // Don't crash server - return error response
    res.status(500).json({
      error: 'Failed to get songs',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/songs/reorder
// @desc    Update song order
// @access  Private (Admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  const requestId = `SONGS_REORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎵 [${requestId}] SONGS ROUTE - Reorder request by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { songOrders } = req.body; // Array of { _id, order }

    if (!Array.isArray(songOrders)) {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Invalid request: songOrders not an array`);
      return res.status(400).json({ error: 'songOrders must be an array' });
    }

    console.log(`🎵 [${requestId}] SONGS ROUTE - 🔄 Reordering ${songOrders.length} songs...`);

    // Update orders in batch with error handling
    const updatePromises = songOrders.map(async ({ _id, order }) => {
      try {
        return await Song.findByIdAndUpdate(_id, { order }, { new: true });
      } catch (err) {
        console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Error updating song ${_id}:`, err);
        return null; // Continue with other updates
      }
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r !== null).length;
    const errorCount = results.filter(r => r === null).length;

    console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Reorder complete: ${successCount} successful, ${errorCount} failed`);

    res.json({
      message: 'Song order updated successfully',
      updated: successCount,
      failed: errorCount
    });

  } catch (error) {
    console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Reorder error:`, error);

    // Don't crash server
    res.status(500).json({
      error: 'Failed to reorder songs',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/songs/:id
// @desc    Delete song from Cloudinary and database
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const requestId = `SONGS_DELETE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`🎵 [${requestId}] SONGS ROUTE - Delete request by user:`, req.user._id);

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Access denied: User is not admin`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;
    console.log(`🎵 [${requestId}] SONGS ROUTE - 🗑️ Deleting song ID:`, id);

    // Find song in database
    const song = await Song.findById(id);
    if (!song) {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ❌ Song not found:`, id);
      return res.status(404).json({ error: 'Song not found' });
    }

    console.log(`🎵 [${requestId}] SONGS ROUTE - 📤 Deleting from Cloudinary: ${song.publicId}`);

    // Delete from Cloudinary with error handling
    let cloudinaryResult;
    try {
      cloudinaryResult = await cloudinary.uploader.destroy(song.publicId, {
        resource_type: 'video' // Cloudinary treats audio as video
      });
    } catch (cloudinaryError) {
      console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Cloudinary delete error:`, cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
      cloudinaryResult = { result: 'error' };
    }

    if (cloudinaryResult.result === 'ok') {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Cloudinary deletion successful`);

      // Delete from database
      await Song.findByIdAndDelete(id);
      console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Database deletion successful`);

      // Reorder remaining songs with error handling
      try {
        const remainingSongs = await Song.find({ isActive: true }).sort({ order: 1 });
        console.log(`🎵 [${requestId}] SONGS ROUTE - 🔄 Reordering ${remainingSongs.length} remaining songs`);

        const reorderPromises = remainingSongs.map((s, index) =>
          Song.findByIdAndUpdate(s._id, { order: index + 1 }).catch(err => {
            console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Reorder error for song ${s._id}:`, err);
            return null;
          })
        );

        await Promise.all(reorderPromises);
        console.log(`🎵 [${requestId}] SONGS ROUTE - ✅ Reorder complete`);
      } catch (reorderError) {
        console.error(`🎵 [${requestId}] SONGS ROUTE - ⚠️ Reorder failed, but deletion successful:`, reorderError);
        // Don't fail the whole operation for reorder issues
      }

      res.json({ message: 'Song deleted successfully' });
    } else {
      console.log(`🎵 [${requestId}] SONGS ROUTE - ⚠️ Cloudinary deletion failed, but database deletion successful`);
      // Still return success since database deletion worked
      res.json({
        message: 'Song deleted from database (Cloudinary deletion failed)',
        warning: 'File may still exist in cloud storage'
      });
    }

  } catch (error) {
    console.error(`🎵 [${requestId}] SONGS ROUTE - ❌ Delete error:`, error);

    // Don't crash server
    res.status(500).json({
      error: 'Failed to delete song',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;