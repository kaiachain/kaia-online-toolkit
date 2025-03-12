import { useState, useEffect, useCallback } from 'react'
import { LocalStorageKey } from '../../common/storage'
import { SdkType } from '../../types/sdk'

export const useDefaultSdk = () => {
  const [defaultSdk, setDefaultSdkState] = useState<SdkType>(() => {
    // Get default SDK from localStorage or use 'viem' as fallback
    const savedSdk = localStorage.getItem(LocalStorageKey.DEFAULT_SDK) as SdkType | null
    return savedSdk || 'viem'
  })

  // Update localStorage when default SDK changes
  useEffect(() => {
    localStorage.setItem(LocalStorageKey.DEFAULT_SDK, defaultSdk)
  }, [defaultSdk])

  // Set default SDK function
  const setDefaultSdk = useCallback((sdk: SdkType) => {
    setDefaultSdkState(sdk)
  }, [])

  return {
    defaultSdk,
    setDefaultSdk
  }
}
