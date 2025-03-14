import { useEffect, useState } from 'react'
import { fromRlp } from 'viem'
import { decodeRlp } from 'ethers'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { parseError, stringify } from '@/common'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseRlpDecodePageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  data: string
  setData: React.Dispatch<React.SetStateAction<string>>
  decode: () => Promise<void>
  result: SdkObject
}

export const useRlpDecodePage = (): UseRlpDecodePageReturn => {
  const [sdk, setSdk] = useState<SdkType>('ethers')

  const [data, setData] = useState('')

  const [result, setResult] = useState(DefaultSdkObject)

  const decode = async () => {
    const res = { ...result }
    try {
      if (sdk === 'ethers') {
        res[sdk] = stringify(decodeRlp(data))
      } else if (sdk === 'web3') {
        toast('Not supported with web3')
      } else if (sdk === 'viem') {
        res[sdk] = stringify(fromRlp(data as '0x'))
      }
    } catch (error) {
      res[sdk] = parseError(error)
    }
    setResult(res)
  }

  useEffect(() => {
    setResult(DefaultSdkObject)
  }, [data])

  return {
    sdk,
    setSdk,
    data,
    setData,
    decode,
    result,
  }
}
