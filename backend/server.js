const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const sessionsRoutes = require('./routes/sessions');
const couponsRoutes = require('./routes/coupons');
const storesRoutes = require('./routes/stores');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ScanSavvy API',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/sessions', sessionsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/stores', storesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested endpoint does not exist',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 ScanSavvy API Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Supabase: ${process.env.SUPABASE_URL ? 'Connected' : 'Not configured'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available endpoints:
  GET  /health
  POST /api/sessions/create
  GET  /api/sessions/:sessionId/validate
  GET  /api/coupons/:retailer
  POST /api/coupons/clip
  DELETE /api/coupons/unclip
  GET  /api/stores/nearby
  GET  /api/stores/:retailer/locations
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
