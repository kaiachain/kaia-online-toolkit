import { useState, useCallback } from 'react'
import { createPublicClient, http } from 'viem'
import { JsonRpcProvider } from 'ethers'
import { Web3 } from 'web3'

import { useNetwork, useLoadingState } from '@/hooks'
import { SdkType } from '@/types/sdk'
import { handleError } from '@/common/errorHandler'
import { useDefaultSdk } from '@/hooks/independent'

export const useTxHistoryPage = () => {
  const { rpcUrl } = useNetwork()
  const { defaultSdk } = useDefaultSdk()
  const [sdk, setSdk] = useState<SdkType>(defaultSdk)
  const [address, setAddress] = useState<string>('')
  const { loading, withLoading } = useLoadingState()
  const [result, setResult] = useState<Record<SdkType, string>>({
    viem: '',
    ethers: '',
    web3: '',
  })

  const getTxHistoryViem = useCallback(async () => {
    try {
      const client = createPublicClient({
        transport: http(rpcUrl),
      })

      // Get the latest block number
      const blockNumber = await client.getBlockNumber()

      // Get transactions for the last 10 blocks
      const transactions = []
      for (let i = 0; i < 10; i++) {
        if (blockNumber - BigInt(i) < 0) break
        const block = await client.getBlock({
          blockNumber: blockNumber - BigInt(i),
          includeTransactions: true,
        })
        if (block && block.transactions) {
          const filtered = block.transactions.filter(
            (tx) => {
              const from = typeof tx === 'string' ? '' : tx.from.toLowerCase()
              const to = typeof tx === 'string' ? '' : (tx.to ? tx.to.toLowerCase() : '')
              return from === address.toLowerCase() || to === address.toLowerCase()
            }
          )
          transactions.push(...filtered)
        }
      }

      return JSON.stringify(transactions, null, 2)
    } catch (error) {
      return handleError(error, 'Error getting transaction history with viem')
    }
  }, [rpcUrl, address])

  const getTxHistoryEthers = useCallback(async () => {
    try {
      const provider = new JsonRpcProvider(rpcUrl)

      // Get transaction history for an address
      const history = await provider.getHistory(address)
      
      return JSON.stringify(history, null, 2)
    } catch (error) {
      return handleError(error, 'Error getting transaction history with ethers')
    }
  }, [rpcUrl, address])

  const getTxHistoryWeb3 = useCallback(async () => {
    try {
      const web3 = new Web3(rpcUrl)

      // Get the latest block number
      const blockNumber = await web3.eth.getBlockNumber()

      // Get transactions for the last 10 blocks
      const transactions = []
      for (let i = 0; i < 10; i++) {
        if (blockNumber - i < 0) break
        const block = await web3.eth.getBlock(blockNumber - i, true)
        if (block && block.transactions) {
          const filtered = block.transactions.filter(
            (tx) => 
              tx.from.toLowerCase() === address.toLowerCase() || 
              (tx.to && tx.to.toLowerCase() === address.toLowerCase())
          )
          transactions.push(...filtered)
        }
      }

      return JSON.stringify(transactions, null, 2)
    } catch (error) {
      return handleError(error, 'Error getting transaction history with web3')
    }
  }, [rpcUrl, address])

  const getTxHistory = useCallback(async () => {
    if (!address) {
      setResult((prev) => ({
        ...prev,
        [sdk]: 'Please enter an address',
      }))
      return
    }

    await withLoading(async () => {
      let txHistoryResult = ''

      if (sdk === 'viem') {
        txHistoryResult = await getTxHistoryViem()
      } else if (sdk === 'ethers') {
        txHistoryResult = await getTxHistoryEthers()
      } else if (sdk === 'web3') {
        txHistoryResult = await getTxHistoryWeb3()
      }

      setResult((prev) => ({
        ...prev,
        [sdk]: txHistoryResult,
      }))
    })
  }, [sdk, address, withLoading, getTxHistoryViem, getTxHistoryEthers, getTxHistoryWeb3])

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
