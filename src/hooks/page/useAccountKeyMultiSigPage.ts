import { useCallback, useState } from 'react'
import { JsonRpcProvider } from 'ethers'
import { Wallet } from '@kaiachain/ethers-ext/v6'
import { Web3 } from '@kaiachain/web3js-ext'
import { AccountKeyType, TxType } from '@kaiachain/js-ext-core'

import { SdkType } from '@/types'
import { useNetwork, useValidator } from '../independent'
import { parseError, stringify } from '@/common'
import _ from 'lodash'
import { privateKeyToAccount } from 'viem/accounts'

export type UseAccountKeyMultiSigPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  privateKey: string
  setPrivateKey: (privateKey: string) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  addressErrMsg: string
  accountUpdate: () => Promise<void>
  loading: boolean
  result: string
  threshold: number
  setThreshold: React.Dispatch<React.SetStateAction<number>>
  numberOfKeys: number
  setNumberOfKeys: React.Dispatch<React.SetStateAction<number>>
  pKeyList: string[]
  setPKeyList: React.Dispatch<React.SetStateAction<string[]>>
  weightList: number[]
  setWeightList: React.Dispatch<React.SetStateAction<number[]>>
}

export const useAccountKeyMultiSigPage =
  (): UseAccountKeyMultiSigPageReturn => {
    const [sdk, setSdk] = useState<SdkType>('ethersExt')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const { rpcUrl } = useNetwork()
    const [address, setAddress] = useState('')
    const { errorMessage: addressErrMsg } = useValidator({
      value: address,
      type: 'address',
    })

    const [privateKey, setPrivateKey] = useState('')

    const [threshold, setThreshold] = useState(2)
    const [numberOfKeys, setNumberOfKeys] = useState(2)
    const [pKeyList, setPKeyList] = useState<string[]>([])
    const [weightList, setWeightList] = useState<number[]>([])

    const getTx = useCallback(() => {
      const keys = _.times(numberOfKeys, (i) => [
        weightList[i],
        privateKeyToAccount(pKeyList[i] as '0x').publicKey,
      ])

      return {
        type: TxType.AccountUpdate,
        from: address,
        gasLimit: 1_000_000,
        key: {
          type: AccountKeyType.WeightedMultiSig,
          threshold,
          keys,
        },
      }
    }, [address, threshold, numberOfKeys, pKeyList, weightList])

    const accountUpdate = async () => {
      setLoading(true)
      setResult('')
      try {
        if (sdk === 'ethersExt') {
          const provider = new JsonRpcProvider(rpcUrl)
          const wallet = new Wallet(privateKey, provider)

          const tx = getTx()

          const sentTx = await wallet.sendTransaction(tx)
          const result = await sentTx.wait()
          setResult(stringify(result))
        } else if (sdk === 'web3Ext') {
          const provider = new Web3.providers.HttpProvider(rpcUrl)
          const web3 = new Web3(provider)
          const senderAccount =
            web3.eth.accounts.privateKeyToAccount(privateKey)

          const tx = getTx()

          const signResult = await senderAccount.signTransaction(tx)
          const result = await web3.eth.sendSignedTransaction(
            signResult.rawTransaction
          )
          setResult(stringify(result))
        }
      } catch (error) {
        setResult(parseError(error))
      } finally {
        setLoading(false)
      }
    }

    return {
      sdk,
      setSdk,
      privateKey,
      setPrivateKey,
      address,
      setAddress,
      addressErrMsg,
      accountUpdate,
      loading,
      result,
      threshold,
      setThreshold,
      numberOfKeys,
      setNumberOfKeys,
      pKeyList,
      setPKeyList,
      weightList,
      setWeightList,
    }
  }
