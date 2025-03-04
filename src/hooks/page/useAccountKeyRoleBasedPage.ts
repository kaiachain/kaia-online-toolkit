import { useCallback, useState } from 'react'
import { JsonRpcProvider } from 'ethers'
import { Wallet } from '@kaiachain/ethers-ext/v6'
import { Web3 } from '@kaiachain/web3js-ext'
import { AccountKeyType, TxType } from '@kaiachain/js-ext-core'
import _ from 'lodash'
import { privateKeyToAccount } from 'viem/accounts'

import { SdkType } from '@/types'
import { useNetwork } from '../independent'
import { parseError, stringify } from '@/common'

export type UseAccountKeyRoleBasedPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  privateKey: string
  setPrivateKey: (privateKey: string) => void
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  accountUpdate: () => Promise<void>
  loading: boolean
  result: string
  pKeyList: [string, string, string]
  setPKeyList: React.Dispatch<React.SetStateAction<[string, string, string]>>
}

export const useAccountKeyRoleBasedPage =
  (): UseAccountKeyRoleBasedPageReturn => {
    const [sdk, setSdk] = useState<SdkType>('ethersExt')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const { rpcUrl } = useNetwork()
    const [address, setAddress] = useState('')

    const [privateKey, setPrivateKey] = useState('')

    const [pKeyList, setPKeyList] = useState<[string, string, string]>([
      '', // RoleTransaction
      '', // RoleAccountUpdate
      '', // RoleFeePayer
    ])

    const getTx = useCallback(() => {
      const keys = _.map(pKeyList, (pKey) => ({
        type: AccountKeyType.Public,
        key: privateKeyToAccount(pKey as '0x').publicKey,
      }))

      return {
        type: TxType.AccountUpdate,
        from: address,
        gasLimit: 1_000_000,
        key: {
          type: AccountKeyType.RoleBased,
          keys,
        },
      }
    }, [address, pKeyList])

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
      accountUpdate,
      loading,
      result,
      pKeyList,
      setPKeyList,
    }
  }
