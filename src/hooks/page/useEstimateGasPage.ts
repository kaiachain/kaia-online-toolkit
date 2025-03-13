import { useState } from 'react'
import { toast } from 'react-toastify'

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

interface ViemParsedTx {
  account?: string
  from?: string
  data?: string
  input?: string
  gasPrice?: string
  to?: string
  value?: string
  blockNumber?: string
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

  const estimateGasFunc = async () => {
    const res = { ...result }
    try {
      if (!txData) {
        toast.error('Please enter transaction data')
        return
      }

      if (sdk === 'viem') {
        const parsedTx = UTIL.jsonTryParse(txData) as ViemParsedTx
        if (!parsedTx || typeof parsedTx !== 'object') {
          toast.error('Invalid transaction data format')
          return
        }

        const txRequest: any = {
          account: parsedTx.account || parsedTx.from,
        }

        if (parsedTx.to) txRequest.to = parsedTx.to
        if (parsedTx.data) txRequest.data = parsedTx.data || parsedTx.input
        if (parsedTx.value) txRequest.value = BigInt(parsedTx.value)
        if (parsedTx.gasPrice) txRequest.gasPrice = BigInt(parsedTx.gasPrice)
        if (parsedTx.blockNumber)
          txRequest.blockNumber = BigInt(parsedTx.blockNumber)

        const gasEstimate = await client.estimateGas(txRequest)

        res[sdk] = stringify(gasEstimate)
        toast.success('Gas estimation completed successfully')
      } else {
        toast.warning('Only supported with viem')
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
