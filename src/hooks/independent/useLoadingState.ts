import { useState, useCallback } from 'react'

/**
 * A reusable hook for managing loading states in components and pages
 * @returns {UseLoadingStateReturn} Object containing loading state and methods to control it
 */
export type UseLoadingStateReturn = {
  loading: boolean
  startLoading: () => void
  stopLoading: () => void
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [loading, setLoading] = useState(false)

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  /**
   * Executes a function with loading state management
   * @param fn The async function to execute
   * @returns The result of the function execution
   */
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        startLoading()
        return await fn()
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading]
  )

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
