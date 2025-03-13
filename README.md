# Kaia Online Toolkit

Kaia Online Toolkit provides code examples and a web application to help developers utilize the Kaia blockchain and its SDK (caver-js) easily. The toolkit serves as both a reference implementation and a practical set of tools for blockchain developers building applications on the Kaia network.

You can access the live toolkit at: https://toolkit.kaia.io/

## Features

### Wallet Integration
- **Web3Modal Integration** with multiple wallet providers:
  - Kaikas Wallet
  - Klip Wallet
  - Metamask
  - RainbowKit
  - OKX Wallet
   
### Account Management
- Create and manage different account types:
  - Basic accounts
  - Mnemonic-based accounts
  - Keystore (v3) management
  - Kaia-specific account key types:
    - AccountKeyPublic
    - AccountKeyWeightedMultiSig
    - AccountKeyRoleBased

### Token Standards
- Deploy and interact with various token standards:
  - ERC-20 / KIP-7 (Fungible Tokens)
  - ERC-721 / KIP-17 (Non-Fungible Tokens)
  - ERC-1155 / KIP-37 (Multi Tokens)
  - ERC-2612 (Permit)

### Blockchain Utilities
- **Block & Transaction Tools**:
  - Block information retrieval
  - RLP encoding and decoding
- **Utility Tools**:
  - Unit converter (kei, Gkei, KAIA)
  - Address checksum verification
  - Signature verification

## Installation

1. Clone the repository
```bash
git clone https://github.com/kaiachain/kaia-online-toolkit.git
cd kaia-online-toolkit
```

2. Install dependencies
```bash
yarn
```

3. Run the development server
```bash
yarn dev
```

The application will be available at `http://localhost:5173/`

## Wallet Integration Examples

### Kaikas Wallet
Download [@klaytn/kaikas-web3-provider](https://github.com/klaytn/kaikas-web3-provider) package. The following code shows how to configure the provider options:

```javascript
import Web3 from "web3";
import Web3Modal from "web3modal";
import { KaikasWeb3Provider } from "@klaytn/kaikas-web3-provider"

const providerOptions = {
  kaikas: {
    package: KaikasWeb3Provider // required
  }
};

const web3Modal = new Web3Modal({
    providerOptions: providerOptions //required
});

const provider = await web3Modal.connect();

const web3 = new Web3(provider);
```

### Klip Wallet
Download [@klaytn/klip-web3-provider](https://github.com/klaytn/klip-web3-provider) package first. Then you can easily integrate Klip wallet as below:
```javascript
import Web3 from "web3";
import Web3Modal from "web3modal";
import { KlipWeb3Provider } from "@klaytn/klip-web3-provider"

const providerOptions = {
    klip: {
        package: KlipWeb3Provider, //required
        options: {
            bappName: "web3Modal Example App", //required
            rpcUrl: "RPC URL" //required
        }
    }
};

const web3Modal = new Web3Modal({
    providerOptions: providerOptions //required
});

const provider = await web3Modal.connect();

const web3 = new Web3(provider);
```

### RainbowKit Integration
The toolkit also demonstrates integration with RainbowKit for a more customizable wallet connection experience:

```javascript
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, kaia, kairos } from 'wagmi/chains';
import { kaiaWallet } from '@rainbow-me/rainbowkit/wallets';

const config = getDefaultConfig({
  appName: 'Kaia Toolkit',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, kaia, kairos],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [kaiaWallet],
    },
  ],
});

// In your App component
return (
  <WagmiProvider config={config}>
    <RainbowKitProvider>
      <YourApp />
    </RainbowKitProvider>
  </WagmiProvider>
);
```

## Usage Examples

### Unit Converter
Convert between different Kaia token units (kei, Gkei, KAIA):

```javascript
// Using viem
import { formatUnits } from 'viem'
  
const kei = 1000000000000000000n
const Gkei = formatUnits(kei, 9)
const KAIA = formatUnits(kei, 18)

// Using ethers
import { ethers } from 'ethers'

const kei = 1000000000000000000n
const Gkei = ethers.formatUnits(kei, 9)
const KAIA = ethers.formatUnits(kei, 18)

// Using web3
import { utils } from 'web3'

const kei = 1000000000000000000n
const Gkei = utils.fromWei(kei, 'gwei')
const KAIA = utils.fromWei(kei, 'ether')
```

### RLP Encoding/Decoding
Encode and decode data using Recursive Length Prefix (RLP):

```javascript
// Using viem
import { encodeAbiParameters, parseAbiParameters } from 'viem'

// Encode
const encoded = encodeAbiParameters(
  parseAbiParameters('address, uint256'),
  ['0x...', 123n]
)

// Using ethers
import { ethers } from 'ethers'

// Encode
const abiCoder = new ethers.AbiCoder()
const encoded = abiCoder.encode(
  ['address', 'uint256'],
  ['0x...', 123]
)
```

### Account Management
Create an account from a mnemonic:

```javascript
// Using viem
import { mnemonicToAccount } from 'viem/accounts'
import { english } from 'viem/accounts'

const account = mnemonicToAccount('your mnemonic phrase')

// Generate a random mnemonic
const randomMnemonic = english.generateMnemonic()
const newAccount = mnemonicToAccount(randomMnemonic)
```

## Project Structure

- `/src/pages/`: Contains the main UI components organized by functionality
  - `/src/pages/Account/`: Account management tools
  - `/src/pages/EIP/`: EIP implementation examples
  - `/src/pages/Wallet/`: Wallet integration components
  - `/src/pages/BlockTx/`: Block and transaction tools
  - `/src/pages/Utility/`: Various utility tools

- `/src/components/`: Reusable UI components
- `/src/hooks/`: Custom React hooks
- `/src/types/`: TypeScript type definitions
- `/src/consts/`: Configuration constants

## Additional Resources

- [Kaia Documentation](https://docs.kaia.io/)
- [Kaia Wallet Documentation](https://docs.kaiawallet.io/)
- [Kaia Faucet](https://www.kaia.io/faucet)
- [Ethereum Improvement Proposals](https://eips.ethereum.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
