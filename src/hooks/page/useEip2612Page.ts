import { useEffect, useState } from 'react'

import { SdkObject, SdkType } from '@/types'
import { useAccount, useSendTransaction, useWalletClient } from 'wagmi'
import { ethers, parseUnits } from 'ethers'
import { useNetwork, useViem } from '../independent'
import { parseError } from '@/common'
import Web3, { Contract } from 'web3'
import { encodeDeployData, keccak256, toBytes } from 'viem'

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
  const [sdk, setSdk] = useState<SdkType>('viem')
  const { client } = useViem({
    chainId: chainId,
  })

  const [bytecode, setBytecode] = useState('')
  const [abi, setAbi] = useState('')

  const [deployResult, setDeployResult] = useState(DefaultSdkObject)
  const [permitResult, setPermitResult] = useState(DefaultSdkObject)

  const [contractAddress, setContractAddress] = useState('')
  const [tokenAmount, setTokenAmount] = useState<string>('1')

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

  const generatePermit = async (): Promise<void> => {
    if (!ableToPermit) return

    try {
      const res = { ...permitResult }

      if (sdk === 'viem') {
        if (!walletClient) {
          throw new Error('Wallet is not connected.')
        }

        const tokenName = (await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: JSON.parse(abi),
          functionName: 'name',
          args: [],
        })) as string

        const decimals = (await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: JSON.parse(abi),
          functionName: 'decimals',
          args: [],
        })) as number

        const nonce = (await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: JSON.parse(abi),
          functionName: 'nonces',
          args: [address],
        })) as bigint

        const tokenValue = BigInt(tokenAmount || '1') * 10n ** BigInt(decimals)
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60)

        const domainData = {
          name: tokenName,
          version: '1',
          chainId: Number(chainId),
          verifyingContract: contractAddress as `0x${string}`,
        }

        const eip712Domain = (await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: JSON.parse(abi),
          functionName: 'eip712Domain',
          args: [],
        })) as any

        if (eip712Domain) {
          if (eip712Domain.name) domainData.name = eip712Domain.name
          if (eip712Domain.version) domainData.version = eip712Domain.version
          if (eip712Domain.chainId)
            domainData.chainId = Number(eip712Domain.chainId)
          if (eip712Domain.verifyingContract)
            domainData.verifyingContract = eip712Domain.verifyingContract
        }

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

        const signature = await walletClient.signTypedData({
          account: address,
          domain: domainData,
          types: types,
          primaryType: 'Permit',
          message: message,
        })

        const r = signature.slice(0, 66)
        const s = `0x${signature.slice(66, 130)}`
        const v = parseInt(signature.slice(130, 132), 16)

        try {
          const hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: JSON.parse(abi),
            functionName: 'permit',
            args: [
              address,
              DEAD_ADDRESS,
              tokenValue,
              deadline,
              BigInt(v),
              r,
              s,
            ],
          })

          res[
            sdk
          ] = `Permit successfully executed!\n\nTransaction hash: ${hash}\n\nDetails:\n- Owner: ${address}\n- Spender: ${DEAD_ADDRESS}\n- Amount: ${tokenAmount} tokens\n- Deadline: ${new Date(
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
              const PERMIT_TYPEHASH = await client.readContract({
                address: contractAddress as `0x${string}`,
                abi: JSON.parse(abi),
                functionName: 'PERMIT_TYPEHASH',
                args: [],
              })
              detailedError += `\nContract PERMIT_TYPEHASH: ${PERMIT_TYPEHASH}`
            } catch {
              const PERMIT_TYPEHASH = keccak256(
                toBytes(
                  'Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'
                )
              )
              detailedError += `\nCalculated PERMIT_TYPEHASH: ${PERMIT_TYPEHASH}`
            }
          }

          res[sdk] = detailedError
          setPermitResult(res)
        }
      } else if (sdk === 'ethers') {
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

        const decimals = Number(await contract.decimals())
        const tokenValue = parseUnits(tokenAmount || '1', decimals)
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60)
        const nonce = await contract.nonces(address)
        const tokenName = await contract.name()

        const domainData = {
          name: tokenName,
          version: '1',
          chainId: Number(chainId),
          verifyingContract: contractAddress,
        }
        if (typeof contract.eip712Domain === 'function') {
          const eip712Domain = await contract.eip712Domain()

          if (eip712Domain) {
            if (eip712Domain.name) domainData.name = eip712Domain.name
            if (eip712Domain.version) domainData.version = eip712Domain.version
            if (eip712Domain.chainId)
              domainData.chainId = Number(eip712Domain.chainId)
            if (eip712Domain.verifyingContract)
              domainData.verifyingContract = eip712Domain.verifyingContract
          }
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
            } catch {
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
      } else if (sdk === 'web3') {
        if (!walletClient) {
          throw new Error('Wallet is not connected.')
        }

        const web3 = new Web3(walletClient)
        const contract = new web3.eth.Contract(
          JSON.parse(abi),
          contractAddress,
          { from: address }
        )

        const decimals = Number(await contract.methods.decimals().call())
        const tokenName = String(await contract.methods.name().call())
        const nonce = String(await contract.methods.nonces(address).call())

        const tokenValue = web3.utils.toBigInt(
          BigInt(tokenAmount || '1') * BigInt(10) ** BigInt(decimals)
        )

        const deadline = Math.floor(Date.now() / 1000) + 60

        const domainData = {
          name: tokenName,
          version: '1',
          chainId: Number(chainId),
          verifyingContract: contractAddress,
        }

        if (contract.methods.eip712Domain) {
          const eip712Domain = await contract.methods.eip712Domain().call()
          if (eip712Domain && Array.isArray(eip712Domain)) {
            if (eip712Domain[0]) domainData.name = eip712Domain[0]
            if (eip712Domain[1]) domainData.version = eip712Domain[1]
            if (eip712Domain[2]) domainData.chainId = Number(eip712Domain[2])
            if (eip712Domain[3]) domainData.verifyingContract = eip712Domain[3]
          }
        }

        const types = {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
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
          value: tokenValue.toString(),
          nonce: nonce,
          deadline: deadline.toString(),
        }

        const signature = await walletClient.signTypedData({
          account: address,
          domain: {
            name: domainData.name,
            version: domainData.version,
            chainId: domainData.chainId,
            verifyingContract: domainData.verifyingContract as `0x${string}`,
          },
          types: {
            Permit: types.Permit,
          },
          primaryType: 'Permit',
          message: message,
        })

        const r = '0x' + signature.substring(2, 66)
        const s = '0x' + signature.substring(66, 130)
        const v = parseInt(signature.substring(130, 132), 16)

        try {
          const tx = await contract.methods
            .permit(
              address,
              DEAD_ADDRESS,
              tokenValue.toString(),
              deadline,
              v,
              r,
              s
            )
            .send({ from: address })

          res[sdk] = `Permit successfully executed!\n\nTransaction hash: ${
            tx.transactionHash
          }\n\nDetails:\n- Owner: ${address}\n- Spender: ${DEAD_ADDRESS}\n- Amount: ${tokenAmount} tokens\n- Deadline: ${new Date(
            deadline * 1000
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
              const PERMIT_TYPEHASH = await contract.methods
                .PERMIT_TYPEHASH()
                .call()
              detailedError += `\nContract PERMIT_TYPEHASH: ${PERMIT_TYPEHASH}`
            } catch {
              const PERMIT_TYPEHASH = web3.utils.keccak256(
                web3.utils.utf8ToHex(
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
