import { useState, useEffect } from 'react'
import { JsonRpcProvider, BrowserProvider, hashMessage, SigningKey, Contract, getBytes, sha256, ripemd160 } from 'ethers'
import * as bech32lib from 'bech32'
import type { BechLib } from 'bech32'
import { useSignMessage, useWalletClient } from 'wagmi'
import { useNetwork } from '../independent'

const BRIDGE_MESSAGE = 'KaiaBridge'
// In the browser, Vite exposes bech32 functions directly on the module
const bech32 = ((bech32lib as any).toWords ? bech32lib : bech32lib.bech32) as BechLib

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
  const { rpcUrl } = useNetwork()
  const provider = new JsonRpcProvider(rpcUrl)
  const { signMessageAsync, data: signature } = useSignMessage()
  const { data: walletClient } = useWalletClient()

  const holderVerifierABI = [
    "function getRecord(string) view returns (uint256, uint64)",
    "function requestProvision(bytes publicKey, string fnsaAddress, bytes32 messageHash, bytes signature)",
    "function provisionSeq(string) view returns (uint64)",
  ]

  const bridgeABI = [
    "function claimed(uint64) view returns (bool)",
    "function requestClaim(uint64)",
  ]

  const holderVerifierKairosAddress = "0x6dc8f41BFfD51C20437df7B0eD5E17716802E4EF"
  const bridgeKairosAddress = "0xF02C6c29611e7eC05e4429ce440E1fF40c9b730a"

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

  const deriveFinschiaAddress = (sig: string) => {
    const digest = hashMessage(BRIDGE_MESSAGE)
    const recoveredPubKey = SigningKey.recoverPublicKey(digest, sig)
    const finschiaAddress = pubkeyToFinschiaAddress(recoveredPubKey)
    return finschiaAddress
  }

  const getUncompressedPublicKey = (sig: string): string => {
    const digest = hashMessage(BRIDGE_MESSAGE)
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

  const fetchRecord = async (address: string) => {
    setRecordLoading(true)
    setConyBalance('')
    setProvisionSeq('')
    try {
      const holderVerifierContract = new Contract(holderVerifierKairosAddress, holderVerifierABI, provider)
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

  const signAndDerive = async () => {
    setErrorMsg('')
    setFinschiaAddress('')
    setConyBalance('')
    setProvisionSeq('')
    setProvisionJustSucceeded(false)
    setProvisionTxHash('')
    setClaimJustSucceeded(false)
    setClaimTxHash('')
    setLoading(true)

    try {
      const sig = await signMessageAsync({ message: BRIDGE_MESSAGE })
      const fnsa = deriveFinschiaAddress(sig)
      setFinschiaAddress(fnsa)

      // Automatically fetch record after deriving address
      await fetchRecord(fnsa)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign message or derive address')
    } finally {
      setLoading(false)
    }
  }

  // Auto-derive when signature changes (from external signing)
  useEffect(() => {
    if (signature) {
      try {
        const fnsa = deriveFinschiaAddress(signature)
        setFinschiaAddress(fnsa)
        setProvisionJustSucceeded(false)
        setProvisionTxHash('')
        setClaimJustSucceeded(false)
        setClaimTxHash('')
        fetchRecord(fnsa)
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to derive Finschia address')
      }
    }
  }, [signature])

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
      const bridgeContract = new Contract(bridgeKairosAddress, bridgeABI, provider)
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
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }
    const browserProvider = new BrowserProvider(walletClient as any)
    return await browserProvider.getSigner()
  }

  const handleRequestProvision = async () => {
    if (!finschiaAddress) {
      setProvisionError('Please derive Finschia address first')
      return
    }

    if (!signature) {
      setProvisionError('Signature not found. Please sign the message again.')
      return
    }

    setProvisionLoading(true)
    setProvisionError('')
    setProvisionTxHash('')
    setProvisionJustSucceeded(false)

    try {
      const signer = await getSigner()

      // Prepare the message hash
      const messageHash = hashMessage(BRIDGE_MESSAGE)

      // Get the uncompressed public key from the signature
      const publicKey = getUncompressedPublicKey(signature)

      const holderVerifierContract = new Contract(holderVerifierKairosAddress, holderVerifierABI, signer)
      const tx = await holderVerifierContract.requestProvision(publicKey, finschiaAddress, messageHash, signature)
      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        setProvisionTxHash(receipt.hash)
        setProvisionJustSucceeded(true)
      } else {
        throw new Error('Transaction failed')
      }

      // Refresh record after provision
      await fetchRecord(finschiaAddress)

      // Check claimed status for the new sequence
      const holderVerifierContractRead = new Contract(holderVerifierKairosAddress, holderVerifierABI, provider)
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
      const signer = await getSigner()
      const walletAddress = await signer.getAddress()

      // Get balance before claim
      const balanceBefore = await getKaiaBalance(walletAddress)
      setBalanceBeforeClaim(balanceBefore)

      const bridgeContract = new Contract(bridgeKairosAddress, bridgeABI, signer)
      const tx = await bridgeContract.requestClaim(provisionSeq)
      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        setClaimTxHash(receipt.hash)
        setClaimJustSucceeded(true)
      } else {
        throw new Error('Transaction failed')
      }

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
    signature: signature || '',
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
    checkingClaimed,
  }
}