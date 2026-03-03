require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./domains/auth/auth.routes');
const propertyRoutes = require('./domains/property/property.routes');
const inquiryRoutes = require('./domains/inquiry/inquiry.routes');
const mediaRoutes = require('./domains/media/media.routes');
const analyticsRoutes = require('./domains/analytics/analytics.routes');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
