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
  loading: boolean
  result: SdkObject
}

export const useBlockInfoPage = (): UseBlockInfoPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [blockQuery, setBlockQuery] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const [loading, setLoading] = useState(false)
  const { rpcUrl } = useNetwork()

  const getBlockInfo = async () => {
    const res = { ...result }
    setLoading(true)
    try {
      if (!blockQuery) {
        toast.error('Please enter a block number or hash')
        return
      }

      // Determine if the query is a block hash or number
      const isBlockHash = blockQuery.startsWith('0x') && blockQuery.length === 66
      
      // Validate block number format if not a hash
      if (!isBlockHash && isNaN(parseInt(blockQuery))) {
        toast.error('Invalid block number format')
        return
      }
      
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
        if (isBlockHash && typeof blockIdentifier === 'string') {
          block = await client.getBlock({
            blockHash: blockIdentifier as `0x${string}`,
          });
        } else if (!isBlockHash && typeof blockIdentifier === 'number') {
          block = await client.getBlock({
            blockNumber: BigInt(blockIdentifier),
          });
        } else {
          throw new Error('Invalid block identifier type');
        }
        res[sdk] = stringify(block)
      } else {
        toast('Not supported with this SDK')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res[sdk] = `Block ${blockQuery} not found. Please check the block number or hash.`
        } else {
          res[sdk] = parseError(error)
        }
      } else {
        res[sdk] = parseError(error)
      }
    } finally {
      setLoading(false)
    }
    setResult(res)
  }

  return {
    sdk,
    setSdk,
    blockQuery,
    setBlockQuery,
    getBlockInfo,
    loading,
    result,
  }
}
