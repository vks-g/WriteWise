const express = require('express');
const commentRoutes = express.Router();

const {
  GetCommentsByPost,
  GetCommentsByUser,
  AddComment,
  DeleteComment
} = require('@/controllers/commentController');
const { AuthenticateUser } = require('@/middleware/authMiddleware');

// User comments - must be before /:postId to avoid conflict
commentRoutes.get('/user/:id', GetCommentsByUser);

// Post comments
commentRoutes.get('/:postId', GetCommentsByPost);

// Protected routes
commentRoutes.post('/:postId', AuthenticateUser, AddComment);
commentRoutes.delete('/:id', AuthenticateUser, DeleteComment);

module.exports = commentRoutes;
