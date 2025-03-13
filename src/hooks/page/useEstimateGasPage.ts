import { useState } from 'react'
import { toast } from 'react-toastify'
import { JsonRpcProvider } from 'ethers'
import { Web3 } from 'web3'
import { Wallet } from '@kaiachain/ethers-ext/v6'
import { Web3 as KaiaWeb3 } from '@kaiachain/web3js-ext'

import { SdkObject, SdkType } from '@/types'
import { parseError, stringify, UTIL } from '@/common'
import { useNetwork, useViem } from '../independent'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseEstimateGasPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  txData: string
  setTxData: React.Dispatch<React.SetStateAction<string>>
  estimateGas: () => Promise<void>
  result: SdkObject
}

interface ParsedTx {
  account?: string
  from?: string
  data?: string
  input?: string
  gasPrice?: string
  to?: string
  value?: string
  blockNumber?: string
  gas?: string
}

const txDataExample = `{
  "from": "0x3f71029af4e252b25b9ab999f77182f0cd3bc085",
  "to": "0x87ac99835e67168d4f9a40580f8f5c33550ba88b",
  "gas": "0x100000",
  "gasPrice": "0x5d21dba00",
  "value": "0x0",
  "data": "0x8ada066e"
}`

export const useEstimateGasPage = (): UseEstimateGasPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [txData, setTxData] = useState(txDataExample)
  const [result, setResult] = useState(DefaultSdkObject)
  const { chainId } = useNetwork()
  const { client } = useViem({ chainId })
  const { rpcUrl } = useNetwork()

  const createBaseTxRequest = (parsedTx: ParsedTx) => {
    const txRequest: any = {}

    if (parsedTx.from) txRequest.from = parsedTx.from
    if (parsedTx.to) txRequest.to = parsedTx.to
    if (parsedTx.data || parsedTx.input)
      txRequest.data = parsedTx.data || parsedTx.input
    if (parsedTx.value) txRequest.value = parsedTx.value
    if (parsedTx.gasPrice) txRequest.gasPrice = parsedTx.gasPrice

    return txRequest
  }

  const estimateGasWithViem = async (parsedTx: ParsedTx) => {
    const txRequest: any = {
      account: parsedTx.account || parsedTx.from,
    }

    if (parsedTx.to) txRequest.to = parsedTx.to
    if (parsedTx.data || parsedTx.input)
      txRequest.data = parsedTx.data || parsedTx.input
    if (parsedTx.value) txRequest.value = BigInt(parsedTx.value)
    if (parsedTx.gasPrice) txRequest.gasPrice = BigInt(parsedTx.gasPrice)
    if (parsedTx.blockNumber)
      txRequest.blockNumber = BigInt(parsedTx.blockNumber)

    return stringify(await client.estimateGas(txRequest))
  }

  const estimateGasWithEthers = async (parsedTx: ParsedTx) => {
    const provider = new JsonRpcProvider(rpcUrl)
    const txRequest = createBaseTxRequest(parsedTx)

    if (parsedTx.gas) txRequest.gasLimit = parsedTx.gas

    return stringify(await provider.estimateGas(txRequest))
  }

  const estimateGasWithWeb3 = async (parsedTx: ParsedTx) => {
    const web3 = new Web3(rpcUrl)
    const txRequest = createBaseTxRequest(parsedTx)

    return stringify(await web3.eth.estimateGas(txRequest))
  }

  const estimateGasWithEthersExt = async (parsedTx: ParsedTx) => {
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(parsedTx.from || '', provider)
    const txRequest = createBaseTxRequest(parsedTx)

    if (parsedTx.gas) txRequest.gasLimit = parsedTx.gas

    return stringify(await wallet.estimateGas(txRequest))
  }

  const estimateGasWithWeb3Ext = async (parsedTx: ParsedTx) => {
    const provider = new KaiaWeb3.providers.HttpProvider(rpcUrl)
    const web3 = new KaiaWeb3(provider)
    const txRequest = createBaseTxRequest(parsedTx)

    return stringify(await web3.eth.estimateGas(txRequest))
  }

  const estimateGasFunc = async () => {
    const res = { ...result }
    try {
      if (!txData) {
        toast.error('Please enter transaction data')
        return
      }

      const parsedTx = UTIL.jsonTryParse(txData) as ParsedTx
      if (!parsedTx || typeof parsedTx !== 'object') {
        toast.error('Invalid transaction data format')
        return
      }

      if (sdk === 'viem') {
        res[sdk] = await estimateGasWithViem(parsedTx)
        toast.success('Gas estimation completed successfully')
      } else if (sdk === 'ethers') {
        res[sdk] = await estimateGasWithEthers(parsedTx)
        toast.success('Gas estimation completed successfully')
      } else if (sdk === 'web3') {
        res[sdk] = await estimateGasWithWeb3(parsedTx)
        toast.success('Gas estimation completed successfully')
      } else if (sdk === 'ethersExt') {
        res[sdk] = await estimateGasWithEthersExt(parsedTx)
        toast.success('Gas estimation completed successfully')
      } else if (sdk === 'web3Ext') {
        res[sdk] = await estimateGasWithWeb3Ext(parsedTx)
        toast.success('Gas estimation completed successfully')
      } else {
        toast.warning('Unsupported SDK type')
      }
    } catch (error) {
      res[sdk] = parseError(error)
      toast.error('Gas estimation failed')
    }
    setResult(res)
  }

  return {
    sdk,
    setSdk,
    txData,
    setTxData,
    estimateGas: estimateGasFunc,
    result,
  }
}
