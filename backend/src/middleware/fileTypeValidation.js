const { fileTypeFromBuffer } = require("file-type");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Validate image MIME type from buffer
 * Prevents MIME type spoofing
 */
const validateImageType = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = await fileTypeFromBuffer(req.file.buffer);

    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      return res.status(400).json({
        error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.",
      });
    }

    // Attach detected MIME type to request
    req.file.detectedMime = fileType.mime;
    next();
  } catch (error) {
    console.error("File type validation error:", error);
    res.status(400).json({
      error: "File validation failed. Please try again.",
    });
  }
};

/**
 * Validate multiple image MIME types from buffer
 */
const validateImageTypeMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Validate each file
    for (let file of req.files) {
      const fileType = await fileTypeFromBuffer(file.buffer);

      if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
        return res.status(400).json({
          error: `Invalid file type for ${file.originalname}. Only JPEG, PNG, WebP, and GIF images are allowed.`,
        });
      }

      file.detectedMime = fileType.mime;
    }

    next();
  } catch (error) {
    console.error("File type validation error:", error);
    res.status(400).json({
      error: "File validation failed. Please try again.",
    });
  }
};

module.exports = {
  validateImageType,
  validateImageTypeMultiple,
};
