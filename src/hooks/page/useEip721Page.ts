import { useEffect, useState } from 'react'

import { SdkObject, SdkType } from '@/types'
import { useAccount, useSendTransaction } from 'wagmi'
import { encodeDeployData } from 'viem'
import { Contract } from 'web3'
import { ethers } from 'ethers'
import { useNetwork } from '../independent'
import { parseError } from '@/common'

export type UseEip721PageReturn = {
  sdk: SdkType
  setSdk: (sdk: SdkType) => void
  bytecode: string
  setBytecode: (bytecode: string) => void
  abi: string
  setAbi: (abi: string) => void
  deployContract: () => void
  deployResult: SdkObject
  ableToDeploy: boolean
}

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

export const useEip721Page = (): UseEip721PageReturn => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()
  const [sdk, setSdk] = useState<SdkType>('viem')
  const [bytecode, setBytecode] = useState('')
  const [abi, setAbi] = useState('')
  const [deployResult, setDeployResult] = useState(DefaultSdkObject)

  const ableToDeploy = !!bytecode && !!abi && !!address
  const deployContract = async (): Promise<void> => {
    if (!ableToDeploy) return
    let encodedData: `0x${string}` | null = null
    
    // For ERC-721, we need name, symbol, and initialOwner as constructor arguments
    const name = 'MyNFT'
    const symbol = 'MNFT'
    
    if (sdk === 'viem') {
      encodedData = encodeDeployData({
        abi: JSON.parse(abi),
        bytecode: bytecode as `0x${string}`,
        args: [name, symbol, address], // ERC-721 constructor args
      })
    } else if (sdk === 'ethers') {
      const cf = new ethers.ContractFactory(JSON.parse(abi), bytecode)
      const deployTx = await cf.getDeployTransaction(...[name, symbol, address])

      encodedData = deployTx.data as `0x${string}`
    } else if (sdk === 'web3') {
      const contract = new Contract(JSON.parse(abi))

      encodedData = contract
        .deploy({ data: bytecode, arguments: [name, symbol, address] })
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

  useEffect(() => {
    setDeployResult(DefaultSdkObject)
  }, [bytecode, abi, address, chainId])

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
  }
}
