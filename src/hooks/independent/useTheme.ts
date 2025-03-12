import { useState, useEffect, useCallback } from 'react'
import { LocalStorageKey } from '../../common/storage'

export type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Get theme from localStorage or use system preference as fallback
    const savedTheme = localStorage.getItem(LocalStorageKey.THEME) as ThemeMode | null
    
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(LocalStorageKey.THEME, theme)
    
    // Add or remove dark class from document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [theme])

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  // Set theme function
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }, [])

  return {
    theme,
    toggleTheme,
    setTheme,
    isDarkTheme: theme === 'dark',
    isLightTheme: theme === 'light'
  }
}
