'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show UI once mounted on client to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9"></div>; // Empty placeholder of same size
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-9 h-9 rounded-full flex items-center justify-center transition-colors
        ${theme === 'dark' 
          ? 'bg-white/10 hover:bg-white/20 text-white' 
          : 'bg-black/10 hover:bg-black/20 text-black'}
        focus:outline-none focus:ring-2 focus:ring-primary
        transform active:scale-95 transition-transform
      `}
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Moon icon for light mode (click to switch to dark)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transform transition-transform duration-300"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      ) : (
        // Sun icon for dark mode (click to switch to light)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transform transition-transform duration-300"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      )}
    </button>
  );
}
