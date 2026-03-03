const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const authService = require('./src/domains/auth/auth.service');

const PORT = process.env.PORT || 5000;

// Connect to database and check for admin
connectDB().then(() => {
  // Check if admin exists in database
  authService.checkAdminExists();
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
