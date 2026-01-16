"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import axios from "@/lib/axios";
import {
  validateFile,
  IMAGE_COMPRESSION_OPTIONS,
} from "@/lib/imageUploadConfig";

/**
 * Custom hook for image uploads
 * Handles compression, upload tracking, and error management
 */
export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  /**
   * Upload image to server
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload result { imageUrl, public_id }
   */
  const uploadImage = useCallback(async (file) => {
    try {
      setError(null);
      setUploadProgress(0);

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return null;
      }

      setIsUploading(true);

      // Compress image
      let compressedFile = file;
      try {
        compressedFile = await imageCompression(
          file,
          IMAGE_COMPRESSION_OPTIONS
        );
      } catch (compressionError) {
        console.error("Image compression warning:", compressionError);
        // Continue with original if compression fails
        compressedFile = file;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      // Upload with progress tracking
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        const imageData = {
          imageUrl: response.data.imageUrl,
          public_id: response.data.public_id,
        };
        setUploadedImage(imageData);
        setUploadProgress(100);
        return imageData;
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload image";
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Upload blog cover image
   * @param {File} file - Cover image file
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Updated post object
   */
  const uploadBlogCover = useCallback(async (file, postId) => {
    try {
      setError(null);
      setUploadProgress(0);

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return null;
      }

      setIsUploading(true);

      // Compress image
      let compressedFile = file;
      try {
        compressedFile = await imageCompression(
          file,
          IMAGE_COMPRESSION_OPTIONS
        );
      } catch (compressionError) {
        console.error("Image compression warning:", compressionError);
        compressedFile = file;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);
      formData.append("postId", postId);

      // Upload with progress tracking
      const response = await axios.post("/api/upload/blog-cover", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        const imageData = {
          imageUrl: response.data.imageUrl,
          public_id: response.data.public_id,
          post: response.data.post,
        };
        setUploadedImage(imageData);
        setUploadProgress(100);
        return imageData;
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Blog cover upload error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload blog cover";
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Delete image from Cloudinary
   * @param {string} public_id - Public ID of image to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteImage = useCallback(async (public_id) => {
    try {
      setError(null);

      if (!public_id) {
        setError("Public ID is required for deletion");
        return false;
      }

      const response = await axios.delete("/api/upload/image", {
        data: { public_id },
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || "Deletion failed");
      }
    } catch (err) {
      console.error("Image deletion error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete image";
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Reset upload state
   */
  const resetUploadState = useCallback(() => {
    setUploadProgress(0);
    setError(null);
    setUploadedImage(null);
  }, []);

  return {
    uploadProgress,
    isUploading,
    error,
    uploadedImage,
    uploadImage,
    uploadBlogCover,
    deleteImage,
    resetUploadState,
  };
};

export default useImageUpload;
