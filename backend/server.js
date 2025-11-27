const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://maps.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://maps.googleapis.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't exit process, let it continue - database operations will fail gracefully
});

// Routes
app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/questionnaire', require('./routes/questionnaire'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/chat', require('./routes/chat'));
// TODO: Implement remaining routes
// app.use('/api/maps', require('./routes/maps'));
// app.use('/api/feedback', require('./routes/feedback'));
// app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('Socket auth token:', token ? 'present' : 'missing');
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Full decoded:', decoded);
    console.log('Decoded user ID:', decoded._id);
    socket.userId = decoded._id;

    // Get full user data from database
    const User = require('./models/User');
    const user = await User.findById(decoded._id);
    console.log('User found in DB:', !!user);
    if (user) {
      console.log('User data:', { firstName: user.firstName, lastName: user.lastName });
    }
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = {
      _id: decoded._id,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    console.log('JWT verify error:', error.message);
    next(new Error('Authentication error'));
  }
});

// Socket.io chat functionality
const usersTyping = new Map(); // groupId -> Set of userIds typing

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  // Join chat group room
  socket.on('join-group', (groupId) => {
    socket.join(`group-${groupId}`);
    console.log(`User ${socket.userId} joined group ${groupId}`);
  });

  // Leave chat group room
  socket.on('leave-group', (groupId) => {
    socket.leave(`group-${groupId}`);
    console.log(`User ${socket.userId} left group ${groupId}`);
  });

  // Handle typing indicator
  socket.on('typing-start', (groupId) => {
    if (!usersTyping.has(groupId)) {
      usersTyping.set(groupId, new Set());
    }
    usersTyping.get(groupId).add(socket.userId);

    // Send typing indicator to other users in the group
    socket.to(`group-${groupId}`).emit('user-typing', {
      userId: socket.userId,
      firstName: socket.user.firstName,
      lastName: socket.user.lastName,
      isTyping: true
    });
  });

  socket.on('typing-stop', (groupId) => {
    if (usersTyping.has(groupId)) {
      usersTyping.get(groupId).delete(socket.userId);

      // Send typing stop indicator to other users in the group
      socket.to(`group-${groupId}`).emit('user-typing', {
        userId: socket.userId,
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        isTyping: false
      });
    }
  });

  // Handle new messages
  socket.on('send-message', async (data) => {
    try {
      const { groupId, content } = data;

      // Verify user is member of the group
      const ChatGroup = require('./models/ChatGroup');
      const group = await ChatGroup.findById(groupId);
      if (!group) return;

      const isMember = group.currentMembers.some(
        member => member.userId.toString() === socket.userId.toString() && member.isActive
      );
      if (!isMember) return;

      // Create message
      const ChatMessage = require('./models/ChatMessage');
      const message = new ChatMessage({
        groupId,
        senderId: socket.userId,
        content,
        messageType: 'text'
      });

      await message.save();
      await message.populate('senderId', 'firstName lastName');

      // Send message to all users in the group (including sender)
      io.to(`group-${groupId}`).emit('new-message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle message deletion
  socket.on('delete-message', async (data) => {
    try {
      const { groupId, messageId } = data;

      const ChatMessage = require('./models/ChatMessage');
      const message = await ChatMessage.findById(messageId);

      if (!message || message.senderId.toString() !== socket.userId.toString()) {
        return;
      }

      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();

      // Notify all users in the group about the deletion
      io.to(`group-${groupId}`).emit('message-deleted', messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);

    // Remove user from all typing indicators
    usersTyping.forEach((users, groupId) => {
      if (users.has(socket.userId)) {
        users.delete(socket.userId);
        socket.to(`group-${groupId}`).emit('user-typing', {
          userId: socket.userId,
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          isTyping: false
        });
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;