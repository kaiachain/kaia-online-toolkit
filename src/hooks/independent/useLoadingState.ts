import { useState, useCallback } from 'react'

export type UseLoadingStateReturn = {
  loading: boolean
  setLoading: (isLoading: boolean) => void
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [loading, setLoading] = useState(false)

  /**
   * Executes a function with loading state management
   * Sets loading to true before execution and false after completion (even if there's an error)
   */
  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await fn()
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    setLoading,
    withLoading
  }
}
