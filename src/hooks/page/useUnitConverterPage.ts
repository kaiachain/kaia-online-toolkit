import { useState } from 'react'
import { formatUnits } from 'viem'
import { ethers } from 'ethers'
import { utils } from 'web3'
import { fromKei, formatUnits as kaiaFormatUnits } from '@kaiachain/web3js-ext'

import { SdkType } from '@/types'

type UnitObjectType = {
  kei: string
  Gkei: string
  KAIA: string
}

export type UseUnitConverterPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  inputKei: UnitObjectType
  setInputKei: React.Dispatch<React.SetStateAction<UnitObjectType>>
  convertedFromKei: (kei: bigint) => UnitObjectType
}

export const useUnitConverterPage = (): UseUnitConverterPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [inputKei, setInputKei] = useState<UnitObjectType>({
    kei: '',
    Gkei: '',
    KAIA: '',
  })

  const convertedFromKei = (kei: bigint) => {
    let res = {
      kei: '',
      Gkei: '',
      KAIA: '',
    }
    if (sdk === 'viem') {
      res = {
        kei: formatUnits(kei, 0),
        Gkei: formatUnits(kei, 9),
        KAIA: formatUnits(kei, 18),
      }
    } else if (sdk === 'ethers') {
      res = {
        kei: ethers.formatUnits(kei, 0),
        Gkei: ethers.formatUnits(kei, 9),
        KAIA: ethers.formatUnits(kei, 18),
      }
    } else if (sdk === 'web3') {
      res = {
        kei: utils.fromWei(kei, 'wei'),
        Gkei: utils.fromWei(kei, 'gwei'),
        KAIA: utils.fromWei(kei, 'ether'),
      }
    } else if (sdk === 'ethersExt') {
      res = {
        kei: kei.toString(),
        Gkei: kaiaFormatUnits(kei, 9),
        KAIA: kaiaFormatUnits(kei, 18),
      }
    } else if (sdk === 'web3Ext') {
      res = {
        kei: kei.toString(),
        Gkei: fromKei(kei, 'gwei'),
        KAIA: fromKei(kei, 'kaia'),
      }
    }

    return res
  }

  return {
    sdk,
    setSdk,
    inputKei,
    setInputKei,
    convertedFromKei,
  }
}
