import { useState } from 'react'
import { verifyMessage, recoverMessageAddress } from 'viem'
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

export type UseSignVerifyPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  signature: string
  setSignature: React.Dispatch<React.SetStateAction<string>>
  verifySignature: () => Promise<void>
  loading: boolean
  result: SdkObject
}

export const useSignVerifyPage = (): UseSignVerifyPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const { loading, withLoading } = useLoadingState()

  const verifySignature = async () => {
    const res = { ...result }
    
    await withLoading(async () => {
      try {
        if (!address || !message || !signature) {
          toast.error('Please fill in all fields')
          return
        }

        if (sdk === 'viem') {
          try {
            const isValid = await verifyMessage({
              address: address as `0x${string}`,
              message,
              signature: signature as `0x${string}`,
            })
            const recoveredAddress = await recoverMessageAddress({
              message,
              signature: signature as `0x${string}`,
            })
            res[sdk] = `Verification: ${isValid ? 'Valid' : 'Invalid'}\nRecovered address: ${recoveredAddress}`
          } catch (error) {
            if (error instanceof Error) {
              res[sdk] = `Invalid signature: ${error.message}`
            } else {
              res[sdk] = 'Invalid signature: Unknown error'
            }
          }
        } else if (sdk === 'ethers') {
          try {
            const recoveredAddress = ethers.verifyMessage(message, signature)
            const isValid = recoveredAddress.toLowerCase() === address.toLowerCase()
            res[sdk] = `Verification: ${isValid ? 'Valid' : 'Invalid'}\nRecovered address: ${recoveredAddress}`
          } catch (error) {
            if (error instanceof Error) {
              res[sdk] = `Invalid signature: ${error.message}`
            } else {
              res[sdk] = 'Invalid signature: Unknown error'
            }
          }
        } else if (sdk === 'web3') {
          try {
            const web3 = new Web3()
            const recoveredAddress = web3.eth.accounts.recover(message, signature)
            const isValid = recoveredAddress.toLowerCase() === address.toLowerCase()
            res[sdk] = `Verification: ${isValid ? 'Valid' : 'Invalid'}\nRecovered address: ${recoveredAddress}`
          } catch (error) {
            if (error instanceof Error) {
              res[sdk] = `Invalid signature: ${error.message}`
            } else {
              res[sdk] = 'Invalid signature: Unknown error'
            }
          }
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
    message,
    setMessage,
    signature,
    setSignature,
    verifySignature,
    loading,
    result,
  }
}
