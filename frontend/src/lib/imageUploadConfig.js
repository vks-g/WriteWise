/**
 * Image Upload Configuration
 * Defines constants and validation functions for image uploads
 */

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateFileType = (file) => {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF are allowed.`,
    };
  }
  return { valid: true };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }
  return { valid: true };
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateFile = (file) => {
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) return typeValidation;

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) return sizeValidation;

  return { valid: true };
};

export default {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  IMAGE_COMPRESSION_OPTIONS,
  validateFileType,
  validateFileSize,
  validateFile,
};
