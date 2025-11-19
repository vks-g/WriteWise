'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import GooeyNav from '@/components/animated/GooeyNav'
import GradualBlur from '@/components/animated/GradualBlur'
import ProfileCard from '@/components/animated/ProfileCard/ProfileCard'
import { useAuth } from '@/context/AuthContext'

const Navbar = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const searchInputRef = useRef(null)
  const modalRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  // Handle modal close on escape key and outside click
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsAboutOpen(false)
      }
    }

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsAboutOpen(false)
      }
    }

    if (isAboutOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleOutsideClick)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('mousedown', handleOutsideClick)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isAboutOpen])

  // Handle logo click
  const handleLogoClick = (e) => {
    e.preventDefault()
    const isHomepage = window.location.pathname === '/'
    if (isHomepage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

  // Handle About button click
  const handleAboutClick = () => {
    setIsAboutOpen(true)
  }

  // Handle search input click (UI only, no logic)
  const handleSearchClick = () => {
    setIsSearchExpanded(true)
  }

  // Custom Glass Button Component
  const GlassButton = ({ onClick, children, className = '', ...props }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-300
        backdrop-blur-md bg-white/10 dark:bg-black/20
        hover:bg-white/20 dark:hover:bg-black/30
        text-foreground hover:shadow-lg
        active:scale-95
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )

  // Desktop Navbar
  if (!isMobile) {
    return (
      <>
        <nav className="relative z-50 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 pt-4">
              {/* Left: Logo */}
              <div className="flex-shrink-0 mt-2">
                <button
                  onClick={handleLogoClick}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img src="/logo.svg" alt="WriteWise Logo" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
                </button>
              </div>

              {/* Center: GooeyNav with Center Buttons */}
              <div className="flex-1 flex justify-center">
                <div className="px-11 py-3 rounded-full backdrop-blur-md bg-white/20 dark:bg-white/10 transition-colors duration-700" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                  <div className="flex gap-7">
                    <button
                      onClick={handleAboutClick}
                      className="px-6 py-2 text-lg font-medium text-foreground hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                    >
                      About
                    </button>
                    <button className="px-6 py-2 text-lg font-medium text-foreground hover:text-cyan-400 transition-colors duration-300 cursor-pointer">
                      <Link href="/posts">Posts</Link>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Auth or Dashboard */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-out
                    ${isSearchExpanded ? 'w-56' : 'w-0'}
                  `}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search posts..."
                      className={`
                        w-full px-4 py-2 rounded-lg font-medium
                        backdrop-blur-md bg-white/10 dark:bg-black/20
                        text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:bg-white/20 dark:focus:bg-black/30
                        transition-all duration-300
                      `}
                      onBlur={() => setTimeout(() => setIsSearchExpanded(false), 150)}
                    />
                  </div>
                  <button
                    onClick={handleSearchClick}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                </div>

                {/* Auth Buttons */}
                {user ? (
                  <Link href="/dashboard">
                    <GlassButton className="text-sm">
                      Dashboard
                    </GlassButton>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <GlassButton className="text-sm">
                      Register / Sign In
                    </GlassButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* About Modal - shared for both desktop and mobile */}
        {isAboutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Background overlay - heavily blurred and dimmed */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsAboutOpen(false)}
            />

            {/* Modal container */}
            <div
              ref={modalRef}
              className="
                relative z-10 bg-background dark:bg-black rounded-2xl shadow-2xl
                w-full sm:w-[85%] lg:w-[75%] max-h-[90vh]
                overflow-y-auto
                animate-in fade-in scale-95 duration-300
              "
            >
              {/* Close button */}
              <button
                onClick={() => setIsAboutOpen(false)}
                className="
                  absolute top-4 right-4 z-20
                  p-2 rounded-lg
                  text-muted-foreground hover:text-foreground
                  hover:bg-white/10 dark:hover:bg-white/5
                  transition-colors cursor-pointer
                "
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* ProfileCard content */}
              <div className="p-6 sm:p-10 lg:p-12">
                <ProfileCard
                  name="WriteWise Platform"
                  title="AI-Powered Writing Assistant"
                  handle="writewise"
                  status="Innovating"
                  avatarUrl="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=200&h=200&fit=crop"
                  showUserInfo={true}
                  enableTilt={true}
                  enableMobileTilt={false}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Mobile Navbar
  return (
    <>
      <nav className="relative z-50 bg-transparent">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity mt-1"
          >
            <img src="/logo.svg" alt="WriteWise Logo" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Slide-in Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full mt-11 ml-1 mr-1 left-0 right-0 backdrop-blur-md bg-background/50 dark:bg-black/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 space-y-3">
              {/* Center Buttons */}
              <GlassButton
                onClick={() => {
                  handleAboutClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-sm"
              >
                About
              </GlassButton>
              <Link href="/posts" className="block">
                <GlassButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-sm"
                >
                  Posts
                </GlassButton>
              </Link>

              {/* Divider */}
              <div className="my-2" />

                  {/* Auth Button */}
                  {user ? (
                    <Link href="/dashboard" className="block">
                      <GlassButton
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-sm"
                      >
                        Dashboard
                      </GlassButton>
                    </Link>
                  ) : (
                    <Link href="/signup" className="block">
                      <GlassButton
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-sm"
                      >
                        Sign In
                      </GlassButton>
                    </Link>
                  )}

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className={`
                    w-full px-4 py-2 rounded-lg font-medium
                    backdrop-blur-md bg-white/10 dark:bg-black/20
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:bg-white/20 dark:focus:bg-black/30
                    transition-all duration-300
                  `}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* About Modal - shared for both desktop and mobile */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Background overlay - heavily blurred and dimmed */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsAboutOpen(false)}
          />

          {/* Modal container */}
          <div
            ref={modalRef}
            className="
              relative z-10 bg-background dark:bg-black rounded-2xl shadow-2xl
              w-full sm:w-[85%] lg:w-[75%] max-h-[90vh]
              overflow-y-auto
              animate-in fade-in scale-95 duration-300
            "
          >
            {/* Close button */}
            <button
              onClick={() => setIsAboutOpen(false)}
              className="
                absolute top-4 right-4 z-20
                p-2 rounded-lg
                text-muted-foreground hover:text-foreground
                hover:bg-white/10 dark:hover:bg-white/5
                transition-colors
              "
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* ProfileCard content */}
            <div className="p-6 sm:p-10 lg:p-12">
              <ProfileCard
                name="WriteWise Platform"
                title="AI-Powered Writing Assistant"
                handle="writewise"
                status="Innovating"
                avatarUrl="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=200&h=200&fit=crop"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Navbar
