const express = require('express');
const likeRoutes = express.Router();

const { ToggleLike, GetLikedPosts } = require('@/controllers/likeController');
const { AuthenticateUser } = require('@/middleware/authMiddleware');

// Get liked posts - must be before /:postId to avoid conflict
likeRoutes.get('/user/:id', AuthenticateUser, GetLikedPosts);

// Toggle like on a post
likeRoutes.post('/:postId', AuthenticateUser, ToggleLike);

module.exports = likeRoutes;
