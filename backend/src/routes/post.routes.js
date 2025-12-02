const express = require('express');
const postRoutes = express.Router();

const {
  GetAllPosts,
  GetTrendingPosts,
  SearchPosts,
  GetPostById,
  GetPostsByUser,
  CreatePost,
  UpdatePost,
  DeletePost
} = require('@/controllers/postController');
const { AuthenticateUser } = require('@/middleware/authMiddleware');
const { OptionalAuth } = require('@/middleware/optionalAuth');

// Public routes - specific routes first
postRoutes.get('/trending', GetTrendingPosts);
postRoutes.get('/search', SearchPosts);
postRoutes.get('/user/:id', GetPostsByUser);
postRoutes.get('/', GetAllPosts);
postRoutes.get('/:id', OptionalAuth, GetPostById);

// Protected routes
postRoutes.post('/', AuthenticateUser, CreatePost);
postRoutes.put('/:id', AuthenticateUser, UpdatePost);
postRoutes.delete('/:id', AuthenticateUser, DeletePost);

module.exports = postRoutes;
