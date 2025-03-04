import { useState } from 'react'
import { Wallet } from '@kaiachain/ethers-ext'
import { Web3 } from '@kaiachain/web3js-ext'

import { SdkType } from '@/types'
import { useValidator } from '../independent'
import { parseError, stringify } from '@/common'

export type UseKeystoreV4PageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  address: string
  setAddress: (address: string) => void
  pKey4Keystore: string
  setPKey4Keystore: (privateKey: string) => void
  pKey4KeystoreErrMsg: string
  password: string
  setPassword: (password: string) => void
  generateKeystore: () => Promise<void>
  encryptResult: string
  keystore4PKey: any
  setKeystore4PKey: (keystore: any) => void
  decryptKeystore: () => Promise<void>
  decryptResult: string
  decryptedKey: string
}

export const useKeystoreV4Page = (): UseKeystoreV4PageReturn => {
  const [sdk, setSdk] = useState<SdkType>('ethers')
  const [address, setAddress] = useState('')
  const [pKey4Keystore, setPKey4Keystore] = useState('')
  const { errorMessage: pKey4KeystoreErrMsg } = useValidator({
    value: pKey4Keystore,
    type: 'privateKey',
  })
  const [password, setPassword] = useState('')
  const [encryptResult, setEncryptResult] = useState('')
  const [keystore4PKey, setKeystore4PKey] = useState()
  const [decryptResult, setDecryptResult] = useState('')
  const [decryptedKey, setDecryptedKey] = useState('')

  const generateKeystore = async () => {
    setEncryptResult('')
    try {
      if (sdk === 'ethers') {
        const wallet = new Wallet(address, pKey4Keystore)
        const encrypted = await wallet.encrypt(password)
        setEncryptResult(stringify(JSON.parse(encrypted)))
      } else if (sdk === 'web3') {
        const web3 = new Web3()
        const encrypted = await web3.eth.accounts.encrypt(
          pKey4Keystore,
          password
        )
        setEncryptResult(stringify(encrypted))
      }
    } catch (error) {
      setEncryptResult(parseError(error))
    }
  }

  const decryptKeystore = async () => {
    setDecryptedKey('')
    setDecryptResult('')

    if (!keystore4PKey) return

    try {
      if (sdk === 'ethers') {
        const wallet = await Wallet.fromEncryptedJson(keystore4PKey, password)
        setDecryptedKey(wallet.privateKey)
      } else if (sdk === 'web3') {
        const web3 = new Web3()
        const decrypted = await web3.eth.accounts.decrypt(
          keystore4PKey,
          password
        )
        setDecryptedKey(decrypted.privateKey)
      }
    } catch (error) {
      setDecryptResult(parseError(error))
    }
  }

  return {
    sdk,
    setSdk,
    address,
    setAddress,
    pKey4Keystore,
    setPKey4Keystore,
    pKey4KeystoreErrMsg,
    password,
    setPassword,
    generateKeystore,
    encryptResult,
    keystore4PKey,
    setKeystore4PKey,
    decryptKeystore,
    decryptResult,
    decryptedKey,
  }
}
