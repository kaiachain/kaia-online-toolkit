import { useState } from 'react'
import { getAddress, isAddress } from 'viem'
import { ethers } from 'ethers'
import { Web3 } from 'web3'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { useLoadingState } from '../independent'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseAddressChecksumPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  verifyAddress: () => void
  loading: boolean
  result: SdkObject
}

export const useAddressChecksumPage = (): UseAddressChecksumPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const { loading, withLoading } = useLoadingState()

  const verifyAddress = () => {
    const res = { ...result }
    
    withLoading(async () => {
      try {
        if (!address) {
          toast.error('Please enter an address')
          return
        }

        if (sdk === 'viem') {
          const isValid = isAddress(address)
          if (!isValid) {
            res[sdk] = 'Invalid address format'
          } else {
            const checksumAddress = getAddress(address)
            res[sdk] = `Valid address\nChecksum format: ${checksumAddress}`
          }
        } else if (sdk === 'ethers') {
          const isValid = ethers.isAddress(address)
          if (!isValid) {
            res[sdk] = 'Invalid address format'
          } else {
            const checksumAddress = ethers.getAddress(address)
            res[sdk] = `Valid address\nChecksum format: ${checksumAddress}`
          }
        } else if (sdk === 'web3') {
          const web3 = new Web3()
          const isValid = web3.utils.isAddress(address)
          if (!isValid) {
            res[sdk] = 'Invalid address format'
          } else {
            const checksumAddress = web3.utils.toChecksumAddress(address)
            res[sdk] = `Valid address\nChecksum format: ${checksumAddress}`
          }
        } else {
          toast('Not supported with this SDK')
        }
      } catch (error) {
        if (error instanceof Error) {
          res[sdk] = error.message
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
    verifyAddress,
    loading,
    result,
  }
}
