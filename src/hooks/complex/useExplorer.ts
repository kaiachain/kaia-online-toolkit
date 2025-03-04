import { useNetwork } from '../independent'
import { EvmChainIdEnum } from '@/consts'

export type UseExplorerReturn = {
  getExplorerLink: (props: {
    address: string
    type: 'tx' | 'address'
  }) => string
}
const uris: Record<EvmChainIdEnum, string> = {
  [EvmChainIdEnum.ETHEREUM]: 'https://etherscan.io',
  [EvmChainIdEnum.KAIA]: 'https://kaiascan.io',
  [EvmChainIdEnum.KAIROS]: 'https://kairos.kaiascan.io',
  [EvmChainIdEnum.SEPOLIA]: 'https://sepolia.etherscan.io',
}
export const useExplorer = (): UseExplorerReturn => {
  const { chainId } = useNetwork()

  const getExplorerLink = ({
    address,
    type,
  }: {
    address: string
    type: 'tx' | 'address'
  }): string => `${uris[chainId]}/${type}/${address} `

  return { getExplorerLink }
}
