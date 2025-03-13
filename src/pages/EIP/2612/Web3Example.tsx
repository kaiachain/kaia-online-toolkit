import { ReactElement } from 'react'
import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { View, CodeBlock } from '@/components'

const StyledDesc = styled(KaText)`
  padding: 4px 0 10px 4px;
`

const Web3Example = (): ReactElement => {
  const { getTheme } = useKaTheme()

  const installCode = `npm install web3`

  const importCode = `import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'`

  const deployCode = `// 1. Define your contract ABI and bytecode
const abi = [
  {
    "inputs": [{"name": "initialOwner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"},
      {"name": "value", "type": "uint256"},
      {"name": "deadline", "type": "uint256"},
      {"name": "v", "type": "uint8"},
      {"name": "r", "type": "bytes32"},
      {"name": "s", "type": "bytes32"}
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ... other ERC20 functions
]

const bytecode = '0x608060405234801561001057600080fd5b5060...' // Contract bytecode

// 2. Connect to the Ethereum network
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_KEY')

// 3. Set up account with private key
// IMPORTANT: Never hardcode private keys in production code
// Use environment variables or secure key management solutions
const privateKey = process.env.PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE' // Replace with your private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey)
web3.eth.accounts.wallet.add(account)
const fromAddress = account.address

// 4. Create contract instance
const contract = new web3.eth.Contract(abi)

// 5. Prepare deployment transaction
const deployTx = contract.deploy({
  data: bytecode,
  arguments: [fromAddress] // Pass the initialOwner address
})

// 6. Estimate gas for deployment
const gas = await deployTx.estimateGas({ from: fromAddress })

// 7. Deploy the contract
console.log('Deploying contract...')
const deployedContract = await deployTx.send({
  from: fromAddress,
  gas,
  gasPrice: await web3.eth.getGasPrice()
})

const contractAddress = deployedContract.options.address
console.log('Contract deployed at:', contractAddress)`

  const interactCode = `// Interact with the deployed contract
// 1. Create a contract instance for the deployed contract
const permitToken = new web3.eth.Contract(abi, contractAddress)

// 2. Get the domain separator data for EIP-712 signing
const name = await permitToken.methods.name().call()
const version = '1'
const chainId = await web3.eth.getChainId()
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

// 5. Prepare permit data
const spender = '0xSpenderAddress'
const value = web3.utils.toWei('1', 'ether') // 1 token with 18 decimals
const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
const nonce = await permitToken.methods.nonces(fromAddress).call()

// 6. Create the permit message
const message = {
  owner: fromAddress,
  spender,
  value,
  nonce,
  deadline
}

// 7. Create the data to sign (EIP-712 format)
const data = JSON.stringify({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Permit: types.Permit
  },
  primaryType: 'Permit',
  domain,
  message
})

// 8. Sign the typed data
const signature = await web3.eth.accounts.sign(
  web3.utils.keccak256(data),
  privateKey
)

// 9. Extract v, r, s from signature
const r = signature.r
const s = signature.s
// Convert v to the format expected by the contract
const v = parseInt(signature.v, 16)

// 10. Call the permit function
await permitToken.methods.permit(
  fromAddress,
  spender,
  value,
  deadline,
  v,
  r,
  s
).send({
  from: fromAddress,
  gas: await permitToken.methods.permit(
    fromAddress,
    spender,
    value,
    deadline,
    v,
    r,
    s
  ).estimateGas({ from: fromAddress })
})

console.log('Permit transaction successful')

// 11. Check the allowance (should be equal to the value we set)
const allowance = await permitToken.methods.allowance(fromAddress, spender).call()
console.log('Allowance:', web3.utils.fromWei(allowance, 'ether'))`

  return (
    <View>
      <KaText fontType="body/lg_700">Web3.js Implementation</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`Web3.js is a collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket. Here's how to deploy an ERC20Permit token using Web3.js:`}
      </StyledDesc>

      <KaText fontType="body/md_700">Installation</KaText>
      <CodeBlock text={installCode} />

      <KaText fontType="body/md_700">Imports</KaText>
      <CodeBlock text={importCode} />

      <KaText fontType="body/md_700">Deploying the Contract</KaText>
      <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
        {`The following code demonstrates how to deploy an ERC20Permit token contract using Web3.js. It includes setting up the Web3 instance, creating a contract object, and deploying the contract with constructor arguments.`}
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

export default Web3Example
