import { useEffect, useState } from 'react'
import { toRlp } from 'viem'
import { encodeRlp } from 'ethers'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { parseError, UTIL } from '@/common'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export enum DataTypeEnum {
  STRING_ARRAY = 'string|Array',
  UINT8ARRAY = 'Uint8Array',
}

export type UseRlpEncodePageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  data: string
  setData: React.Dispatch<React.SetStateAction<string>>
  dataType: DataTypeEnum
  setDataType: React.Dispatch<React.SetStateAction<DataTypeEnum>>
  encode: () => Promise<void>
  result: SdkObject
}

export const useRlpEncodePage = (): UseRlpEncodePageReturn => {
  const [sdk, setSdk] = useState<SdkType>('ethers')

  const [data, setData] = useState('[]')
  const [dataType, setDataType] = useState<DataTypeEnum>(
    DataTypeEnum.STRING_ARRAY
  )
  const [result, setResult] = useState(DefaultSdkObject)

  function parseData(data: string): any {
    if (dataType === DataTypeEnum.STRING_ARRAY) {
      const parsed = UTIL.jsonTryParse(data.replace(/'/g, '"'))
      if (Array.isArray(parsed)) {
        return parsed
      }
      return data
    }

    if (dataType === DataTypeEnum.UINT8ARRAY) {
      const cleanedData = data.replace(/[[\]\s]/g, '').split(',')
      const parsed = cleanedData
        .map((h) => parseInt(h, 16))
        .filter((n) => !isNaN(n))
      return new Uint8Array(parsed)
    }

    return data
  }

  const encode = async () => {
    const res = { ...result }
    try {
      const parsed = parseData(data)
      if (sdk === 'ethers') {
        res[sdk] = encodeRlp(parsed)
      } else if (sdk === 'web3') {
        toast('Not supported with web3')
      } else if (sdk === 'viem') {
        res[sdk] = toRlp(parsed)
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
    dataType,
    setDataType,
    encode,
    result,
  }
}
