const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./auth.model');
const logger = require('../../utils/logger');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }

  // Login user
  async login(email, password) {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // Get current user
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    };
  }

  // Check if any admin exists in database
  async checkAdminExists() {
    try {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        logger.info('No admin user found in database. Please create one manually.');
      } else {
        logger.info('Admin user exists in database');
      }
    } catch (error) {
      logger.error(`Error checking admin: ${error.message}`);
    }
  }

  // Create new user (admin only)
  async createUser(userData) {
    try {
      const { email, password, name, role = 'admin' } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role,
      });

      await user.save();

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('CreateUser service error:', error.message);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const { name } = updateData;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    return true;
  }
}

module.exports = new AuthService();
