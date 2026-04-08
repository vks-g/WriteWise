"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Silk from "@/components/animated/Silk";

const DashboardLayout = ({ children }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-gray-950 overflow-hidden">
      {/* Silk Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={4}
          scale={0.8}
          color="#4D0366"
          noiseIntensity={0.8}
          rotation={0.3}
        />
        {/* Subtle overlay to ensure content readability */}
        <div className="absolute inset-0 bg-gray-950/40" />
      </div>

      {/* Sidebar */}
      <Sidebar onPopupChange={setPopupOpen} />

      {/* Right Content Area - Hidden on mobile, visible on md and up */}
      <main className="hidden md:fixed md:inset-0 md:z-20 md:flex md:items-stretch md:left-4 md:top-4 md:bottom-4 md:right-4 md:ml-76">
        {/* Popup Overlay - covers only the content area */}
        {popupOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Content Container - glassmorphic floating window */}
        <div className="w-full">
          <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl md:rounded-3xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 p-4 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Content - Full screen on mobile, hidden on md and up */}
      <div className="fixed inset-0 md:hidden z-10 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
