import { ReactElement } from 'react'
import {
  KaButton,
  KaText,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import {
  Container,
  View,
  LinkA,
  Card,
  ActionCard,
  SdkSelectBox,
  Textarea,
  CodeBlock,
} from '@/components'
import { EIP, URL_MAP, CONTRACT, NETWORK } from '@/consts'
import { useExplorer, useNetwork } from '@/hooks'
import { SdkObject } from '@/types'
import { useEip2612Page } from '@/hooks/page/useEip2612Page'

const StyledDesc = styled(KaText)`
  padding: 4px 0 10px 4px;
`

const StyledDeployForm = styled(View)`
  gap: 10px;
`

const solidity = `// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PermitToken is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("PermitToken", "PTK")
        Ownable(initialOwner)
        ERC20Permit("PermitToken")
    {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`

const codeWrapper = (
  children1: string,
  children2: string
) => `import { useAccount, useSendTransaction } from 'wagmi'
${children1}

const { address } = useAccount()
const { sendTransaction } = useSendTransaction()

${children2}

sendTransaction({
  data: encodedData,
  value: 0n,
})`

const codesForEncodedData: SdkObject = {
  viem: codeWrapper(
    `import { encodeDeployData, parseEther } from 'viem'`,
    `const encodedData = encodeDeployData({
  abi,
  bytecode,
  args: [address],
})`
  ),
  ethers: codeWrapper(
    `import { ethers } from 'ethers'`,
    `const cf = new ethers.ContractFactory(abi, bytecode)
const deployTx = await cf.getDeployTransaction(...[address])
const encodedData = deployTx.data`
  ),
  web3: codeWrapper(
    `import { Contract } from 'web3'`,
    `const contract = new Contract(abi)

const encodedData = contract
  .deploy({ data: bytecode, arguments: [address] })
  .encodeABI()`
  ),
  ethersExt: '',
  web3Ext: '',
}

// Permit function code examples for each SDK
const permitCodeExamples: SdkObject = {
  viem: `import { createWalletClient, custom, encodeFunctionData, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

// Connect to wallet
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})

// Contract details
const contractAddress = '0xContractAddress'
const tokenName = 'PermitToken'
const tokenVersion = '1'
const chainId = 1 // Replace with your chain ID
const owner = '0xYourAddress'
const spender = '0x000000000000000000000000000000000000dEaD'
const value = parseEther('10')
const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now

// 1. Get the nonce for the owner
const nonce = await readContract({
  address: contractAddress,
  abi,
  functionName: 'nonces',
  args: [owner]
})

// 2. Create the domain separator data
const domain = {
  name: tokenName,
  version: tokenVersion,
  chainId,
  verifyingContract: contractAddress
}

// 3. Define the types for EIP-712
const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

// 4. Create the permit data
const message = {
  owner,
  spender,
  value,
  nonce,
  deadline
}

// 5. Sign the typed data
const signature = await walletClient.signTypedData({
  account: owner,
  domain,
  types,
  primaryType: 'Permit',
  message
})

// 6. Split the signature into v, r, s components
const r = signature.slice(0, 66)
const s = '0x' + signature.slice(66, 130)
const v = parseInt(signature.slice(130, 132), 16)

// 7. Call the permit function
const permitData = encodeFunctionData({
  abi,
  functionName: 'permit',
  args: [owner, spender, value, deadline, v, r, s]
})

// 8. Send the transaction
const hash = await walletClient.sendTransaction({
  to: contractAddress,
  data: permitData
})

console.log('Permit transaction hash:', hash)`,

  ethers: `import { ethers } from 'ethers'

// Connect to provider and signer
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

// Contract details
const contractAddress = '0xContractAddress'
const tokenName = 'PermitToken'
const tokenVersion = '1'
const chainId = 1 // Replace with your chain ID
const owner = await signer.getAddress()
const spender = '0x000000000000000000000000000000000000dEaD'
const value = ethers.parseEther('10')
const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now

// 1. Create contract instance
const contract = new ethers.Contract(contractAddress, abi, signer)

// 2. Get the nonce for the owner
const nonce = await contract.nonces(owner)

// 3. Create the domain separator data
const domain = {
  name: tokenName,
  version: tokenVersion,
  chainId,
  verifyingContract: contractAddress
}

// 4. Define the types for EIP-712
const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

// 5. Create the permit data
const message = {
  owner,
  spender,
  value,
  nonce,
  deadline
}

// 6. Sign the typed data
const signature = await signer.signTypedData(domain, types, message)

// 7. Split the signature into v, r, s components
const sig = ethers.Signature.from(signature)
const { v, r, s } = sig

// 8. Call the permit function
const tx = await contract.permit(owner, spender, value, deadline, v, r, s)
await tx.wait()

console.log('Permit transaction hash:', tx.hash)`,

  web3: `import Web3 from 'web3'

// Connect to Web3
const web3 = new Web3(window.ethereum)
await window.ethereum.request({ method: 'eth_requestAccounts' })
const accounts = await web3.eth.getAccounts()
const owner = accounts[0]

// Contract details
const contractAddress = '0xContractAddress'
const tokenName = 'PermitToken'
const tokenVersion = '1'
const chainId = await web3.eth.getChainId()
const spender = '0x000000000000000000000000000000000000dEaD'
const value = web3.utils.toWei('10', 'ether')
const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

// 1. Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress)

// 2. Get the nonce for the owner
const nonce = await contract.methods.nonces(owner).call()

// 3. Create the domain separator data
const domain = {
  name: tokenName,
  version: tokenVersion,
  chainId,
  verifyingContract: contractAddress
}

// 4. Define the types for EIP-712
const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ],
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

// 5. Create the permit data
const message = {
  owner,
  spender,
  value,
  nonce,
  deadline
}

// 6. Create the data to sign (EIP-712 format)
const data = JSON.stringify({
  types,
  primaryType: 'Permit',
  domain,
  message
})

// 7. Sign the typed data
const signature = await web3.eth.personal.sign(
  web3.utils.keccak256(data),
  owner,
  ''
)

// 8. Split the signature into v, r, s components
const r = signature.slice(0, 66)
const s = '0x' + signature.slice(66, 130)
const v = parseInt(signature.slice(130, 132), 16)

// 9. Call the permit function
const tx = await contract.methods.permit(
  owner,
  spender,
  value,
  deadline,
  v,
  r,
  s
).send({ from: owner })

console.log('Permit transaction hash:', tx.transactionHash)`,
  ethersExt: '',
  web3Ext: '',
}

const ERC2612 = (): ReactElement => {
  const { address, chainId } = useAccount()
  const { chainId: appChainId } = useNetwork()
  const showDeployForm = address && chainId === Number(appChainId)
  const { getTheme } = useKaTheme()
  const { getExplorerLink } = useExplorer()
  const {
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
  } = useEip2612Page()
  const data = EIP.list.find((item) => item.no === '2612')

  return (
    <Container
      title="ERC-2612: Permit Extension for EIP-20 Signed Approvals"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-2612`,
        text: data?.summary ?? '',
      }}
    >
      <Card>
        <View>
          <KaText fontType="body/lg_700">Overview</KaText>
          <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
            {`ERC-2612 extends the ERC-20 standard with a permit function, enabling token approvals to be made with a signature instead of an on-chain transaction. This significantly improves user experience by eliminating the need for users to send a separate approval transaction before token transfers.`}
          </StyledDesc>
        </View>
        <View>
          <KaText fontType="body/lg_700">Key Benefits</KaText>
          <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
            {`• Gas Efficiency: Users don't need to pay gas for separate approval transactions
• Improved UX: Simplifies the token approval process
• Meta-transactions: Enables gasless transactions where a third party can pay for gas
• Compatibility: Fully compatible with existing ERC-20 functions`}
          </StyledDesc>
        </View>
        <View>
          <KaText fontType="body/lg_700">Implementation</KaText>
          <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
            {`The permit function uses EIP-712 typed structured data signing to securely validate approvals off-chain. The OpenZeppelin implementation provides a complete solution that handles domain separators, nonces, and signature verification.`}
          </StyledDesc>
          <CodeBlock text={solidity} />
        </View>
      </Card>

      {showDeployForm ? (
        <>
          <SdkSelectBox
            sdk={sdk}
            setSdk={setSdk}
            optionsList={['viem', 'ethers', 'web3']}
          />
          <ActionCard
            title="Deploy ERC-2612 contract"
            topComp={
              <StyledDeployForm>
                <KaButton
                  onClick={(): void => {
                    setBytecode(CONTRACT.ERC2612.bytecode)
                    setAbi(JSON.stringify(CONTRACT.ERC2612.abi, null, 2))
                  }}
                >
                  Tryout
                </KaButton>
                <CodeBlock
                  title="Solidity for the tryout contract"
                  text={solidity}
                />
                <KaText fontType="body/md_700">Bytecode</KaText>
                <Textarea
                  value={bytecode}
                  onChange={(e) => setBytecode(e.target.value)}
                  placeholder="0x..."
                />
                <KaText fontType="body/md_700">ABI</KaText>
                <Textarea
                  value={abi}
                  onChange={(e) => setAbi(e.target.value)}
                  placeholder="input abi"
                  rows={10}
                />
              </StyledDeployForm>
            }
            code={codesForEncodedData[sdk]}
            btnDisabled={!ableToDeploy}
            onClickBtn={deployContract}
            result={deployResult[sdk]}
            bottomComp={
              deployResult[sdk].startsWith('0x') && (
                <View>
                  <KaText fontType="body/md_700">Deployed contract</KaText>
                  <LinkA
                    link={getExplorerLink({
                      address: deployResult[sdk],
                      type: 'tx',
                    })}
                  >
                    View on Explorer
                  </LinkA>
                </View>
              )
            }
          />

          {/* Permit Section */}
          <Card>
            <KaText fontType="body/lg_700">EIP-712 Permit Signing</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`The permit function allows users to approve token transfers using an off-chain signature instead of an on-chain transaction. This example demonstrates how to generate a permit signature for the 0x000...00dead address as the spender.`}
            </StyledDesc>
            
            <ActionCard
              title="Generate Permit Signature"
              topComp={
                <StyledDeployForm>
                  <KaText fontType="body/md_700">Contract Address</KaText>
                  <Textarea
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x... (deployed contract address)"
                  />
                  <KaText fontType="body/md_700">Permit Details</KaText>
                  <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
                    {`This will generate a permit signature allowing 0x000...00dead to spend 10 tokens on your behalf.`}
                  </StyledDesc>
                </StyledDeployForm>
              }
              code={permitCodeExamples[sdk]}
              btnDisabled={!ableToPermit}
              onClickBtn={generatePermit}
              result={permitResult[sdk]}
            />
          </Card>
        </>
      ) : (
        <View>
          <KaText fontType="body/lg_700" color={getTheme('brand', '5')}>
            {`Please connect wallet and change network to ${NETWORK.evmChainParams[appChainId].chainName} to deploy contract`}
          </KaText>
        </View>
      )}
    </Container>
  )
}

export default ERC2612
