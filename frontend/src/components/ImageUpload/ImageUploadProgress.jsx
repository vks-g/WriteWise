"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * ImageUploadProgress Component
 * Displays upload progress bar, percentage, and loading state
 */
export default function ImageUploadProgress({
  progress = 0,
  isUploading = false,
  showPercentage = true,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage and Status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isUploading && (
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
          )}
          <span className="text-xs sm:text-sm text-white/60">
            {isUploading ? "Uploading..." : "Upload complete"}
          </span>
        </div>

        {showPercentage && (
          <span className="text-xs sm:text-sm font-medium text-white/80">
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
}
