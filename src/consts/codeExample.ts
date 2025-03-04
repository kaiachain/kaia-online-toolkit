import { SdkObject } from '@/types'

const createSdkObject = ({
  viem = '',
  ethers = '',
  web3 = '',
  ethersExt = '',
  web3Ext = '',
}: {
  viem?: string
  ethers?: string
  web3?: string
  ethersExt?: string
  web3Ext?: string
}): SdkObject => ({ viem, ethers, web3, ethersExt, web3Ext })

const switchNetworkCode = `try {
    // Request switching network
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
    return { success: true }
  } catch (error: any) {
      if (
        // Extension: https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_switchethereumchain/
        error.code === 4902 ||
        // Mobile: https://docs.metamask.io/services/reference/scroll/json-rpc-methods/#json-rpc-errors
        error.code === -32603
      ) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [AddEthereumChainParameter],
        })
        return { success: true }
      } catch (addError) {
        return { success: false, error: addError }
      }
    } else {
      return { success: false, error }
    }
  }
`

const accountFromPrivateKey = createSdkObject({
  viem: `import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
\nconst privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)`,
  ethers: `import { Wallet } from 'ethers'
\nconst privateKey = Wallet.createRandom().privateKey
const wallet = new Wallet(privateKey)`,
  web3: `import { eth } from 'web3'
\nconst privateKey = eth.accounts.create().privateKey
const account = eth.accounts.privateKeyToAccount(privateKey)`,
})

const accountFromMnemonic = createSdkObject({
  viem: `import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts'
\nconst mnemonic = generateMnemonic(english)
const { address, publicKey } = mnemonicToAccount(mnemonic)`,
  ethers: `import { Wallet } from 'ethers'
\nconst mnemonic = Wallet.createRandom().mnemonic?.phrase
const wallet = HDNodeWallet.fromPhrase(mnemonic)`,
})

const accountUpdatePublic = createSdkObject({
  ethersExt: `import { JsonRpcProvider } from 'ethers'
import { AccountKeyType, TxType, Wallet } from '@kaiachain/ethers-ext/v6'
\nconst provider = new JsonRpcProvider(rpcUrl)
const wallet = new Wallet(privateKey, provider)
const senderNewPub = SigningKey.computePublicKey(newPrivateKey)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    key: {
        type: AccountKeyType.Public,
        key: senderNewPub,
    },
}
\nconst sentTx = await wallet.sendTransaction(tx)
const result = await sentTx.wait()`,
  web3Ext: `import { Web3, AccountKeyType, TxType, getPublicKeyFromPrivate } from '@kaiachain/web3js-ext'
\nconst provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
const senderNewPub = getPublicKeyFromPrivate(newPrivateKey)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    key: {
        type: AccountKeyType.Public,
        key: senderNewPub,
    },
}
\nconst signResult = await senderAccount.signTransaction(tx)
const result = await web3.eth.sendSignedTransaction(signResult.rawTransaction)`,
})

const accountUpdateFail = createSdkObject({
  ethersExt: `import { JsonRpcProvider } from 'ethers'
import { AccountKeyType, TxType, Wallet } from '@kaiachain/ethers-ext/v6'
\nconst provider = new JsonRpcProvider(rpcUrl)
const wallet = new Wallet(privateKey, provider)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    key: {
        type: AccountKeyType.Fail,
    },
}
\nconst sentTx = await wallet.sendTransaction(tx)
const result = await sentTx.wait()`,
  web3Ext: `import { Web3, AccountKeyType, TxType, getPublicKeyFromPrivate } from '@kaiachain/web3js-ext'
\nconst provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    key: {
        type: AccountKeyType.Fail,
    },
}
\nconst signResult = await senderAccount.signTransaction(tx)
const result = await web3.eth.sendSignedTransaction(signResult.rawTransaction)`,
})

const accountUpdateMultiSig = createSdkObject({
  ethersExt: `import { JsonRpcProvider } from 'ethers'
import { AccountKeyType, TxType, Wallet } from '@kaiachain/ethers-ext/v6'
\nconst provider = new JsonRpcProvider(rpcUrl)
const wallet = new Wallet(privateKey, provider)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    gasLimit: 1_000_000,
    key: {
        type: AccountKeyType.MultiSig,
        threshold,
        keys: [
          [weight1, publicKey1],
          [weight2, publicKey2],
          ...
        ],
    },
}
\nconst sentTx = await wallet.sendTransaction(tx)
const result = await sentTx.wait()`,
  web3Ext: `import { Web3, AccountKeyType, TxType, getPublicKeyFromPrivate } from '@kaiachain/web3js-ext'
\nconst provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    gasLimit: 1_000_000,
    key: {
        type: AccountKeyType.MultiSig,
        threshold,
        keys: [
          [weight1, publicKey1],
          [weight2, publicKey2],
          ...
        ],
    },
}
\nconst signResult = await senderAccount.signTransaction(tx)
const result = await web3.eth.sendSignedTransaction(signResult.rawTransaction)`,
})

const accountUpdateRoleBased = createSdkObject({
  ethersExt: `import { JsonRpcProvider } from 'ethers'
import { AccountKeyType, TxType, Wallet } from '@kaiachain/ethers-ext/v6'
\nconst provider = new JsonRpcProvider(rpcUrl)
const wallet = new Wallet(privateKey, provider)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    gasLimit: 1_000_000,
    key: {
        type: AccountKeyType.RoleBased,
        keys: [
          // RoleTransaction
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
          // RoleAccountUpdate
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
          // RoleFeePayer 
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
        ],
    },
}
\nconst sentTx = await wallet.sendTransaction(tx)
const result = await sentTx.wait()`,
  web3Ext: `import { Web3, AccountKeyType, TxType, getPublicKeyFromPrivate } from '@kaiachain/web3js-ext'
\nconst provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
const tx = {
    type: TxType.AccountUpdate,
    from: address,
    gasLimit: 1_000_000,
    key: {
        type: AccountKeyType.RoleBased,
        keys: [
          // RoleTransaction
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
          // RoleAccountUpdate
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
          // RoleFeePayer 
          AccountKeyNil|AccountKeyLegacy|AccountKeyPublic|AccountKeyFail|AccountKeyWeightedMultiSig
        ],
    },
}
\nconst signResult = await senderAccount.signTransaction(tx)
const result = await web3.eth.sendSignedTransaction(signResult.rawTransaction)`,
})

const encryptPrivateKey = createSdkObject({
  ethers: `import { Wallet } from 'ethers'
\nconst wallet = new Wallet(privateKey)
const encrypted = wallet.encryptSync(password)`,
  web3: `import { eth } from 'web3'
\nconst encrypted = await eth.accounts.encrypt(privateKey, password)`,
})

const decryptPrivateKey = createSdkObject({
  ethers: `import { Wallet } from 'ethers'
\nconst wallet = await Wallet.fromEncryptedJson(keystore, password)
const decryptedKey = wallet.privateKey`,
  web3: `import { eth } from 'web3'
\nconst decrypted = await eth.accounts.decrypt(keystore, password)
const decryptedKey = decrypted.privateKey`,
})

export default {
  switchNetworkCode,
  accountFromPrivateKey,
  accountFromMnemonic,
  accountUpdatePublic,
  accountUpdateFail,
  accountUpdateMultiSig,
  accountUpdateRoleBased,
  encryptPrivateKey,
  decryptPrivateKey,
}
