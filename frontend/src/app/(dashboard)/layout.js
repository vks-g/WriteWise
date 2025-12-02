"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Silk from "@/components/animated/Silk";

const DashboardLayout = ({ children }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-gray-950">
      {/* Silk Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={1.5}
          scale={0.8}
          color="#4D0366"
          noiseIntensity={0.6}
          rotation={0.2}
        />
        {/* Subtle overlay to ensure content readability */}
        <div className="absolute inset-0 bg-gray-950/40" />
      </div>

      {/* Sidebar */}
      <Sidebar onPopupChange={setPopupOpen} />

      {/* Right Content Area */}
      <main className="lg:ml-72 min-h-screen relative z-10">
        {/* Popup Overlay - covers only the content area */}
        {popupOpen && (
          <div
            className="fixed inset-0 lg:left-72 bg-black/40 z-30 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Content Container - full height, scrollable, padded */}
        <div className="min-h-screen overflow-y-auto p-4 pt-20 lg:pt-8 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
