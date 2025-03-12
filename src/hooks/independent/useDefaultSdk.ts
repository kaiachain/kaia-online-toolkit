import { useState, useEffect } from 'react'
import { SdkType } from '@/types'
import { LocalStorageKey } from '@/common'

export type UseDefaultSdkReturn = {
  defaultSdk: SdkType
  setDefaultSdk: (sdk: SdkType) => void
}

export const useDefaultSdk = (): UseDefaultSdkReturn => {
  const [defaultSdk, setDefaultSdkState] = useState<SdkType>('viem')

  useEffect(() => {
    const savedSdk = localStorage.getItem(LocalStorageKey.DEFAULT_SDK) as SdkType | null
    if (savedSdk) {
      setDefaultSdkState(savedSdk)
    }
  }, [])

  const setDefaultSdk = (sdk: SdkType) => {
    localStorage.setItem(LocalStorageKey.DEFAULT_SDK, sdk)
    setDefaultSdkState(sdk)
  }

  return {
    defaultSdk,
    setDefaultSdk,
  }
}
