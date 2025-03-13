import { ReactElement } from 'react'
import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { View, CodeBlock } from '@/components'

const StyledDesc = styled(KaText)`
  padding: 4px 0 10px 4px;
`

const EthersExample = (): ReactElement => {
  const { getTheme } = useKaTheme()

  const installCode = `npm install ethers`

  const importCode = `import { ethers } from 'ethers'`

  const deployCode = `// 1. Define your contract ABI and bytecode
const abi = [
  "constructor(address initialOwner)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  // ... other ERC20 functions
]

const bytecode = '0x608060405234801561001057600080fd5b5060...' // Contract bytecode

// 2. Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY')

// 3. Create a wallet instance
// IMPORTANT: Never hardcode private keys in production code
// Use environment variables or secure key management solutions
const privateKey = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE' // Replace with your private key
const wallet = new ethers.Wallet(privateKey, provider)

// 4. Create a contract factory
const factory = new ethers.ContractFactory(abi, bytecode, wallet)

// 5. Deploy the contract with constructor arguments
const deployTx = await factory.getDeployTransaction(wallet.address)
console.log('Deployment transaction data:', deployTx.data)

// 6. Send the deployment transaction
const deploymentTransaction = await wallet.sendTransaction(deployTx)
console.log('Deployment transaction hash:', deploymentTransaction.hash)

// 7. Wait for the transaction to be mined
const receipt = await deploymentTransaction.wait()
const contractAddress = receipt.contractAddress
console.log('Contract deployed at:', contractAddress)`

  const interactCode = `// Interact with the deployed contract
// 1. Create a contract instance
const permitToken = new ethers.Contract(contractAddress, abi, wallet)

// 2. Get the domain separator for EIP-712 signing
const name = await permitToken.name()
const version = '1'
const chainId = (await provider.getNetwork()).chainId
const verifyingContract = contractAddress

// 3. Create the domain separator
const domain = {
  name,
  version,
  chainId,
  verifyingContract
}

// 4. Define the types for EIP-712 typed data
const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

// 5. Prepare the permit data
const spender = '0xSpenderAddress'
const value = ethers.parseEther('1.0') // 1 token with 18 decimals
const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
const nonce = await permitToken.nonces(wallet.address)

// 6. Create the permit message
const message = {
  owner: wallet.address,
  spender,
  value,
  nonce,
  deadline
}

// 7. Sign the permit message
const signature = await wallet.signTypedData(domain, types, message)

// 8. Split the signature into v, r, s components
const sig = ethers.Signature.from(signature)
const { v, r, s } = sig

// 9. Call the permit function
const permitTx = await permitToken.permit(
  wallet.address,
  spender,
  value,
  deadline,
  v,
  r,
  s
)

// 10. Wait for the transaction to be mined
await permitTx.wait()
console.log('Permit transaction successful')

// 11. Check the allowance (should be equal to the value we set)
const allowance = await permitToken.allowance(wallet.address, spender)
console.log('Allowance:', ethers.formatEther(allowance))`

  return (
    <View>
      <KaText fontType="body/lg_700">Ethers.js Implementation</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`Ethers.js is a complete, compact and lightweight library for interacting with the Ethereum blockchain and its ecosystem. Here's how to deploy an ERC20Permit token using Ethers.js:`}
      </StyledDesc>

      <KaText fontType="body/md_700">Installation</KaText>
      <CodeBlock text={installCode} />

      <KaText fontType="body/md_700">Imports</KaText>
      <CodeBlock text={importCode} />

      <KaText fontType="body/md_700">Deploying the Contract</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`The following code demonstrates how to deploy an ERC20Permit token contract using Ethers.js. It includes setting up the wallet, creating a contract factory, and deploying the contract with constructor arguments.`}
      </StyledDesc>
      <CodeBlock text={deployCode} />

      <KaText fontType="body/md_700">Interacting with Permit Functionality</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`After deployment, you can interact with the permit functionality. This example shows how to create and sign a permit message using EIP-712 typed data, and then call the permit function.`}
      </StyledDesc>
      <CodeBlock text={interactCode} />
    </View>
  )
}

export default EthersExample
