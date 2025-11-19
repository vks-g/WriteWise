'use client'

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
  
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Aurora
          colorStops={['#7332e3', '#9f20e3', '#e31b9d']}
          amplitude={0.6}
          blend={0.5}
        />
      </div>

  
      <div className="fixed inset-0 z-1 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.3) 100%)',
        backdropFilter: 'blur(4px)'
      }} />


      <div className="relative z-10">

        <div className="mt-10 sm:mt-14 lg:mt-18">
          <Navbar />
        </div>

        <Hero />

        <AiShowcase />

        <FeaturedGallery />

        <USPSection />

        <Footer />

      </div>
    </div>
  )
}