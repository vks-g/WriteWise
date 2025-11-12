const express = require('express');
const authRoutes = express.Router();

const { Register, Login, Logout, GetCurrentUser } = require('@/controllers/authController');
const { ValidateSignup, ValidateLogin } = require('@/middleware/validateRequest');
const { AuthenticateUser } = require('@/middleware/authMiddleware');

authRoutes.post('/signup', ValidateSignup, Register);
authRoutes.post('/login', ValidateLogin, Login);
authRoutes.post('/logout', Logout);
authRoutes.get('/me', GetCurrentUser);

module.exports = authRoutes;
