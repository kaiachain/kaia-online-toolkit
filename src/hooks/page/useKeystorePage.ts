import { useState } from 'react'
import { Wallet } from 'ethers'
import { eth } from 'web3'

import { SdkType } from '@/types'
import { useValidator } from '../independent'
import { parseError, stringify } from '@/common'

export type UseKeystorePageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
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

export const useKeystorePage = (): UseKeystorePageReturn => {
  const [sdk, setSdk] = useState<SdkType>('ethers')
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
        const wallet = new Wallet(pKey4Keystore)
        const encrypted = wallet.encryptSync(password)
        setEncryptResult(stringify(JSON.parse(encrypted)))
      } else if (sdk === 'web3') {
        const encrypted = await eth.accounts.encrypt(pKey4Keystore, password)
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
        const decrypted = await eth.accounts.decrypt(keystore4PKey, password)
        setDecryptedKey(decrypted.privateKey)
      }
    } catch (error) {
      setDecryptResult(parseError(error))
    }
  }

  return {
    sdk,
    setSdk,
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
