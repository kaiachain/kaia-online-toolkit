import { useMemo } from 'react'
import { isAddress } from 'viem'

import { UTIL } from '@/common'

export type UseValidatorReturn = {
  errorMessage: string
}

export const useValidator = ({
  value,
  type,
}: {
  value?: string
  type: 'privateKey' | 'address'
}): UseValidatorReturn => {
  const errorMessage = useMemo(() => {
    if (!value) return ''

    if (type === 'address') {
      if (!isAddress(value)) {
        return 'Invalid address'
      }
    } else if (type === 'privateKey') {
      if (!UTIL.isValidPrivateKey(value)) {
        return 'Invalid private key'
      }
    }
    return ''
  }, [value, type])

  return { errorMessage }
}
