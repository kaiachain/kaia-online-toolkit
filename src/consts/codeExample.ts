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

const accountUpdateMultiSigValueTransfer = createSdkObject({
  ethersExt: `// Step 1: Create provider and wallet
const provider = new JsonRpcProvider(rpcUrl)

// Step 2: Create transaction
const tx = {
  type: TxType.ValueTransfer,
  from: address,
  to: recipientAddress,
  value: BigInt(parseFloat(amount) * 1e18).toString(),
  gasLimit: 1_000_000,
  nonce: Number(await provider.getTransactionCount(address)),
  gasPrice: (await provider.getFeeData()).gasPrice?.toString() || '0x5d21dba00'
}

// Step 3: Get signatures from required private keys
let signedTx = null
const weights = [1, 1, 1] // Example weights for each key
const threshold = 2 // Example threshold
let totalWeight = 0

// Sign with each private key until threshold is met
for (let i = 0; i < privateKeys.length; i++) {
  const wallet = new Wallet(privateKeys[i], provider)
  signedTx = await wallet.signTransaction(tx)
  totalWeight += weights[i]
  
  if (totalWeight >= threshold) {
    break
  }
}

// Step 4: Send transaction once threshold is met
if (totalWeight >= threshold && signedTx) {
  const txHash = await provider.klay.sendRawTransaction(signedTx)
  
  // Wait for transaction receipt
  let result = null
  let attempts = 0
  const maxAttempts = 5
  const delay = 2000 // 2 seconds delay between attempts

  while (attempts < maxAttempts) {
    try {
      result = await provider.klay.getTransactionReceipt(txHash)
      if (result) break
    } catch (error) {
      console.log(\`Attempt \${attempts + 1}: Waiting for transaction receipt...\`, error)
    }
    await new Promise(resolve => setTimeout(resolve, delay))
    attempts++
  }

  if (!result) {
    throw new Error('Transaction receipt not found after maximum attempts')
  }
}`,
  web3Ext: `// Step 1: Create provider and web3 instance
const provider = new Web3.providers.HttpProvider(rpcUrl)
const web3 = new Web3(provider)

// Step 2: Create transaction
const tx = {
  type: TxType.ValueTransfer,
  from: address,
  to: recipientAddress,
  value: BigInt(parseFloat(amount) * 1e18).toString(),
  gasLimit: 1_000_000,
  nonce: Number(await web3.eth.getTransactionCount(address)),
  gasPrice: (await web3.eth.getGasPrice()).toString()
}

// Step 3: Get signatures from required private keys
let signedTx = null
const weights = [1, 1, 1] // Example weights for each key
const threshold = 2 // Example threshold
let totalWeight = 0

// Sign with each private key until threshold is met
for (let i = 0; i < privateKeys.length; i++) {
  const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKeys[i])
  const signResult = await senderAccount.signTransaction(tx)
  signedTx = signResult.rawTransaction
  totalWeight += weights[i]
  
  if (totalWeight >= threshold) {
    break
  }
}

// Step 4: Send transaction once threshold is met
if (totalWeight >= threshold && signedTx) {
  const result = await web3.eth.sendSignedTransaction(signedTx)
}`
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

const rlpEncode = createSdkObject({
  ethers: `import { encodeRlp } from 'ethers'
\nencode("0x12345678");
// '0x8412345678'
\nencode([ "0x12345678" ]);
// '0xc58412345678'
\nencode([ new Uint8Array([ 0x12, 0x34, 0x56, 0x78 ]) ]);
// '0xc58412345678'
\nencode([ [ "0x42", [ "0x43" ] ], "0x12345678", [ ] ]);
// '0xcac342c1438412345678c0'
\nencode([ ]);
// '0xc0'`,
  viem: `import { toRlp } from 'viem'
\ntoRlp('0x123456789')
// "0x850123456789"
\ntoRlp(['0x7f', '0x7f', '0x8081e8'])
// "0xc67f7f838081e8"
\ntoRlp(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
// "0x89010203040506070809"
\ntoRlp('0x123456789', 'bytes')
// Uint8Array [133, 1, 35, 69, 103, 137]`,
})

const rlpDecode = createSdkObject({
  ethers: `import { decodeRlp } from 'ethers'
\ndecode("0x8412345678");
// '0x12345678'
\ndecode("0xcac342c1438412345678c0");
// [
//   [
//     '0x42',
//     [
//       '0x43'
//     ]
//   ],
//   '0x12345678',
//   []
// ]
\ndecode("0xc0");
// []`,

  viem: `import { fromRlp } from 'viem'
\nfromRlp('0x850123456789', 'hex')
// "0x123456789"
\nfromRlp('0xc67f7f838081e8', 'hex')
// ['0x7f', '0x7f', '0x8081e8']
\nfromRlp('0x89010203040506070809', 'bytes')
//  Uint8Array [1, 2, 3, 4, 5, 6, 7, 8, 9]
\nfromRlp(new Uint8Array ([133, 1, 35, 69, 103, 137]), 'hex')
// "0x123456789"`,
})

const blockInfo = createSdkObject({
  viem: `import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  transport: http(rpcUrl),
})

// Get block by number
const blockByNumber = await client.getBlock({
  blockNumber: BigInt(blockNumber)
})

// Get block by hash
const blockByHash = await client.getBlock({
  blockHash: '0x...'
})`,
  ethers: `import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider(rpcUrl)

// Get block by number
const blockByNumber = await provider.getBlock(blockNumber)

// Get block by hash
const blockByHash = await provider.getBlock('0x...')`,
  web3: `import { Web3 } from 'web3'

const web3 = new Web3(rpcUrl)

// Get block by number
const blockByNumber = await web3.eth.getBlock(blockNumber)

// Get block by hash
const blockByHash = await web3.eth.getBlock('0x...')`,
})

const addressChecksum = createSdkObject({
  viem: `import { getAddress, isAddress } from 'viem'

// Check if address is valid
const isValid = isAddress(address)

// Convert to checksum address
const checksumAddress = getAddress(address)`,
  ethers: `import { ethers } from 'ethers'

// Check if address is valid
const isValid = ethers.isAddress(address)

// Convert to checksum address
const checksumAddress = ethers.getAddress(address)`,
  web3: `import { Web3 } from 'web3'

const web3 = new Web3()

// Check if address is valid
const isValid = web3.utils.isAddress(address)

// Convert to checksum address
const checksumAddress = web3.utils.toChecksumAddress(address)`,
})

const signVerify = createSdkObject({
  viem: `import { verifyMessage, recoverMessageAddress } from 'viem'

// Verify a message was signed by the address
const isValid = await verifyMessage({
  address,
  message,
  signature,
})

// Recover the address that signed the message
const recoveredAddress = await recoverMessageAddress({
  message,
  signature,
})`,
  ethers: `import { ethers } from 'ethers'

// Recover the address that signed the message
const recoveredAddress = ethers.verifyMessage(message, signature)

// Verify if the recovered address matches the expected address
const isValid = recoveredAddress.toLowerCase() === address.toLowerCase()`,
  web3: `import { Web3 } from 'web3'

const web3 = new Web3()

// Recover the address that signed the message
const recoveredAddress = web3.eth.accounts.recover(message, signature)

// Verify if the recovered address matches the expected address
const isValid = recoveredAddress.toLowerCase() === address.toLowerCase()`,
})

const estimateGas = createSdkObject({
  viem: `import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  transport: http(rpcUrl),
})

// Estimate gas for a transaction
const txRequest = {
  account: "0x3f71029af4e252b25b9ab999f77182f0cd3bc085",
  to: "0x87ac99835e67168d4f9a40580f8f5c33550ba88b",
  data: "0x8ada066e",
  value: BigInt("0x0"),
  gasPrice: BigInt("0x5d21dba00")
}

const gasEstimate = await client.estimateGas(txRequest)`,
  ethers: `import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider(rpcUrl)

// Estimate gas for a transaction
const txRequest = {
  from: "0x3f71029af4e252b25b9ab999f77182f0cd3bc085",
  to: "0x87ac99835e67168d4f9a40580f8f5c33550ba88b",
  data: "0x8ada066e",
  value: "0x0",
  gasPrice: "0x5d21dba00",
  gasLimit: "0x100000"
}

const gasEstimate = await provider.estimateGas(txRequest)`,
  web3: `import { Web3 } from 'web3'

const web3 = new Web3(rpcUrl)

// Estimate gas for a transaction
const txRequest = {
  from: "0x3f71029af4e252b25b9ab999f77182f0cd3bc085",
  to: "0x87ac99835e67168d4f9a40580f8f5c33550ba88b",
  data: "0x8ada066e",
  value: "0x0",
  gasPrice: "0x5d21dba00",
  gas: "0x100000"
}

const gasEstimate = await web3.eth.estimateGas(txRequest)`,
})

export default {
  switchNetworkCode,
  accountFromPrivateKey,
  accountFromMnemonic,
  accountUpdatePublic,
  accountUpdateFail,
  accountUpdateMultiSig,
  accountUpdateMultiSigValueTransfer,
  accountUpdateRoleBased,
  encryptPrivateKey,
  decryptPrivateKey,
  rlpEncode,
  rlpDecode,
  blockInfo,
  addressChecksum,
  signVerify,
  estimateGas,
}
