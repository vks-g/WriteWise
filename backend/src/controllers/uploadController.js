const imageService = require("@/services/imageService");

/**
 * Upload a single image
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { buffer, originalname } = req.file;

    // Process and upload image
    const result = await imageService.processAndUploadImage(
      buffer,
      originalname,
      "writewise"
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.imageUrl,
      public_id: result.public_id,
      filename: result.filename,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};

/**
 * Upload blog cover image
 */
const uploadBlogCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const { buffer, originalname } = req.file;

    // Process and upload image
    const uploadResult = await imageService.processAndUploadImage(
      buffer,
      originalname,
      "writewise/covers"
    );

    // Update post with cover image
    const updatedPost = await imageService.updatePostCoverImage(
      postId,
      uploadResult.imageUrl,
      uploadResult.public_id
    );

    res.status(200).json({
      success: true,
      message: "Blog cover uploaded successfully",
      post: updatedPost,
      imageUrl: uploadResult.imageUrl,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Blog cover upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload blog cover",
    });
  }
};

/**
 * Delete image from Cloudinary
 */
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await imageService.deleteImage(public_id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image",
    });
  }
};

module.exports = {
  uploadImage,
  uploadBlogCover,
  deleteImage,
};
