import { useEffect, useState } from 'react'

import { SdkObject, SdkType } from '@/types'
import {
  useAccount,
  useSendTransaction,
  usePublicClient,
  useWalletClient,
} from 'wagmi'
import { ethers, parseUnits } from 'ethers'
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
  contractAddress: string
  setContractAddress: (address: string) => void
  generatePermit: () => Promise<void>
  permitResult: SdkObject
  ableToPermit: boolean
  tokenAmount: string
  setTokenAmount: (amount: string) => void
}

const DefaultSdkObject: SdkObject = {
  viem: '',
  ethers: '',
  web3: '',
  ethersExt: '',
  web3Ext: '',
}

const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'

export const useEip2612Page = (): UseEip2612PageReturn => {
  const { address } = useAccount()
  const { chainId } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()
  const { data: walletClient } = useWalletClient()
  const [sdk, setSdk] = useState<SdkType>('ethers')
  const [bytecode, setBytecode] = useState('')
  const [abi, setAbi] = useState('')
  const [deployResult, setDeployResult] = useState(DefaultSdkObject)
  const [contractAddress, setContractAddress] = useState('')
  const [permitResult, setPermitResult] = useState(DefaultSdkObject)
  const [tokenAmount, setTokenAmount] = useState<string>('1')

  const ableToDeploy = !!bytecode && !!abi && !!address
  const ableToPermit = !!contractAddress && !!address

  const deployContract = async (): Promise<void> => {
    if (!ableToDeploy) return
    let encodedData: `0x${string}` | null = null
    if (sdk === 'ethers') {
      const cf = new ethers.ContractFactory(JSON.parse(abi), bytecode)
      const deployTx = await cf.getDeployTransaction(...[address])

      encodedData = deployTx.data as `0x${string}`
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

  const generatePermit = async (): Promise<void> => {
    if (!ableToPermit) return

    try {
      const res = { ...permitResult }

      let decimals: number = 18
      try {
        if (sdk === 'ethers') {
          const ethersProvider = walletClient
            ? new ethers.BrowserProvider(walletClient.transport)
            : null

          if (!ethersProvider) {
            throw new Error('Wallet is not connected.')
          }

          const ethersSigner = await ethersProvider.getSigner(address)

          const contract = new ethers.Contract(
            contractAddress,
            JSON.parse(abi),
            ethersSigner
          )
          decimals = Number(await contract.decimals())
        }
      } catch (error) {
        throw new Error(
          `Failed to read token decimals: ${
            error instanceof Error ? error.message : 'Unknown error'
          }.`
        )
      }

      const tokenValue = parseUnits(tokenAmount || '1', decimals)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60)

      if (sdk === 'ethers') {
        const ethersProvider = walletClient
          ? new ethers.BrowserProvider(walletClient.transport)
          : null

        if (!ethersProvider) {
          throw new Error('Wallet is not connected.')
        }

        const ethersSigner = await ethersProvider.getSigner(address)

        const contract = new ethers.Contract(
          contractAddress,
          JSON.parse(abi),
          ethersSigner
        )

        const nonce = await contract.nonces(address)

        const tokenName = await contract.name()

        let domainData = {
          name: tokenName,
          version: '1',
          chainId: Number(chainId),
          verifyingContract: contractAddress,
        }

        try {
          if (typeof contract.eip712Domain === 'function') {
            const eip712Domain = await contract.eip712Domain()

            if (eip712Domain) {
              if (eip712Domain.name) domainData.name = eip712Domain.name
              if (eip712Domain.version)
                domainData.version = eip712Domain.version
              if (eip712Domain.chainId)
                domainData.chainId = Number(eip712Domain.chainId)
              if (eip712Domain.verifyingContract)
                domainData.verifyingContract = eip712Domain.verifyingContract
            }
          }
        } catch (e) {
          throw new Error(
            `Failed to get EIP-712 domain data from contract: ${
              e instanceof Error ? e.message : 'Unknown error'
            }.`
          )
        }

        const domain = domainData

        const types = {
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        }

        const message = {
          owner: address,
          spender: DEAD_ADDRESS,
          value: tokenValue,
          nonce: nonce,
          deadline: deadline,
        }

        const signature = await ethersSigner.signTypedData(
          domain,
          types,
          message
        )

        const sig = ethers.Signature.from(signature)
        const { v, r, s } = sig

        try {
          const tx = await contract.permit(
            address,
            DEAD_ADDRESS,
            tokenValue,
            deadline,
            v,
            r,
            s
          )
          await tx.wait()

          res[sdk] = `Permit successfully executed!\n\nTransaction hash: ${
            tx.hash
          }\n\nDetails:\n- Owner: ${address}\n- Spender: ${DEAD_ADDRESS}\n- Amount: ${tokenAmount} tokens\n- Deadline: ${new Date(
            Number(deadline) * 1000
          ).toLocaleString()}\n\nThe spender can now transfer up to ${tokenAmount} tokens from your account until the deadline.`

          setPermitResult(res)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)

          let detailedError = parseError(error)

          if (
            errorMessage.includes('ERC2612InvalidSigner') ||
            errorMessage.includes('custom error')
          ) {
            detailedError +=
              '\n\nThis could be due to domain separator mismatch.'

            try {
              const PERMIT_TYPEHASH = await contract.PERMIT_TYPEHASH()
              detailedError += `\nContract PERMIT_TYPEHASH: ${PERMIT_TYPEHASH}`
            } catch (e) {
              const PERMIT_TYPEHASH = ethers.keccak256(
                ethers.toUtf8Bytes(
                  'Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'
                )
              )
              detailedError += `\nCalculated PERMIT_TYPEHASH: ${PERMIT_TYPEHASH}`
            }
          }

          res[sdk] = detailedError

          setPermitResult(res)
        }
      }
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
    contractAddress,
    setContractAddress,
    generatePermit,
    permitResult,
    ableToPermit,
    tokenAmount,
    setTokenAmount,
  }
}
