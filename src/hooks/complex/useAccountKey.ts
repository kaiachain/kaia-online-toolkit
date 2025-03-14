import { isAddress } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { AccountKeyType as KaiaAccountKeyType } from '@kaiachain/web3js-ext'

import { AccountKeyType, QueryKeyEnum } from '@/types'
import { useNetwork, useViem } from '../independent'
import { useMemo } from 'react'

export type UseAccountKeyReturn = {
  accountKey?: AccountKeyType
  accountKeyName?: string
  refetch: () => void
}

export const useAccountKey = ({
  address,
}: {
  address?: string
}): UseAccountKeyReturn => {
  const { chainId } = useNetwork()
  const { client } = useViem({ chainId })

  const { data: accountKey, refetch } = useQuery({
    queryKey: [QueryKeyEnum.ACCOUNT_KEY, chainId, address],
    queryFn: async () => {
      if (address && isAddress(address)) {
        return (await client.request({
          method: 'kaia_getAccountKey',
          params: [address, 'latest'],
        })) as AccountKeyType
      }
    },
    enabled: !!address && isAddress(address),
  })

  const accountKeyName = useMemo(() => {
    if (!accountKey || typeof accountKey === 'string') {
      return
    }

    switch (accountKey.keyType) {
      case KaiaAccountKeyType.Fail:
        return 'AccountKeyFail'
      case KaiaAccountKeyType.Legacy:
        return 'AccountKeyLegacy'
      case KaiaAccountKeyType.Public:
        return 'AccountKeyPublic'
      case KaiaAccountKeyType.RoleBased:
        return 'AccountKeyRoleBased'
      case KaiaAccountKeyType.WeightedMultiSig:
        return 'AccountKeyWeightedMultiSig'
      default:
        return
    }
  }, [accountKey])

  return {
    accountKey,
    accountKeyName,
    refetch,
  }
}
