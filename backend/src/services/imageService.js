const sharp = require("sharp");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("@/config/cloudinary");
const { prisma } = require("@/config/db/db");

/**
 * Process and upload image
 * Compresses and optimizes before uploading to Cloudinary
 */
const processAndUploadImage = async (
  fileBuffer,
  originalFilename,
  folder = "writewise"
) => {
  try {
    // Optimize image using sharp
    const optimizedBuffer = await sharp(fileBuffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(
      optimizedBuffer,
      originalFilename,
      folder
    );

    return {
      imageUrl: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      filename: originalFilename,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  } catch (error) {
    console.error("Image processing/upload error:", error);
    throw new Error(`Failed to process and upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 */
const deleteImage = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error("Public ID is required for deletion");
    }

    const result = await deleteImageFromCloudinary(public_id);
    return {
      success: true,
      message: "Image deleted successfully",
      result: result,
    };
  } catch (error) {
    console.error("Image deletion error:", error);
    return {
      success: false,
      message: "Failed to delete image",
      error: error.message,
    };
  }
};

/**
 * Update post cover image
 */
const updatePostCoverImage = async (postId, imageUrl, public_id) => {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        coverImage: imageUrl,
        coverImagePublicId: public_id,
      },
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return updatedPost;
  } catch (error) {
    console.error("Update post cover image error:", error);
    throw new Error(`Failed to update post cover image: ${error.message}`);
  }
};

module.exports = {
  processAndUploadImage,
  deleteImage,
  updatePostCoverImage,
};
