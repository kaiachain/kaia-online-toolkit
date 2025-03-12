import { toast } from 'react-toastify'

export type ErrorCategory = 'network' | 'validation' | 'blockchain' | 'unknown'

export interface ErrorDetails {
  message: string
  category: ErrorCategory
  originalError?: unknown
}

/**
 * Categorizes an error into specific types for better error handling
 * @param error The error to categorize
 * @returns ErrorDetails object with message, category, and original error
 */
export const categorizeError = (error: unknown): ErrorDetails => {
  if (error instanceof Error) {
    // Network errors
    if (
      error.message.includes('network') || 
      error.message.includes('connection') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return {
        message: 'Network error. Please check your connection and try again.',
        category: 'network',
        originalError: error,
      }
    }
    
    // Blockchain errors
    if (
      error.message.includes('not found') ||
      error.message.includes('reverted') ||
      error.message.includes('gas') ||
      error.message.includes('nonce') ||
      error.message.includes('execution failed')
    ) {
      return {
        message: error.message,
        category: 'blockchain',
        originalError: error,
      }
    }
    
    // Validation errors
    if (
      error.message.includes('invalid') ||
      error.message.includes('required') ||
      error.message.includes('format') ||
      error.message.includes('expected')
    ) {
      return {
        message: error.message,
        category: 'validation',
        originalError: error,
      }
    }
  }
  
  // Default unknown error
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    category: 'unknown',
    originalError: error,
  }
}

/**
 * Handles an error by categorizing it and displaying an appropriate toast message
 * @param error The error to handle
 * @returns ErrorDetails object with message, category, and original error
 */
export const handleError = (error: unknown): ErrorDetails => {
  const errorDetails = categorizeError(error)
  
  // Display toast based on error category
  switch (errorDetails.category) {
    case 'network':
      toast.error(errorDetails.message)
      break
    case 'blockchain':
      toast.warning(errorDetails.message)
      break
    case 'validation':
      toast.info(errorDetails.message)
      break
    default:
      toast.error(errorDetails.message)
  }
  
  return errorDetails
}

/**
 * Parses an error to a string message
 * @param error The error to parse
 * @returns A string representation of the error
 */
export const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    
    try {
      return JSON.stringify(error)
    } catch {
      return 'An unknown error occurred'
    }
  }
  
  return 'An unknown error occurred'
}
