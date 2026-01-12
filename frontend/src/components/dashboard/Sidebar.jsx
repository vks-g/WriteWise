"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Plus,
  FileText,
  Heart,
  MessageCircle,
  MoreVertical,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ onPopupChange }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const navItems = [
    {
      label: "My Posts",
      href: "/me/posts",
      icon: FileText,
    },
    {
      label: "Liked Posts",
      href: "/me/likes",
      icon: Heart,
    },
    {
      label: "My Comments",
      href: "/me/comments",
      icon: MessageCircle,
    },
  ];

  const isActive = (href) => {
    if (href === "/me") {
      return pathname === "/me" || pathname === "/me/posts";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleSettingsPopup = () => {
    const newState = !settingsPopupOpen;
    setSettingsPopupOpen(newState);
    onPopupChange?.(newState);
  };

  const closeSettingsPopup = () => {
    setSettingsPopupOpen(false);
    onPopupChange?.(false);
  };

  const handleLogout = () => {
    console.log("Logout clicked (UI only)");
    closeSettingsPopup();
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeSettingsPopup();
      }
    };

    if (settingsPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsPopupOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* TOP SECTION */}
      <div className="">
        {/* Logo Container - equal spacing left/right, top padding */}
        <div className="pt-6 px-8 mt-6">
          <Link
            href="/dashboard"
            className="flex justify-center"
            onClick={closeMobileMenu}
          >
            <Image
              src="/logo.svg"
              alt="WriteWise"
              className="h-9 w-auto brightness-0 invert mr-6"
              height={130}
              width={130}
            />
          </Link>
        </div>

        {/* New Post Button - larger with blue-to-violet gradient, centered */}
        <div className="mt-30 px-8">
          <Link
            href="/me/new"
            onClick={closeMobileMenu}
            className="flex items-center justify-center gap-3 h-16 w-full px-8 rounded-3xl
              bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 backdrop-blur-md border border-violet-500/50
              hover:bg-gradient-to-r hover:from-violet-500/50 hover:to-fuchsia-500/50
              shadow-lg shadow-violet-500/20
              hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02]
              transition-all duration-300 group "
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            <span className="font-semibold text-white text-lg">New</span>
          </Link>
        </div>

        {/* MAIN MENU ITEMS */}
        <nav className="mt-10 px-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active ? "bg-violet-500/15" : "hover:bg-white/5"
                }`}
              >
                {/* Active indicator - neon left border */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-400 shadow-lg shadow-violet-500/50" />
                )}

                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    active
                      ? "text-violet-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                <span
                  className={`font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                      : "text-gray-400 group-hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* MIDDLE FILL AREA - flex-1 auto fills the gap */}
      {/* <div className="flex-1" /> */}

      {/* BOTTOM PROFILE BLOCK */}
      <div className="p-4 border-t border-white/10">
        <div className="relative" ref={popupRef}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            {/* Circular Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>

            {/* 3-dot menu (MoreVertical) */}
            <button
              onClick={toggleSettingsPopup}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
            </button>
          </div>

          {/* Settings Popup - positioned to the right of three dots */}
          {settingsPopupOpen && (
            <div
              className="absolute right-0 left-40 bottom-0 translate-x-[calc(100%+8px)] z-[60]
                origin-left animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200"
            >
              <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]">
                <Link
                  href="/settings"
                  onClick={() => {
                    closeSettingsPopup();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-lg lg:hidden hover:bg-gray-900/90 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile Overlay - only visible on mobile when menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar (Slide-out Drawer) */}
      <aside
        className={`fixed top-4 left-4 bottom-4 w-72 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl z-50 transform transition-transform duration-300 ease-out lg:hidden shadow-2xl shadow-black/20 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex fixed top-4 left-4 bottom-4 w-72 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl z-40 flex-col shadow-2xl shadow-black/20">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
