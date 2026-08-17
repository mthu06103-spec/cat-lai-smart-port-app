const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}).then(() => {
  logger.info('✅ Connected to MongoDB');
}).catch(err => {
  logger.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/berth', require('./routes/berth.routes'));
app.use('/api/yard', require('./routes/yard.routes'));
app.use('/api/vessel', require('./routes/vessel.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/simulation', require('./routes/simulation.routes'));
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running', timestamp: new Date() });
});

// WebSocket handlers
require('./websocket/handlers')(io);

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Berth Optimization API: POST /api/berth/optimize`);
  logger.info(`📦 Yard Optimization API: POST /api/yard/optimize`);
  logger.info(`📈 Analytics API: GET /api/analytics/kpi`);
  logger.info(`⚡ WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(() => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };
