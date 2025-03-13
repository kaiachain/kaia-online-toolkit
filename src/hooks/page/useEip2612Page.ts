import { useEffect, useState } from 'react'

import { SdkObject, SdkType } from '@/types'
import { useAccount, useSendTransaction } from 'wagmi'
import { encodeDeployData, encodeFunctionData, parseEther } from 'viem'
import { Contract } from 'web3'
import { ethers } from 'ethers'
import { useNetwork } from '../independent'
import { parseError } from '@/common'

export type UseEip2612PageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  bytecode: string
  setBytecode: (bytecode: string) => void
  abi: string
  setAbi: (abi: string) => void
  deployContract: () => Promise<void>
  deployResult: SdkObject
  ableToDeploy: boolean
  activeTab: SdkType
  setActiveTab: (tab: SdkType) => void
  contractAddress: string
  setContractAddress: (address: string) => void
  generatePermit: () => Promise<void>
  permitResult: SdkObject
  ableToPermit: boolean
}

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

// Dead address as spender
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'

export const useEip2612Page = (): UseEip2612PageReturn => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [activeTab, setActiveTab] = useState<SdkType>('viem')
  const [bytecode, setBytecode] = useState('')
  const [abi, setAbi] = useState('')
  const [deployResult, setDeployResult] = useState(DefaultSdkObject)
  const [contractAddress, setContractAddress] = useState('')
  const [permitResult, setPermitResult] = useState(DefaultSdkObject)

  const ableToDeploy = !!bytecode && !!abi && !!address
  const ableToPermit = !!contractAddress && !!address

  const deployContract = async (): Promise<void> => {
    if (!ableToDeploy) return
    let encodedData: `0x${string}` | null = null
    if (sdk === 'viem') {
      encodedData = encodeDeployData({
        abi: JSON.parse(abi),
        bytecode: bytecode as `0x${string}`,
        args: [address],
      })
    } else if (sdk === 'ethers') {
      const cf = new ethers.ContractFactory(JSON.parse(abi), bytecode)
      const deployTx = await cf.getDeployTransaction(...[address])

      encodedData = deployTx.data as `0x${string}`
    } else if (sdk === 'web3') {
      const contract = new Contract(JSON.parse(abi))

      encodedData = contract
        .deploy({ data: bytecode, arguments: [address] })
        .encodeABI() as `0x${string}`
    }

    if (encodedData) {
      const res = { ...deployResult }
      await sendTransactionAsync(
        {
          data: encodedData,
          value: 0n,
        },
        {
          onSuccess: (data) => {
            res[sdk] = data
            setDeployResult(res)
          },
          onError: (error) => {
            res[sdk] = parseError(error)
            setDeployResult(res)
          },
        }
      )
      window.scrollBy({ top: 100, left: 0, behavior: 'smooth' })
    }
  }

  // Generate permit signature and call permit function
  const generatePermit = async (): Promise<void> => {
    if (!ableToPermit) return
    
    try {
      const res = { ...permitResult }
      const tokenValue = parseEther('10') // 10 tokens
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now
      
      // Get the contract instance based on SDK
      if (sdk === 'viem') {
        // Viem implementation for permit
        const permitData = encodeFunctionData({
          abi: JSON.parse(abi),
          functionName: 'permit',
          args: [
            address as `0x${string}`,
            DEAD_ADDRESS as `0x${string}`,
            tokenValue,
            deadline,
            27, // v (placeholder)
            '0x0000000000000000000000000000000000000000000000000000000000000000', // r (placeholder)
            '0x0000000000000000000000000000000000000000000000000000000000000000', // s (placeholder)
          ],
        })
        
        res[sdk] = `Permit function data generated: ${permitData}\n\nTo execute this permit, you would need to:\n1. Get the domain separator from the contract\n2. Create and sign the permit message\n3. Extract v, r, s from the signature\n4. Call the permit function with the actual signature values`
      } else if (sdk === 'ethers') {
        // Ethers implementation for permit
        res[sdk] = `To generate a permit with ethers.js:\n\n1. Create domain data:\nconst domain = {\n  name: "PermitToken",\n  version: "1",\n  chainId: ${chainId},\n  verifyingContract: "${contractAddress}"\n}\n\n2. Define types:\nconst types = {\n  Permit: [\n    { name: "owner", type: "address" },\n    { name: "spender", type: "address" },\n    { name: "value", type: "uint256" },\n    { name: "nonce", type: "uint256" },\n    { name: "deadline", type: "uint256" }\n  ]\n}\n\n3. Create permit data:\nconst values = {\n  owner: "${address}",\n  spender: "${DEAD_ADDRESS}",\n  value: ${tokenValue.toString()},\n  nonce: 0, // Get from contract\n  deadline: ${deadline.toString()}\n}\n\n4. Sign the typed data and extract v, r, s\n5. Call the permit function with the signature components`
      } else if (sdk === 'web3') {
        // Web3 implementation for permit
        res[sdk] = `To generate a permit with web3.js:\n\n1. Create domain data:\nconst domain = {\n  name: "PermitToken",\n  version: "1",\n  chainId: ${chainId},\n  verifyingContract: "${contractAddress}"\n}\n\n2. Define types:\nconst types = {\n  Permit: [\n    { name: "owner", type: "address" },\n    { name: "spender", type: "address" },\n    { name: "value", type: "uint256" },\n    { name: "nonce", type: "uint256" },\n    { name: "deadline", type: "uint256" }\n  ]\n}\n\n3. Create permit data:\nconst values = {\n  owner: "${address}",\n  spender: "${DEAD_ADDRESS}",\n  value: ${tokenValue.toString()},\n  nonce: 0, // Get from contract\n  deadline: ${deadline.toString()}\n}\n\n4. Sign the typed data and extract v, r, s\n5. Call the permit function with the signature components`
      }
      
      setPermitResult(res)
      window.scrollBy({ top: 100, left: 0, behavior: 'smooth' })
    } catch (error) {
      const res = { ...permitResult }
      res[sdk] = parseError(error)
      setPermitResult(res)
    }
  }

  useEffect(() => {
    setDeployResult(DefaultSdkObject)
  }, [bytecode, abi, address, chainId])

  useEffect(() => {
    setPermitResult(DefaultSdkObject)
  }, [contractAddress, address, chainId])

  return {
    sdk,
    setSdk,
    bytecode,
    setBytecode,
    abi,
    setAbi,
    deployContract,
    deployResult,
    ableToDeploy,
    activeTab,
    setActiveTab,
    contractAddress,
    setContractAddress,
    generatePermit,
    permitResult,
    ableToPermit,
  }
}
