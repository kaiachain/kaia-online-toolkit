import { useState } from 'react'
import { recoverMessageAddress } from 'viem'
import { ethers } from 'ethers'
import { Web3 } from 'web3'
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { parseError } from '@/common'

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
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [result, setResult] = useState(DefaultSdkObject)
  const [loading, setLoading] = useState(false)

  const verifySignature = async () => {
    const res = { ...result }
    setLoading(true)
    try {
      if (!message || !signature) {
        toast.error('Please fill in all fields')
        return
      }

      if (sdk === 'viem') {
        try {
          const recoveredAddress = await recoverMessageAddress({
            message,
            signature: signature as `0x${string}`,
          })
          res[sdk] = `Recovered address: ${recoveredAddress}`
        } catch (error) {
          res[sdk] = `Invalid signature: ${parseError(error)}`
        }
      } else if (sdk === 'ethers') {
        try {
          const recoveredAddress = ethers.verifyMessage(message, signature)

          res[sdk] = `Recovered address: ${recoveredAddress}`
        } catch (error) {
          res[sdk] = `Invalid signature: ${parseError(error)}`
        }
      } else if (sdk === 'web3') {
        try {
          const web3 = new Web3()
          const recoveredAddress = web3.eth.accounts.recover(message, signature)
          res[sdk] = `Recovered address: ${recoveredAddress}`
        } catch (error) {
          res[sdk] = `Invalid signature: ${parseError(error)}`
        }
      } else {
        toast('Not supported with this SDK')
      }
    } catch (error) {
      res[sdk] = parseError(error)
    } finally {
      setLoading(false)
    }
    setResult(res)
  }

  return {
    sdk,
    setSdk,
    message,
    setMessage,
    signature,
    setSignature,
    verifySignature,
    loading,
    result,
  }
}
