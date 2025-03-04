import { useMemo } from 'react'

import { EvmChainIdEnum, NETWORK } from '@/consts'
import { SDKProvider, useSDK } from '@metamask/sdk-react'
import { ResultFormType } from '@/types'

export type UseMetamaskReturn = {
  provider?: SDKProvider
  chainId?: string
  isInstalled: boolean
  connected: boolean
  switchNetwork: (chainId: EvmChainIdEnum) => Promise<ResultFormType>
  connect: () => Promise<ResultFormType>
  disconnect: () => Promise<ResultFormType>
}

export const useMetamask = (): UseMetamaskReturn => {
  const { sdk, provider, connected, chainId } = useSDK()
  const isInstalled = useMemo(() => !!provider, [provider])

  const switchNetwork = async (
    chainId: EvmChainIdEnum
  ): Promise<ResultFormType> => {
    if (!provider) {
      return { success: false, error: 'Provider not found' }
    }

    try {
      // Request switching network
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      return { success: true }
    } catch (error: any) {
      if (
        // Extension: https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_switchethereumchain/
        error.code === 4902 ||
        // Mobile: https://docs.metamask.io/services/reference/scroll/json-rpc-methods/#json-rpc-errors
        error.code === -32603
      ) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK.evmChainParams[chainId]],
          })
          return { success: true }
        } catch (addError) {
          return { success: false, error: addError }
        }
      } else {
        return { success: false, error }
      }
    }
  }

  const connect = async (): Promise<ResultFormType> => {
    try {
      await sdk?.connect()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const disconnect = async (): Promise<ResultFormType> => {
    try {
      await sdk?.disconnect()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    provider,
    chainId,
    connected,
    isInstalled,
    switchNetwork,
    connect,
    disconnect,
  }
}
