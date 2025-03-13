import { ReactElement } from 'react'
import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { View, CodeBlock } from '@/components'

const StyledDesc = styled(KaText)`
  padding: 4px 0 10px 4px;
`

const ViemExample = (): ReactElement => {
  const { getTheme } = useKaTheme()

  const installCode = `npm install viem`

  const importCode = `import { 
  createWalletClient, 
  http, 
  parseAbi, 
  encodeDeployData,
  createPublicClient
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'`

  const deployCode = `// 1. Define your contract ABI and bytecode
const abi = parseAbi([
  'constructor(address initialOwner)',
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  // ... other ERC20 functions
])

const bytecode = '0x608060405234801561001057600080fd5b5060...' // Contract bytecode

// 2. Create a wallet client
// IMPORTANT: Never hardcode private keys in production code
// Use environment variables or secure key management solutions
const account = privateKeyToAccount(process.env.PRIVATE_KEY as \`0x\${string}\`)
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http()
})

// 3. Encode the deployment data with constructor arguments
const encodedDeployData = encodeDeployData({
  abi,
  bytecode,
  args: [account.address], // Pass the initialOwner address
})

// 4. Deploy the contract
const hash = await walletClient.deployContract({
  abi,
  bytecode,
  args: [account.address],
})

// 5. Wait for the transaction to be mined
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
const receipt = await publicClient.waitForTransactionReceipt({ hash })

console.log('Contract deployed at:', receipt.contractAddress)`

  const interactCode = `// Interact with the deployed contract
const contractAddress = receipt.contractAddress

// Create a contract instance
const permitToken = {
  address: contractAddress,
  abi
}

// Example: Using permit function
// 1. Get the domain separator and other EIP-712 data
const domain = {
  name: 'PermitToken',
  version: '1',
  chainId: mainnet.id,
  verifyingContract: contractAddress
}

const types = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
}

// 2. Prepare permit data
const spender = '0xSpenderAddress'
const value = 1000000000000000000n // 1 token with 18 decimals
const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now
const nonce = await publicClient.readContract({
  ...permitToken,
  functionName: 'nonces',
  args: [account.address]
})

const message = {
  owner: account.address,
  spender,
  value,
  nonce,
  deadline
}

// 3. Sign the permit
const signature = await account.signTypedData({
  domain,
  types,
  primaryType: 'Permit',
  message
})

// 4. Extract v, r, s from signature
const r = signature.slice(0, 66)
const s = '0x' + signature.slice(66, 130)
const v = parseInt(signature.slice(130, 132), 16)

// 5. Call the permit function
await walletClient.writeContract({
  ...permitToken,
  functionName: 'permit',
  args: [account.address, spender, value, deadline, v, r, s]
})`

  return (
    <View>
      <KaText fontType="body/lg_700">Viem Implementation</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`Viem is a TypeScript interface for Ethereum that provides low-level stateless primitives for interacting with Ethereum. Here's how to deploy an ERC20Permit token using Viem:`}
      </StyledDesc>

      <KaText fontType="body/md_700">Installation</KaText>
      <CodeBlock text={installCode} />

      <KaText fontType="body/md_700">Imports</KaText>
      <CodeBlock text={importCode} />

      <KaText fontType="body/md_700">Deploying the Contract</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`The following code demonstrates how to deploy an ERC20Permit token contract using Viem. It includes setting up the wallet client, encoding the deployment data with constructor arguments, and deploying the contract.`}
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

export default ViemExample
