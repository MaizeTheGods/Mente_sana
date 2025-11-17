const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatGroup = require('../models/ChatGroup');
const ChatMessage = require('../models/ChatMessage');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const chatGroupValidation = [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Group name must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['anxiety', 'depression', 'stress', 'general', 'recovery', 'family']).withMessage('Invalid category')
];

const messageValidation = [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
];

// @route   GET /api/chat/groups
// @desc    Get all chat groups
// @access  Private
router.get('/groups', authenticateToken, async (req, res) => {
  try {
    const groups = await ChatGroup.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .select('-__v');

    // Add membership status for each group
    const groupsWithMembership = groups.map(group => {
      const isMember = group.currentMembers.some(
        member => member.userId.toString() === req.user._id.toString() && member.isActive
      );

      return {
        ...group.toObject(),
        isMember
      };
    });

    res.json({ groups: groupsWithMembership });
  } catch (error) {
    console.error('Get chat groups error:', error);
    res.status(500).json({ error: 'Failed to fetch chat groups' });
  }
});

// @route   GET /api/chat/groups/:id
// @desc    Get chat group by ID
// @access  Private
router.get('/groups/:id', authenticateToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('currentMembers.userId', 'firstName lastName')
      .select('-__v');

    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Chat group not found' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Get chat group error:', error);
    res.status(500).json({ error: 'Failed to fetch chat group' });
  }
});

// @route   POST /api/chat/groups
// @desc    Create new chat group
// @access  Private (Admin only)
router.post('/groups', authenticateToken, chatGroupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const group = new ChatGroup({
      ...req.body,
      createdBy: req.user._id,
      currentMembers: [{
        userId: req.user._id,
        role: 'facilitator',
        joinedAt: new Date(),
        isActive: true
      }]
    });

    await group.save();

    res.status(201).json({
      message: 'Chat group created successfully',
      group
    });
  } catch (error) {
    console.error('Create chat group error:', error);
    res.status(500).json({ error: 'Failed to create chat group' });
  }
});

// @route   POST /api/chat/groups/:id/join
// @desc    Join a chat group
// @access  Private
router.post('/groups/:id/join', authenticateToken, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.id);

    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Chat group not found' });
    }

    // Check if user is already a member
    const existingMember = group.currentMembers.find(
      member => member.userId.toString() === req.user._id.toString() && member.isActive
    );

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    // Check if group is at capacity
    const activeMembers = group.currentMembers.filter(member => member.isActive);
    if (activeMembers.length >= group.maxMembers) {
      return res.status(400).json({ error: 'Group is at maximum capacity' });
    }

    // Add member using the model's method
    group.addMember(req.user._id);
    await group.save();

    res.json({ message: 'Successfully joined the group' });
  } catch (error) {
    console.error('Join chat group error:', error);
    res.status(500).json({ error: 'Failed to join chat group' });
  }
});

// @route   GET /api/chat/groups/:id/messages
// @desc    Get messages for a chat group
// @access  Private
router.get('/groups/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const group = await ChatGroup.findById(req.params.id);
    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Chat group not found' });
    }

    const isMember = group.currentMembers.some(
      member => member.userId.toString() === req.user._id.toString() && member.isActive
    );

    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const messages = await ChatMessage.find({ groupId: req.params.id, isActive: true })
      .populate('senderId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await ChatMessage.countDocuments({ groupId: req.params.id, isActive: true });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// @route   POST /api/chat/groups/:id/messages
// @desc    Send message to chat group
// @access  Private
router.post('/groups/:id/messages', authenticateToken, messageValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const group = await ChatGroup.findById(req.params.id);
    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Chat group not found' });
    }

    const isMember = group.currentMembers.some(
      member => member.userId.toString() === req.user._id.toString() && member.isActive
    );

    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const message = new ChatMessage({
      groupId: req.params.id,
      senderId: req.user._id,
      content: req.body.content,
      messageType: req.body.messageType || 'text'
    });

    await message.save();

    // Populate sender info for response
    await message.populate('senderId', 'firstName lastName');

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// @route   DELETE /api/chat/groups/:groupId/messages/:messageId
// @desc    Delete message (soft delete)
// @access  Private (Message sender or admin only)
router.delete('/groups/:groupId/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.messageId);

    if (!message || !message.isActive) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the sender or an admin
    if (message.senderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    message.isActive = false;
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;