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

      {/* Right Content Area */}
      <main className="fixed inset-0 lg:left-4 lg:top-4 lg:bottom-4 lg:right-4 lg:ml-76 z-20 flex items-stretch">
        {/* Popup Overlay - covers only the content area */}
        {popupOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Content Container - glassmorphic floating window */}
        <div className="w-full">
          <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
