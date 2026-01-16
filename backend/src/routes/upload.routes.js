const express = require("express");
const { uploadImage, uploadBlogCover, deleteImage } = require("@/controllers/uploadController");
const { uploadSingleImage } = require("@/middleware/multerMiddleware");
const { validateImageType } = require("@/middleware/fileTypeValidation");
const { AuthenticateUser } = require("@/middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/upload
 * Upload a single image
 */
router.post(
  "/",
  AuthenticateUser,
  uploadSingleImage,
  validateImageType,
  uploadImage
);

/**
 * POST /api/upload/blog-cover
 * Upload blog cover image and update post
 */
router.post(
  "/blog-cover",
  AuthenticateUser,
  uploadSingleImage,
  validateImageType,
  uploadBlogCover
);

/**
 * DELETE /api/upload/image
 * Delete image from Cloudinary
 */
router.delete(
  "/image",
  AuthenticateUser,
  deleteImage
);

module.exports = router;
