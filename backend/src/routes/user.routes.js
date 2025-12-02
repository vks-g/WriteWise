const express = require('express');
const userRoutes = express.Router();

const {
  GetUserStats,
  GetUserProfile,
  UpdateUserProfile,
  DeleteUserAccount
} = require('@/controllers/userController');
const { AuthenticateUser } = require('@/middleware/authMiddleware');

// Get current user stats (authenticated)
userRoutes.get('/me/stats', AuthenticateUser, GetUserStats);

// Get user profile by ID (public)
userRoutes.get('/:id', GetUserProfile);

// Update user profile (authenticated, own profile only)
userRoutes.put('/:id', AuthenticateUser, UpdateUserProfile);

// Delete user account (authenticated, own account only)
userRoutes.delete('/:id', AuthenticateUser, DeleteUserAccount);

module.exports = userRoutes;
