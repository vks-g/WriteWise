"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Check } from "lucide-react";
import useImageUpload from "@/hooks/useImageUpload";
import ImageUploadProgress from "./ImageUploadProgress";

/**
 * DragDropZone Component
 * Glassmorphic drag-and-drop image upload with preview
 */
export default function DragDropZone({
  onImageUpload,
  onError,
  maxWidth = 600,
  className = "",
  acceptedFormats = "image/jpeg,image/png,image/webp,image/gif",
  showPreview = true,
}) {
  const {
    uploadProgress,
    isUploading,
    error,
    uploadedImage,
    uploadImage,
    resetUploadState,
  } = useImageUpload();

  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file) => {
      // Create preview
      if (showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      // Upload image
      const result = await uploadImage(file);

      if (result) {
        onImageUpload?.(result);
      } else if (error) {
        onError?.(error);
      }
    },
    [uploadImage, error, onImageUpload, onError, showPreview]
  );

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // File input change
  const handleInputChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Clear upload
  const handleClear = useCallback(() => {
    setPreview(null);
    resetUploadState();
  }, [resetUploadState]);

  return (
    <div className={className}>
      {/* Main Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative w-full rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-in-out
          ${
            isDragActive
              ? "bg-white/10 border-white/30 backdrop-blur-lg"
              : "bg-white/5 border-white/10 backdrop-blur-lg"
          }
          ${isUploading ? "opacity-60 pointer-events-none" : ""}
          p-4 sm:p-6 md:p-8
        `}
      >
        {/* Upload Icon and Text */}
        {!preview && !uploadedImage && (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12">
            <Upload
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-3 sm:mb-4 transition-colors ${
                isDragActive ? "text-violet-400" : "text-white/60"
              }`}
            />

            <p className="text-center text-sm sm:text-base">
              <span className="font-semibold text-white/80">
                Drag and drop
              </span>
              <span className="text-white/60"> or </span>
              <label className="font-semibold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">
                browse
                <input
                  type="file"
                  accept={acceptedFormats}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  className="hidden"
                  aria-label="Upload image"
                />
              </label>
            </p>

            <p className="text-xs sm:text-sm text-white/40 mt-2">
              PNG, JPG, WebP, GIF up to 5MB
            </p>
          </div>
        )}

        {/* Preview */}
        {preview && !uploadedImage && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="relative w-full max-w-xs sm:max-w-sm mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              {!isUploading && (
                <button
                  onClick={handleClear}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors"
                  aria-label="Clear preview"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {!isUploading && (
              <p className="text-sm text-white/60">
                Ready to upload. {/* Space for upload progress */}
              </p>
            )}
          </div>
        )}

        {/* Success State */}
        {uploadedImage && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="relative w-full max-w-xs sm:max-w-sm mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImage.imageUrl}
                alt="Uploaded"
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <div className="p-3 bg-emerald-500/90 rounded-full">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-emerald-400 mb-3">
              Upload successful!
            </p>

            <button
              onClick={handleClear}
              className="
                px-4 py-2 text-sm font-medium
                bg-white/10 hover:bg-white/20
                border border-white/20 hover:border-white/30
                rounded-lg transition-colors
                text-white/80 hover:text-white
              "
            >
              Upload Another
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar and Error Message */}
      {isUploading && (
        <div className="mt-4">
          <ImageUploadProgress progress={uploadProgress} isUploading={true} />
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
