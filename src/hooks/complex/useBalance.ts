import { isAddress } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { dToken, QueryKeyEnum } from '@/types'
import { useNetwork, useViem } from '../independent'

export type UseBalanceReturn = {
  balance?: dToken | null
  refetch: () => void
}

export const useBalance = ({
  address,
}: {
  address?: string
}): UseBalanceReturn => {
  const { chainId } = useNetwork()
  const { client } = useViem({ chainId })

  const { data: balance, refetch } = useQuery({
    queryKey: [QueryKeyEnum.BALANCE, chainId, address],
    queryFn: async () => {
      if (address && isAddress(address)) {
        const bal = await client.getBalance({ address })
        return bal.toString() as dToken
      }
    },
    enabled: !!address && isAddress(address),
  })

  return { balance, refetch }
}
