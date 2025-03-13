import { useState } from 'react'
import { createPublicClient, http } from 'viem'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { parseError, stringify, UTIL } from '@/common'
import { useNetwork } from '../independent'

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

export const useEstimateGasPage = (): UseEstimateGasPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [txData, setTxData] = useState('{\n  "from": "0x...",\n  "to": "0x...",\n  "data": "0x...",\n  "value": "0x0"\n}')
  const [result, setResult] = useState(DefaultSdkObject)
  const { rpcUrl } = useNetwork()

  const estimateGasFunc = async () => {
    const res = { ...result }
    try {
      if (!txData) {
        toast.error('Please enter transaction data')
        return
      }

      const parsedTx = UTIL.jsonTryParse(txData)
      if (!parsedTx || typeof parsedTx !== 'object') {
        toast.error('Invalid transaction data format')
        return
      }

      if (sdk === 'viem') {
        const client = createPublicClient({
          transport: http(rpcUrl),
        })
        
        const gasEstimate = await client.estimateGas({
          ...parsedTx,
          value: parsedTx.value ? BigInt(parsedTx.value) : undefined,
        })
        
        res[sdk] = stringify(gasEstimate)
      } else {
        toast('Only supported with viem')
      }
    } catch (error) {
      res[sdk] = parseError(error)
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
