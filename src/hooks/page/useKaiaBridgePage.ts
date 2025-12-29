import { useState, useEffect } from 'react'
import { JsonRpcProvider, BrowserProvider, hashMessage, SigningKey, Contract, getBytes, sha256, ripemd160, Interface } from 'ethers'
import * as bech32lib from 'bech32'
import type { BechLib } from 'bech32'
import { useSignMessage, useWalletClient, useAccount } from 'wagmi'
import { useNetwork } from '../independent'

const BRIDGE_MESSAGE_PREFIX = 'kaiabridge'
// In the browser, Vite exposes bech32 functions directly on the module
const bech32 = ((bech32lib as any).toWords ? bech32lib : bech32lib.bech32) as BechLib

// Kaia Wallet (Kaia Wallet) provider
const kaiaProvider = typeof window !== 'undefined' && typeof window.klaytn !== 'undefined' ? window.klaytn : null

export type UseKaiaBridgePageReturn = {
  loading: boolean
  finschiaAddress: string
  signAndDerive: () => void
  errorMsg: string
  signature: string
  conyBalance: string
  provisionSeq: string
  recordLoading: boolean
  hasProvisionedBefore: boolean
  canRequestProvision: boolean
  provisionLoading: boolean
  requestProvision: () => Promise<void>
  provisionError: string
  provisionTxHash: string
  provisionJustSucceeded: boolean
  claimLoading: boolean
  claimError: string
  claimTxHash: string
  hasClaimed: boolean
  claimJustSucceeded: boolean
  canRequestClaim: boolean
  requestClaim: () => Promise<void>
  balanceBeforeClaim: string
  balanceAfterClaim: string
  balanceBeforeClaimKaia: string
  balanceAfterClaimKaia: string
  balanceDifferenceKaia: string
  checkingClaimed: boolean
}

export const useKaiaBridgePage = (): UseKaiaBridgePageReturn => {
  const [loading, setLoading] = useState(false)
  const [finschiaAddress, setFinschiaAddress] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [conyBalance, setConyBalance] = useState('')
  const [provisionSeq, setProvisionSeq] = useState('')
  const [recordLoading, setRecordLoading] = useState(false)
  const [provisionLoading, setProvisionLoading] = useState(false)
  const [provisionError, setProvisionError] = useState('')
  const [provisionTxHash, setProvisionTxHash] = useState('')
  const [provisionJustSucceeded, setProvisionJustSucceeded] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [claimTxHash, setClaimTxHash] = useState('')
  const [hasClaimed, setHasClaimed] = useState(false)
  const [claimJustSucceeded, setClaimJustSucceeded] = useState(false)
  const [checkingClaimed, setCheckingClaimed] = useState(false)
  const [balanceBeforeClaim, setBalanceBeforeClaim] = useState('')
  const [balanceAfterClaim, setBalanceAfterClaim] = useState('')
  const [signedMessage, setSignedMessage] = useState('') // Store the message that was signed
  const [storedSignature, setStoredSignature] = useState('') // Store signature from either wallet
  const { rpcUrl } = useNetwork()
  const provider = new JsonRpcProvider(rpcUrl)
  const { signMessageAsync } = useSignMessage()
  const { data: walletClient } = useWalletClient()
  const { address: connectedAddress } = useAccount()

  // Build the message to sign: "kaiabridge" + "0xuser_address"
  const buildBridgeMessage = (address: string): string => {
    return BRIDGE_MESSAGE_PREFIX + address.toLowerCase()
  }

  const holderVerifierABI = [
    "function getRecord(string) view returns (uint256, uint64)",
    "function requestProvision(bytes publicKey, string fnsaAddress, bytes32 messageHash, bytes signature)",
    "function provisionSeq(string) view returns (uint64)",
  ]

  const bridgeABI = [
    "function claimed(uint64) view returns (bool)",
    "function requestClaim(uint64)",
  ]

  const holderVerifierAddress = "0x6475aAcD6f7C58BE5814eD400E3f738d35DB4FB6"
  const bridgeAddress = "0x5ff2ad57c15f7dacb5d098d1fc82daf482884f99"

  const pubkeyToFinschiaAddress = (pubkey: string) => {
    const pubKeyBytes = getBytes(pubkey)
    const compressedPubKey = SigningKey.computePublicKey(pubKeyBytes, true)
    const sha256Hash = sha256(compressedPubKey)
    const ripemd160HashHex = ripemd160(getBytes(sha256Hash))
    const ripemd160Bytes = getBytes(ripemd160HashHex)
    const words = bech32.toWords(ripemd160Bytes)
    const finschiaAddress = bech32.encode("link", words)
    return finschiaAddress;
  }

  const deriveFinschiaAddress = (sig: string, message: string) => {
    const digest = hashMessage(message)
    const recoveredPubKey = SigningKey.recoverPublicKey(digest, sig)
    const finschiaAddress = pubkeyToFinschiaAddress(recoveredPubKey)
    return finschiaAddress
  }

  const getUncompressedPublicKey = (sig: string, message: string): string => {
    const digest = hashMessage(message)
    const recoveredPubKey = SigningKey.recoverPublicKey(digest, sig)
    // recoverPublicKey returns uncompressed format (0x04 + x + y)
    return recoveredPubKey
  }

  const keiToKaia = (kei: string): string => {
    if (!kei || kei === '0') return '0'
    // 1 KAIA = 10^18 kei
    const kaia = BigInt(kei) / BigInt(10 ** 18)
    const remainder = BigInt(kei) % BigInt(10 ** 18)
    const decimals = remainder.toString().padStart(18, '0').slice(0, 6) // Show 6 decimal places
    return `${kaia}.${decimals}`
  }

  // Calculate difference using BigInt to avoid floating point precision issues
  const calculateKaiaDifference = (beforeKei: string, afterKei: string): string => {
    if (!beforeKei || !afterKei) return '0'
    const diff = BigInt(afterKei) - BigInt(beforeKei)
    return keiToKaia(diff.toString())
  }

  const fetchRecord = async (address: string) => {
    setRecordLoading(true)
    setConyBalance('')
    setProvisionSeq('')
    try {
      const holderVerifierContract = new Contract(holderVerifierAddress, holderVerifierABI, provider)
      const result = await holderVerifierContract.getRecord(address)
      setConyBalance(result[0].toString())
      setProvisionSeq(result[1].toString())
    } catch (err: any) {
      console.error('Failed to fetch record:', err)
      setConyBalance('0')
      setProvisionSeq('0')
    } finally {
      setRecordLoading(false)
    }
  }

  // Get wallet address from either Kaia Wallet or MetaMask (wagmi)
  const getWalletAddress = async (): Promise<string | null> => {
    // Try Kaia Wallet first
    if (kaiaProvider) {
      try {
        const accounts = await kaiaProvider.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0) {
          return accounts[0]
        }
      } catch (e) {
        console.log('Kaia Wallet not connected or error:', e)
      }
    }

    // Fall back to wagmi (MetaMask)
    if (connectedAddress) {
      return connectedAddress
    }

    if (walletClient?.account?.address) {
      return walletClient.account.address
    }

    return null
  }

  // Sign message using either Kaia Wallet or MetaMask (wagmi)
  const signMessage = async (message: string, address: string): Promise<string> => {
    // Try Kaia Wallet first if it has the address
    if (kaiaProvider) {
      try {
        const accounts = await kaiaProvider.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === address.toLowerCase()) {
          const sig = await kaiaProvider.request({
            method: 'personal_sign',
            params: [message, address]
          })
          return sig
        }
      } catch (e) {
        console.log('Kaia Wallet signing failed, trying wagmi:', e)
      }
    }

    // Fall back to wagmi (MetaMask)
    return await signMessageAsync({ message })
  }

  const signAndDerive = async () => {
    setErrorMsg('')
    setFinschiaAddress('')
    setConyBalance('')
    setProvisionSeq('')
    setProvisionJustSucceeded(false)
    setProvisionTxHash('')
    setClaimJustSucceeded(false)
    setClaimTxHash('')
    setSignedMessage('')
    setStoredSignature('')
    setLoading(true)

    try {
      const walletAddress = await getWalletAddress()

      if (!walletAddress) {
        throw new Error('Wallet not connected. Please connect MetaMask or Kaia Wallet.')
      }

      // Build message to sign: "kaiabridge" + "0xuser_address"
      const message = buildBridgeMessage(walletAddress)
      setSignedMessage(message)

      const sig = await signMessage(message, walletAddress)
      setStoredSignature(sig) // Store the signature for provision request
      const fnsa = deriveFinschiaAddress(sig, message)
      setFinschiaAddress(fnsa)

      // Automatically fetch record after deriving address
      await fetchRecord(fnsa)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign message or derive address')
    } finally {
      setLoading(false)
    }
  }

  // Check claimed status when provisionSeq changes
  useEffect(() => {
    if (provisionSeq && provisionSeq !== '0') {
      checkIfClaimed(provisionSeq)
    }
  }, [provisionSeq])

  // Determine if user has provisioned before and can request provision
  const hasProvisionedBefore = provisionSeq !== '' && provisionSeq !== '0'
  const canRequestProvision = conyBalance !== '' && conyBalance !== '0' && !hasProvisionedBefore
  const canRequestClaim = hasProvisionedBefore && !hasClaimed

  const checkIfClaimed = async (seq: string) => {
    if (!seq || seq === '0') return

    setCheckingClaimed(true)
    try {
      const bridgeContract = new Contract(bridgeAddress, bridgeABI, provider)
      const claimed = await bridgeContract.claimed(seq)
      setHasClaimed(claimed)
    } catch (err: any) {
      console.error('Failed to check claimed status:', err)
      setHasClaimed(false)
    } finally {
      setCheckingClaimed(false)
    }
  }

  const getKaiaBalance = async (address: string) => {
    try {
      const balance = await provider.getBalance(address)
      return balance.toString()
    } catch (err: any) {
      console.error('Failed to get balance:', err)
      return '0'
    }
  }

  const getSigner = async () => {
    // Try wagmi (MetaMask) first since it's more reliable with ethers.js
    if (walletClient) {
      const browserProvider = new BrowserProvider(walletClient as any)
      return await browserProvider.getSigner()
    }

    // Fall back to Kaia Wallet
    if (kaiaProvider) {
      try {
        const accounts = await kaiaProvider.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0) {
          const browserProvider = new BrowserProvider(kaiaProvider as any)
          return await browserProvider.getSigner()
        }
      } catch (e) {
        console.log('Kaia Wallet signer failed:', e)
      }
    }

    throw new Error('Wallet not connected')
  }

  // Send transaction using Kaia Wallet directly (bypasses ethers.js compatibility issues)
  const sendTransactionViaKaiaWallet = async (to: string, data: string): Promise<string> => {
    const accounts = await kaiaProvider.request({ method: 'eth_accounts' })
    if (!accounts || accounts.length === 0) {
      throw new Error('Kaia Wallet not connected')
    }

    const txHash = await kaiaProvider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: accounts[0],
        to,
        data,
        gas: '0x4C4B40', // 5000000 gas
      }]
    })

    return txHash
  }

  const handleRequestProvision = async () => {
    if (!finschiaAddress) {
      setProvisionError('Please derive Finschia address first')
      return
    }

    if (!storedSignature) {
      setProvisionError('Signature not found. Please sign the message again.')
      return
    }

    if (!signedMessage) {
      setProvisionError('Signed message not found. Please sign the message again.')
      return
    }

    setProvisionLoading(true)
    setProvisionError('')
    setProvisionTxHash('')
    setProvisionJustSucceeded(false)

    try {
      // Prepare the message hash to sign
      const messageHash = hashMessage(signedMessage)

      // Get the uncompressed public key from the signature
      const publicKey = getUncompressedPublicKey(storedSignature, signedMessage)

      let txHash: string

      // Check if we should use wagmi or Kaia Wallet
      if (walletClient) {
        // Use wagmi (MetaMask)
        const signer = await getSigner()
        const holderVerifierContract = new Contract(holderVerifierAddress, holderVerifierABI, signer)
        const tx = await holderVerifierContract.requestProvision(publicKey, finschiaAddress, messageHash, storedSignature)
        const receipt = await tx.wait()

        if (receipt && receipt.status === 1) {
          txHash = receipt.hash
        } else {
          throw new Error('Transaction failed')
        }
      } else if (kaiaProvider) {
        // Use Kaia Wallet directly
        const iface = new Interface(holderVerifierABI)
        const data = iface.encodeFunctionData('requestProvision', [publicKey, finschiaAddress, messageHash, storedSignature])

        txHash = await sendTransactionViaKaiaWallet(holderVerifierAddress, data)

        // Wait for receipt using JsonRpcProvider
        const receipt = await provider.waitForTransaction(txHash)
        if (!receipt || receipt.status !== 1) {
          throw new Error('Transaction failed')
        }
      } else {
        throw new Error('No wallet connected')
      }

      setProvisionTxHash(txHash)
      setProvisionJustSucceeded(true)

      // Refresh record after provision
      await fetchRecord(finschiaAddress)

      // Check claimed status for the new sequence
      const holderVerifierContractRead = new Contract(holderVerifierAddress, holderVerifierABI, provider)
      const newSeq = await holderVerifierContractRead.provisionSeq(finschiaAddress)
      await checkIfClaimed(newSeq.toString())
    } catch (err: any) {
      console.error('Provision error:', err)
      // Instead of showing the error message, notify the user to try again
      setProvisionError('Failed to request provision. Please refresh the page and try again from the beginning.')
    } finally {
      setProvisionLoading(false)
    }
  }

  const handleRequestClaim = async () => {
    if (!provisionSeq || provisionSeq === '0') {
      setClaimError('No provision sequence available')
      return
    }

    setClaimLoading(true)
    setClaimError('')
    setClaimTxHash('')
    setClaimJustSucceeded(false)

    try {
      // Get wallet address for balance checking
      const walletAddress = await getWalletAddress()
      if (!walletAddress) {
        throw new Error('Wallet not connected')
      }

      // Get balance before claim
      const balanceBefore = await getKaiaBalance(walletAddress)
      setBalanceBeforeClaim(balanceBefore)

      let txHash: string

      // Check if we should use wagmi or Kaia Wallet
      if (walletClient) {
        // Use wagmi (MetaMask)
        const signer = await getSigner()
        const bridgeContract = new Contract(bridgeAddress, bridgeABI, signer)
        const tx = await bridgeContract.requestClaim(provisionSeq)
        const receipt = await tx.wait()

        if (receipt && receipt.status === 1) {
          txHash = receipt.hash
        } else {
          throw new Error('Transaction failed')
        }
      } else if (kaiaProvider) {
        // Use Kaia Wallet directly
        const iface = new Interface(bridgeABI)
        const data = iface.encodeFunctionData('requestClaim', [provisionSeq])

        txHash = await sendTransactionViaKaiaWallet(bridgeAddress, data)

        // Wait for receipt using JsonRpcProvider
        const receipt = await provider.waitForTransaction(txHash)
        if (!receipt || receipt.status !== 1) {
          throw new Error('Transaction failed')
        }
      } else {
        throw new Error('No wallet connected')
      }

      setClaimTxHash(txHash)
      setClaimJustSucceeded(true)

      // Get balance after claim
      const balanceAfter = await getKaiaBalance(walletAddress)
      setBalanceAfterClaim(balanceAfter)

      // Update claimed status
      setHasClaimed(true)
    } catch (err: any) {
      console.error('Claim error:', err)
      // Instead of showing the error message, notify the user to try again
      setClaimError('Failed to request claim. Please refresh the page and try again from the beginning.')
    } finally {
      setClaimLoading(false)
    }
  }

  return {
    loading,
    finschiaAddress,
    signAndDerive,
    errorMsg,
    signature: storedSignature,
    conyBalance,
    provisionSeq,
    recordLoading,
    hasProvisionedBefore,
    canRequestProvision,
    provisionLoading,
    requestProvision: handleRequestProvision,
    provisionError,
    provisionTxHash,
    provisionJustSucceeded,
    claimLoading,
    claimError,
    claimTxHash,
    hasClaimed,
    claimJustSucceeded,
    canRequestClaim,
    requestClaim: handleRequestClaim,
    balanceBeforeClaim,
    balanceAfterClaim,
    balanceBeforeClaimKaia: keiToKaia(balanceBeforeClaim),
    balanceAfterClaimKaia: keiToKaia(balanceAfterClaim),
    balanceDifferenceKaia: calculateKaiaDifference(balanceBeforeClaim, balanceAfterClaim),
    checkingClaimed,
  }
}