const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalFilename - Original filename
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Object>} Object with secure_url, public_id, format, width, height
 */
const uploadImageToCloudinary = async (
  fileBuffer,
  originalFilename,
  folder = "writewise"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
        public_id: `${Date.now()}-${originalFilename.split(".")[0]}`,
        overwrite: true,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} Deletion result
 */
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Cloudinary delete error: ${error.message}`);
    // Don't throw error if image not found - just log it
    return { result: "ok" };
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  cloudinary,
};
