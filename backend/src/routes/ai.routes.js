const express = require('express');
const aiRoutes = express.Router();

const {
  GenerateTitle,
  GenerateSummary,
  GenerateTags,
  GenerateOutline,
  RewriteContent
} = require('@/controllers/aiController');
const { AuthenticateUser } = require('@/middleware/authMiddleware');

// All AI routes are protected
aiRoutes.post('/generate-title', AuthenticateUser, GenerateTitle);
aiRoutes.post('/summary', AuthenticateUser, GenerateSummary);
aiRoutes.post('/tags', AuthenticateUser, GenerateTags);
aiRoutes.post('/outline', AuthenticateUser, GenerateOutline);
aiRoutes.post('/rewrite', AuthenticateUser, RewriteContent);

module.exports = aiRoutes;
