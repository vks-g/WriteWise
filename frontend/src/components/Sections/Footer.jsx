'use client'

import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Posts', href: '/posts' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]

  return (
    <footer className="relative w-full mt-auto bg-gradient-to-b from-transparent via-transparent to-primary/10 dark:to-primary/5 overflow-hidden">
      {/* Subtle aurora glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-primary/5 via-accent/3 to-transparent dark:from-primary/3 dark:via-accent/2 pointer-events-none blur-3xl" />

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Desktop & Tablet Layout */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block">
              <img src="/logo.svg" alt="WriteWise Logo" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
          </div>

          {/* Center: Spacer */}
          <div className="flex-1" />

          {/* Right: Links */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {footerLinks.map((link, index) => ( 
              <div key={link.href} className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                <Link
                  href={link.href}
                  className="
                    text-sm lg:text-base font-medium
                    text-muted-foreground hover:text-foreground
                    transition-colors duration-200
                    px-2 sm:px-3 py-1
                    rounded-md
                    hover:bg-white/5 dark:hover:bg-white/3
                  "
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <div className="w-px h-4 bg-white/10 dark:bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Logo - moved up */}
          <div className="flex justify-center mb-4">
            <Link href="/" className="inline-block">
              <img src="/logo.svg" alt="WriteWise Logo" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {footerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  text-sm font-medium
                  text-muted-foreground hover:text-foreground
                  transition-colors duration-200
                  px-3 py-2
                  rounded-md
                  hover:bg-white/5 dark:hover:bg-white/3
                  active:scale-95
                "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10" />

      {/* Bottom bar with copyright */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
          {/* Left: Copyright */}
          <div className="text-center sm:text-left">
            <p>
              © {currentYear} <span className="font-semibold text-foreground">WriteWise</span>. All rights reserved.
            </p>
          </div>

          {/* Right: Built with love */}
          <div className="text-center sm:text-right">
            <p>
              Built with <span className="text-primary font-semibold">✨</span> for storytellers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
