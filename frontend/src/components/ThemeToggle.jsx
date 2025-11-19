'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Theme Toggle Component
 * Optional component for manual theme switching
 * Can be added to navbar or settings page in the future
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    const html = document.documentElement
    const newTheme = isDark ? 'light' : 'dark'

    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    localStorage.setItem('theme', newTheme)
    setIsDark(newTheme === 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg font-medium transition-all duration-300
        backdrop-blur-md bg-white/10 dark:bg-black/20
        hover:bg-white/20 dark:hover:bg-black/30
        border border-white/20 dark:border-white/10
        text-foreground hover:shadow-lg
        active:scale-95
      "
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-blue-400" />
      )}
    </button>
  )
}
