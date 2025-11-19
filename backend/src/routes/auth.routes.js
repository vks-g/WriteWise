const express = require('express');
const authRoutes = express.Router();

const { Register, Login, Logout, GetCurrentUser } = require('@/controllers/authController');
const { ValidateSignup, ValidateLogin } = require('@/middleware/validateRequest');
const { AuthenticateUser } = require('@/middleware/authMiddleware');
const { GoogleAuth, GoogleAuthCallback } = require('@/controllers/googleAuthController');

authRoutes.post('/signup', ValidateSignup, Register);
authRoutes.post('/login', ValidateLogin, Login);
authRoutes.post('/logout', Logout);
authRoutes.get('/me', GetCurrentUser);
authRoutes.get('/google',GoogleAuth)
authRoutes.get('/google/callback',GoogleAuthCallback)

module.exports = authRoutes;
