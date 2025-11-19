// This script must run BEFORE hydration to avoid flash of light mode
export default function ThemeScript() {
  const scriptContent = `
    (function() {
      try {
        // Check if theme is saved in localStorage
        const theme = localStorage.getItem('theme');
        
        // If no theme is saved, default to 'dark'
        if (!theme) {
          localStorage.setItem('theme', 'dark');
          document.documentElement.classList.add('dark');
        } else if (theme === 'dark') {
          // Apply dark mode if it's explicitly set
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          // Remove dark mode class if light theme is set
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // Fallback to dark mode if localStorage fails
        document.documentElement.classList.add('dark');
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  )
}
