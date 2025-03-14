import { EvmChainIdEnum } from '@/consts'
import { createPublicClient, http } from 'viem'
import { kaia, kairos, mainnet, sepolia } from 'viem/chains'

export type UseViemReturn = {
  client: ReturnType<typeof createPublicClient>
}

const chains = {
  [EvmChainIdEnum.ETHEREUM]: mainnet,
  [EvmChainIdEnum.SEPOLIA]: sepolia,
  [EvmChainIdEnum.KAIA]: kaia,
  [EvmChainIdEnum.KAIROS]: kairos,
}

export const useViem = ({
  chainId,
}: {
  chainId: EvmChainIdEnum
}): UseViemReturn => {
  const client = createPublicClient({
    chain: chains[chainId],
    transport: http(),
  })

  return { client }
}
