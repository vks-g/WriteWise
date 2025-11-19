'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Sections/Navbar'
import Hero from '@/components/Sections/Hero'
import AiShowcase from '@/components/Sections/AiShowcase'
import FeaturedGallery from '@/components/Sections/FeaturedGallery'
import USPSection from '@/components/Sections/USPSections'
import Footer from '@/components/Sections/Footer'
import Aurora from '@/components/animated/Aurora'

export default function Page() {

  return (
    <div className="relative min-h-screen w-full bg-background dark:bg-background overflow-x-hidden">
      {/* Aurora background for entire page - stays behind everything */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Aurora
          colorStops={['#7332e3', '#9f20e3', '#e31b9d']}
          amplitude={0.6}
          blend={0.5}
        />
      </div>

      {/* Uniform black blur overlay - transparent at top for navbar/hero */}
      <div className="fixed inset-0 z-1 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.3) 100%)',
        backdropFilter: 'blur(4px)'
      }} />

      {/* Content wrapper - components rendered cleanly on top */}
      <div className="relative z-10">
        {/* Navigation with top spacing */}
        <div className="mt-10 sm:mt-14 lg:mt-18">
          <Navbar />
        </div>

        {/* Hero Section */}
        <Hero />

        {/* AI Showcase Section */}
        <AiShowcase />

        {/* Featured Gallery Section */}
        <FeaturedGallery />

        {/* USP Section */}
        <USPSection />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}