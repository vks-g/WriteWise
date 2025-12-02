"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Camera,
  AlertTriangle,
  Save
} from "lucide-react";

const Settings = () => {
  // UI state only
  const [username, setUsername] = useState("johndoe");
  const [email] = useState("john.doe@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // UI-only handlers
  const handleProfileSave = () => {
    console.log("Profile save clicked:", { username });
  };

  const handlePasswordSave = () => {
    console.log("Password save clicked");
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Theme toggled:", !isDarkMode ? "dark" : "light");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked (UI only)");
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      {/* ═══════════════════════════════════════════════════════════
          1️⃣ PAGE HEADER
      ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your account
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SETTINGS PANELS WRAPPER
      ═══════════════════════════════════════════════════════════ */}
      <div className="space-y-6">

        {/* ─────────────────────────────────────────────────────────
            PANEL A — PROFILE INFORMATION
        ───────────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6">
          {/* Panel Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
              <p className="text-sm text-gray-500">Update your public profile details</p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-white/10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-500/25">
                J
              </div>
              {/* Camera overlay */}
              <button
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => console.log("Change avatar clicked")}
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-white font-medium">Profile Picture</p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
              <button
                className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                onClick={() => console.log("Upload new photo")}
              >
                Upload new photo
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4
                    text-white placeholder:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                    transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Email (disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4
                    text-gray-500 cursor-not-allowed opacity-60"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">Email cannot be changed</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={handleProfileSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-white/10 backdrop-blur-sm border border-white/10
                text-white font-medium
                hover:bg-white/15 hover:border-white/20
                transition-all duration-200
                shadow-lg shadow-black/10"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            PANEL B — CHANGE PASSWORD
        ───────────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6">
          {/* Panel Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <p className="text-sm text-gray-500">Update your password regularly for security</p>
            </div>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12
                    text-white placeholder:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                    transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12
                    text-white placeholder:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                    transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12
                    text-white placeholder:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                    transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button - Right Aligned */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={handlePasswordSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-violet-500 to-fuchsia-500
                text-white font-medium
                hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25
                transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            PANEL C — APPEARANCE (THEME)
        ───────────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6">
          {/* Panel Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-violet-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <p className="text-sm text-gray-500">Toggle between dark and light mode</p>
              </div>
            </div>

            {/* Theme Toggle Pill Switch */}
            <button
              onClick={handleThemeToggle}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "bg-violet-500/20 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                  : "bg-amber-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10"
              }`}
            >
              {/* Toggle Circle */}
              <div
                className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode
                    ? "left-1 bg-gradient-to-br from-violet-500 to-fuchsia-500"
                    : "left-8 bg-gradient-to-br from-amber-400 to-orange-400"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </button>
          </div>

          {/* Theme Preview */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              {/* Dark Mode Preview */}
              <div
                className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-900 border-violet-500/50 ring-2 ring-violet-500/20"
                    : "bg-gray-900 border-white/10 hover:border-white/20"
                }`}
                onClick={() => { setIsDarkMode(true); console.log("Theme: dark"); }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-white">Dark</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-white/10 rounded w-full" />
                  <div className="h-2 bg-white/10 rounded w-3/4" />
                </div>
              </div>

              {/* Light Mode Preview */}
              <div
                className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer ${
                  !isDarkMode
                    ? "bg-gray-100 border-amber-500/50 ring-2 ring-amber-500/20"
                    : "bg-gray-100 border-white/10 hover:border-white/20"
                }`}
                onClick={() => { setIsDarkMode(false); console.log("Theme: light"); }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-800">Light</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-gray-300 rounded w-full" />
                  <div className="h-2 bg-gray-300 rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            PANEL D — DANGER ZONE
        ───────────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-red-500/5 backdrop-blur-md border border-red-500/20 p-4 sm:p-6">
          {/* Panel Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
              <p className="text-sm text-gray-500">Irreversible and destructive actions</p>
            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-sm text-gray-400 mt-1">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="flex-shrink-0 px-5 py-2.5 rounded-xl
                  bg-red-500/20 text-red-400
                  border border-red-500/30
                  hover:bg-red-500/30 hover:border-red-500/40
                  transition-all duration-200
                  text-sm font-medium
                  shadow-lg shadow-red-500/10"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
