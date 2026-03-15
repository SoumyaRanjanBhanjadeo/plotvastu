const authService = require('./auth.service');
const ResponseHandler = require('../../utils/response');

class AuthController {
  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ResponseHandler.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return ResponseHandler.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side token removal)
  async logout(req, res, next) {
    try {
      return ResponseHandler.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  // Create user — admin only (replaces the old public /register route)
  async createUser(req, res, next) {
    try {
      const user = await authService.createUser(req.body);
      return ResponseHandler.success(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      return ResponseHandler.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      return ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
