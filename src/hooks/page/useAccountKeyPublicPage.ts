import { useCallback, useState } from 'react'
import { SigningKey, JsonRpcProvider } from 'ethers'
import { Wallet } from '@kaiachain/ethers-ext/v6'
import { Web3, getPublicKeyFromPrivate } from '@kaiachain/web3js-ext'
import { AccountKeyType, TxType } from '@kaiachain/js-ext-core'

import { SdkType } from '@/types'
import { useNetwork, useValidator } from '../independent'
import { parseError, stringify } from '@/common'

export type UseAccountKeyPublicPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  privateKey: string
  setPrivateKey: (privateKey: string) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  addressErrMsg: string
  newPrivateKey: string
  setNewPrivateKey: (newPrivateKey: string) => void
  accountUpdate: () => Promise<void>
  loading: boolean
  result: string
}

export const useAccountKeyPublicPage = (): UseAccountKeyPublicPageReturn => {
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

  const [newPrivateKey, setNewPrivateKey] = useState('')

  const getTx = useCallback(
    (senderNewPub: string) => {
      return {
        type: TxType.AccountUpdate,
        from: address,
        key: {
          type: AccountKeyType.Public,
          key: senderNewPub,
        },
      }
    },
    [address]
  )

  const accountUpdate = async () => {
    setLoading(true)
    setResult('')
    try {
      if (sdk === 'ethersExt') {
        const provider = new JsonRpcProvider(rpcUrl)
        const wallet = new Wallet(privateKey, provider)
        const senderNewPub = SigningKey.computePublicKey(newPrivateKey)

        const tx = getTx(senderNewPub)

        const sentTx = await wallet.sendTransaction(tx)
        const result = await sentTx.wait()
        setResult(stringify(result))
      } else if (sdk === 'web3Ext') {
        const provider = new Web3.providers.HttpProvider(rpcUrl)
        const web3 = new Web3(provider)
        const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
        const senderNewPub = getPublicKeyFromPrivate(newPrivateKey)

        const tx = getTx(senderNewPub)

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
    newPrivateKey,
    setNewPrivateKey,
    accountUpdate,
    loading,
    result,
  }
}
