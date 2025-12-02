const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true, // Allow all origins for prototype
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

// ===== RATE LIMITING - PREVENT 429 ERRORS =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Very high limit to prevent 429 errors
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '900' // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks, CORS tests, and OPTIONS requests
  skip: (req) => {
    return req.path === '/health' ||
           req.path === '/cors-test' ||
           req.method === 'OPTIONS' ||
           req.path.startsWith('/api/songs'); // Temporarily skip songs for debugging
  },
  // Use IP address for rate limiting
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  // Log when rate limiting occurs
  onLimitReached: (req, res) => {
    console.log(`🚨 RATE LIMIT EXCEEDED for ${req.method} ${req.path} from IP: ${req.ip}`);
    console.log(`   User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
    console.log(`   Origin: ${req.headers.origin || 'NO_ORIGIN'}`);
  }
});
app.use(limiter);

// ===== ADDITIONAL RATE LIMITING FOR SENSITIVE ENDPOINTS =====
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Stricter limit for auth endpoints
  message: {
    error: 'Too Many Authentication Attempts',
    message: 'Too many authentication requests. Please try again later.',
    retryAfter: '900'
  },
  skip: (req) => req.method === 'OPTIONS'
});

// Apply strict rate limiting to auth routes
app.use('/api/auth', strictLimiter);

// ===== ULTRA-COMPREHENSIVE CORS CONFIGURATION =====
// This handles ALL possible CORS scenarios including:
// - Browser requests with origins
// - Server-to-server requests (no origin)
// - Mobile app requests
// - API clients
// - Development and production environments

// CORS configuration - Maximum permissiveness
app.use(cors({
  origin: function (origin, callback) {
    // Log for debugging
    console.log('🔍 CORS Origin Check:', origin || 'NO_ORIGIN');

    // Allow ALL origins - no restrictions
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Auth-Token',
    'Accept-Encoding',
    'Accept-Language',
    'Cache-Control',
    'Connection',
    'Host',
    'Pragma',
    'Referer',
    'User-Agent',
    'X-Forwarded-For',
    'X-Real-IP'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Request counter
let requestCount = 0;

// ===== ADDITIONAL CORS HEADERS - MAXIMUM COVERAGE =====
app.use((req, res, next) => {
  requestCount++;
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const method = req.method;
  const path = req.path;

  console.log(`[${timestamp}] 🚀 Request #${requestCount} - ${method} ${path}`);
  console.log(`   Origin: ${origin || 'NO_ORIGIN'}`);
  console.log(`   User-Agent: ${userAgent.substring(0, 50)}...`);

  // ===== CORS HEADERS - EVERY POSSIBLE SCENARIO =====

  // 1. Handle origin-based requests (browsers)
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`   ✅ CORS: Origin-based (${origin})`);
  } else {
    // 2. Handle requests without origin (servers, mobile apps, API clients)
    res.header('Access-Control-Allow-Origin', '*');
    console.log(`   ✅ CORS: No-origin request (*)`);
  }

  // 3. Essential CORS headers
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, ' +
    'X-Requested-With, X-CSRF-Token, X-Auth-Token, Accept-Encoding, ' +
    'Accept-Language, Cache-Control, Connection, Host, Pragma, Referer, User-Agent'
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count, X-Rate-Limit-Remaining');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // 4. Additional security headers that don't interfere with CORS
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');

  // 5. Handle preflight requests
  if (method === 'OPTIONS') {
    console.log(`   🔄 Preflight request handled for ${path}`);
    res.sendStatus(200);
    return; // Don't continue to next middleware
  }

  console.log(`   ➡️  Continuing to next middleware`);
  next();
});

// ===== CORS ERROR HANDLING =====
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    console.error('🚨 CORS Error:', err);
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-origin request blocked',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Contact administrator'
    });
  }
  next(err);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection with better error handling
console.log('🔌 Attempting to connect to MongoDB...');
console.log('📋 MONGODB_URI exists:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable is not set!');
  console.log('⚠️ Server will continue but database operations will fail');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mente-sana', {
  // Connection options compatible with Render's MongoDB version
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // Remove deprecated buffer options that cause errors
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Connection ready state:', mongoose.connection.readyState);
    console.log('🚀 Request counter initialized and ready to track requests');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Connection details:', {
      host: err?.reason?.servers?.[0]?.host || 'unknown',
      port: err?.reason?.servers?.[0]?.port || 'unknown',
      code: err.code,
      codeName: err.codeName
    });
    console.log('⚠️ Server will continue but database operations may fail');
    // Don't exit process - let it continue gracefully
  });

// Handle database disconnection
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 MongoDB runtime error:', err);
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// Routes
app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/questionnaire', require('./routes/questionnaire'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/avatar-categories', require('./routes/avatarCategories'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/reels', require('./routes/reels'));

// Seed endpoint (temporary for admin use)
app.post('/api/seed', require('./middleware/auth').authenticateToken, async (req, res) => {
  try {
    console.log('🌱 Starting database seeding via API endpoint...');
    const { seedDatabase } = require('./scripts/seedData');
    await seedDatabase();
    res.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Temporary endpoint to get connection info (remove after seeding)
app.get('/api/connection-info', (req, res) => {
  res.json({
    mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'not configured',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// TODO: Implement remaining routes
// app.use('/api/maps', require('./routes/maps'));
// app.use('/api/feedback', require('./routes/feedback'));
// app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint with comprehensive status
app.get('/health', (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': res.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Credentials': res.get('Access-Control-Allow-Credentials'),
    'Access-Control-Allow-Methods': res.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': res.get('Access-Control-Allow-Headers')
  };

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    totalRequests: requestCount,
    environment: process.env.NODE_ENV,
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      pid: process.pid
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name || 'unknown'
    },
    cors: {
      configured: true,
      headers: corsHeaders,
      allowsAllOrigins: true
    },
    features: {
      music: true,
      chat: true,
      admin: true,
      authentication: true
    }
  });
});

// ===== CORS TEST ENDPOINT =====
app.get('/cors-test', (req, res) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];

  res.status(200).json({
    message: 'CORS Test Successful! 🎉',
    timestamp: new Date().toISOString(),
    requestDetails: {
      origin: origin || 'NO_ORIGIN',
      userAgent: userAgent ? userAgent.substring(0, 100) : 'NO_UA',
      forwardedFor: forwardedFor || 'NO_XFF',
      realIP: realIP || 'NO_REAL_IP',
      method: req.method,
      path: req.path,
      protocol: req.protocol,
      secure: req.secure,
      ip: req.ip
    },
    corsHeaders: {
      'Access-Control-Allow-Origin': res.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': res.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.get('Access-Control-Allow-Headers')
    },
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }
  });
});

// Stats endpoint for request counter
app.get('/stats', (req, res) => {
  const uptimeHours = Math.floor(process.uptime() / 3600);
  const uptimeMinutes = Math.floor((process.uptime() % 3600) / 60);
  const uptimeSeconds = Math.floor(process.uptime() % 60);

  res.status(200).json({
    message: 'Backend Statistics',
    timestamp: new Date().toISOString(),
    totalRequests: requestCount,
    uptime: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`,
    averageRequestsPerHour: requestCount > 0 ? (requestCount / (process.uptime() / 3600)).toFixed(2) : 0,
    environment: process.env.NODE_ENV,
    server: 'Mente Sana Backend v2.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ Error:`, err.stack);
  console.log(`[${timestamp}] 📊 Current request count: ${requestCount}`);

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
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Socket auth: decoded._id =', decoded._id);
    socket.userId = decoded._id;

    // Get full user data from database
    const User = require('./models/User');
    const user = await User.findById(decoded._id);
    console.log('Socket auth: user found =', !!user);
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
      if (!group) {
        return;
      }

      const isMember = group.currentMembers.some(
        member => member.userId.toString() === socket.userId.toString() && member.isActive
      );
      if (!isMember) {
        return;
      }

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

// ===== PROCESS ERROR HANDLING =====
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit process - let it continue
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  // Don't exit process - let it continue
});

// Handle process termination signals gracefully
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
console.log(`🚀 Starting server on port ${PORT}...`);
console.log(`📋 PORT environment variable:`, process.env.PORT);
console.log(`🌍 Environment:`, process.env.NODE_ENV);
console.log(`🔧 Node version:`, process.version);
console.log(`💾 Memory usage:`, Math.round(process.memoryUsage().heapUsed / 1024 / 1024), 'MB');

server.listen(PORT, () => {
  console.log(`✅ Server successfully started and listening on port ${PORT}`);
  console.log(`🌐 CORS configured for all origins`);
  console.log(`🚀 Request counter initialized at 0`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 CORS test: http://localhost:${PORT}/cors-test`);
  console.log(`🎵 Music API: http://localhost:${PORT}/api/songs`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

module.exports = app;