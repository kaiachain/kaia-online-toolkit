import { useEffect, useMemo, useState } from 'react'
import * as viemAccounts from 'viem/accounts'
import { ethers } from 'ethers' // https://docs.ethers.org/v6/
import { eth } from 'web3' // https://docs.web3js.org/
import { toast } from 'react-toastify'

import { SdkObject, SdkType } from '@/types'
import { stringify, UTIL } from '@/common'
import { useValidator } from '../independent'

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export type UseAccountBasicPageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  privateKey: string
  setPrivateKey: (privateKey: string) => void
  accountFromPrivateKey: SdkObject
  mnemonic: string
  setMnemonic: (mnemonic: string) => void
  accountFromMnemonic: SdkObject
  pKeyErrMsg: string
  mnemonicErrMsg: string
  generatePrivateKey: () => void
  privateKeyToAccount: () => void
  generateMnemonic: () => void
  mnemonicToAccount: () => void
}

export const useAccountBasicPage = (): UseAccountBasicPageReturn => {
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [privateKey, setPrivateKey] = useState('')
  const { errorMessage: pKeyErrMsg } = useValidator({
    value: privateKey,
    type: 'privateKey',
  })
  const [accountFromPrivateKey, setAccountFromPrivateKey] =
    useState<SdkObject>(DefaultSdkObject)
  const [mnemonic, setMnemonic] = useState('')
  const mnemonicErrMsg = useMemo(() => {
    if (!mnemonic) return ''
    if (!UTIL.isValidMnemonic(mnemonic)) {
      return 'Invalid mnemonic'
    }
    return ''
  }, [mnemonic])
  const [accountFromMnemonic, setAccountFromMnemonic] =
    useState<SdkObject>(DefaultSdkObject)

  const generatePrivateKey = () => {
    if (sdk === 'viem') {
      setPrivateKey(viemAccounts.generatePrivateKey())
    } else if (sdk === 'ethers') {
      setPrivateKey(ethers.Wallet.createRandom().privateKey)
    } else if (sdk === 'web3') {
      setPrivateKey(eth.accounts.create().privateKey)
    }
  }

  const privateKeyToAccount = () => {
    const res = { ...accountFromPrivateKey }
    if (sdk === 'viem') {
      const account = viemAccounts.privateKeyToAccount(
        privateKey as `0x${string}`
      )
      res['viem'] = stringify(account)
    } else if (sdk === 'ethers') {
      const wallet = new ethers.Wallet(privateKey)
      res['ethers'] = stringify(wallet)
    } else if (sdk === 'web3') {
      const account = eth.accounts.privateKeyToAccount(privateKey)
      res['web3'] = stringify(account)
    }
    setAccountFromPrivateKey(res)
  }

  const generateMnemonic = () => {
    if (sdk === 'viem') {
      setMnemonic(viemAccounts.generateMnemonic(viemAccounts.english))
    } else if (sdk === 'ethers') {
      setMnemonic(ethers.Wallet.createRandom().mnemonic?.phrase ?? '')
    } else if (sdk === 'web3') {
      toast('Not supported with web3')
    }
  }

  const mnemonicToAccount = () => {
    const res = { ...accountFromMnemonic }
    if (sdk === 'viem') {
      const account = viemAccounts.mnemonicToAccount(mnemonic)
      res['viem'] = stringify(account)
    } else if (sdk === 'ethers') {
      const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic)
      res['ethers'] = stringify(wallet)
    } else if (sdk === 'web3') {
      toast('Not supported with web3')
    }
    setAccountFromMnemonic(res)
  }

  useEffect(() => {
    setAccountFromPrivateKey(DefaultSdkObject)
  }, [privateKey])

  useEffect(() => {
    setAccountFromMnemonic(DefaultSdkObject)
  }, [mnemonic])

  return {
    sdk,
    setSdk,
    privateKey,
    setPrivateKey,
    accountFromPrivateKey,
    mnemonic,
    setMnemonic,
    accountFromMnemonic,
    pKeyErrMsg,
    mnemonicErrMsg,
    generatePrivateKey,
    privateKeyToAccount,
    generateMnemonic,
    mnemonicToAccount,
  }
}
