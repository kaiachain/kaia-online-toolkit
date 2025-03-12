import { useState } from 'react'
import { createPublicClient, http } from 'viem'
import { JsonRpcProvider } from 'ethers'
import { Web3 } from 'web3'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { parseError, stringify } from '@/common'
import { useNetwork } from '../independent'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseBlockInfoPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  blockQuery: string
  setBlockQuery: React.Dispatch<React.SetStateAction<string>>
  getBlockInfo: () => Promise<void>
  result: SdkObject
}

export const useBlockInfoPage = (): UseBlockInfoPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('ethers')
  const [blockQuery, setBlockQuery] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const { rpcUrl } = useNetwork()

  const getBlockInfo = async () => {
    const res = { ...result }
    try {
      if (!blockQuery) {
        toast.error('Please enter a block number or hash')
        return
      }

      // Determine if the query is a block hash or number
      const isBlockHash = blockQuery.startsWith('0x') && blockQuery.length === 66
      const blockIdentifier = isBlockHash ? blockQuery : parseInt(blockQuery)

      if (sdk === 'ethers') {
        const provider = new JsonRpcProvider(rpcUrl)
        const block = await provider.getBlock(blockIdentifier)
        res[sdk] = stringify(block)
      } else if (sdk === 'web3') {
        const web3 = new Web3(rpcUrl)
        const block = await web3.eth.getBlock(blockIdentifier)
        res[sdk] = stringify(block)
      } else if (sdk === 'viem') {
        const client = createPublicClient({
          transport: http(rpcUrl),
        })
        let block;
        if (isBlockHash) {
          block = await client.getBlock({
            blockHash: blockIdentifier as `0x${string}`,
          });
        } else {
          block = await client.getBlock({
            blockNumber: BigInt(blockIdentifier as number),
          });
        }
        res[sdk] = stringify(block)
      } else {
        toast('Not supported with this SDK')
      }
    } catch (error) {
      res[sdk] = parseError(error)
    }
    setResult(res)
  }

  return {
    sdk,
    setSdk,
    blockQuery,
    setBlockQuery,
    getBlockInfo,
    result,
  }
}
