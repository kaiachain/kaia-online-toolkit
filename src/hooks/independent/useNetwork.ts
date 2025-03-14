import { useQuery } from '@tanstack/react-query'

import { LocalStorageKey } from '@/common'
import { EvmChainIdEnum, NETWORK } from '@/consts'
import { QueryKeyEnum } from '@/types'
import { useMemo } from 'react'

export type UseNetworkReturn = {
  chainId: EvmChainIdEnum
  changeNetwork: (chainId: EvmChainIdEnum) => void
  rpcUrl: string
}

export const useNetwork = (): UseNetworkReturn => {
  const { data: chainId = EvmChainIdEnum.KAIROS, refetch } = useQuery({
    queryKey: [QueryKeyEnum.NETWORK],
    queryFn: async () => {
      return (localStorage.getItem(LocalStorageKey.NETWORK) ??
        EvmChainIdEnum.KAIROS) as EvmChainIdEnum
    },
  })

  const changeNetwork = (chainId: EvmChainIdEnum) => {
    localStorage.setItem(LocalStorageKey.NETWORK, chainId.toString())
    refetch()
  }

  const rpcUrl = useMemo(
    () => NETWORK.evmChainParams[chainId].rpcUrls[0],
    [chainId]
  )

  return {
    chainId,
    changeNetwork,
    rpcUrl,
  }
}
