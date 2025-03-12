import { useState } from 'react'
import { createPublicClient, http } from 'viem'
import { JsonRpcProvider } from 'ethers'
import { Web3 } from 'web3'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { stringify } from '@/common'
import { useLoadingState, useNetwork } from '../independent'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseTxHistoryPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  getTxHistory: () => Promise<void>
  loading: boolean
  result: SdkObject
}

export const useTxHistoryPage = (): UseTxHistoryPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const { loading, withLoading } = useLoadingState()
  const { rpcUrl } = useNetwork()

  const getTxHistory = async () => {
    const res = { ...result }
    await withLoading(async () => {
      try {
        if (!address) {
          toast.error('Please enter an address')
          return
        }

        if (sdk === 'ethers') {
          const provider = new JsonRpcProvider(rpcUrl)
          // Get the latest block number
          const blockNumber = await provider.getBlockNumber()
          // Get transactions for the last 10 blocks
          const transactions = []
          for (let i = 0; i < 10; i++) {
            if (Number(blockNumber) - i < 0) break
            const block = await provider.getBlock(Number(blockNumber) - i)
            if (block) {
              const txHashes = block.transactions
              for (const txHash of txHashes) {
                const tx = await provider.getTransaction(txHash)
                if (tx && (
                  tx.from.toLowerCase() === address.toLowerCase() || 
                  (tx.to && tx.to.toLowerCase() === address.toLowerCase())
                )) {
                  transactions.push(tx)
                }
              }
            }
          }
          res[sdk] = stringify(transactions)
        } else if (sdk === 'web3') {
          const web3 = new Web3(rpcUrl)
          // Get the latest block number
          const blockNumber = await web3.eth.getBlockNumber()
          // Get transactions for the last 10 blocks
          const transactions = []
          for (let i = 0; i < 10; i++) {
            if (Number(blockNumber) - i < 0) break
            const block = await web3.eth.getBlock(Number(blockNumber) - i, true)
            if (block && block.transactions) {
              const filtered = block.transactions.filter((tx: any) => 
                tx.from.toLowerCase() === address.toLowerCase() || 
                (tx.to && tx.to.toLowerCase() === address.toLowerCase())
              )
              transactions.push(...filtered)
            }
          }
          res[sdk] = stringify(transactions)
        } else if (sdk === 'viem') {
          const client = createPublicClient({
            transport: http(rpcUrl),
          })
          // Get the latest block number
          const blockNumber = await client.getBlockNumber()
          // Get transactions for the last 10 blocks
          const transactions = []
          for (let i = 0n; i < 10n; i++) {
            if (blockNumber - i < 0n) break
            const block = await client.getBlock({
              blockNumber: blockNumber - i,
              includeTransactions: true,
            })
            if (block && block.transactions) {
              const filtered = block.transactions.filter((tx) => {
                if (typeof tx === 'string') return false
                return (
                  tx.from.toLowerCase() === address.toLowerCase() || 
                  (tx.to && tx.to.toLowerCase() === address.toLowerCase())
                )
              })
              transactions.push(...filtered)
            }
          }
          res[sdk] = stringify(transactions)
        } else {
          toast('Not supported with this SDK')
        }
      } catch (error) {
        if (error instanceof Error) {
          res[sdk] = `ERROR: ${error.message}`
        } else {
          res[sdk] = 'An unknown error occurred'
        }
      }
      setResult(res)
    })
  }

  return {
    sdk,
    setSdk,
    address,
    setAddress,
    getTxHistory,
    loading,
    result,
  }
}
