import { ReactElement } from 'react'
import {
  KaButton,
  KaText,
  KaTextInput,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import {
  Container,
  View,
  LinkA,
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

import {ERC20} from "@openzeppelin/contracts@5.2.0/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts@5.2.0/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts@5.2.0/access/Ownable.sol";

contract TKT is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("TKT", "TKT")
        Ownable(initialOwner)
        ERC20Permit("TKT")
    {
        mint(msg.sender, 100 * 10 ** decimals());
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
    `import { encodeDeployData } from 'viem'`,
    `const encodedData = encodeDeployData({
  abi: JSON.parse(abi),
  bytecode: bytecode as \`0x\${string}\`,
  args: [address],
})`
  ),
  ethers: codeWrapper(
    `import { ethers } from 'ethers'`,
    `const cf = new ethers.ContractFactory(JSON.parse(abi), bytecode)
const deployTx = await cf.getDeployTransaction(...[address])
const encodedData = deployTx.data`
  ),
  web3: codeWrapper(
    `import Web3, { Contract } from 'web3'`,
    `const contract = new Contract(JSON.parse(abi))
const encodedData = contract
  .deploy({ data: bytecode, arguments: [address] })
  .encodeABI()`
  ),
  ethersExt: '',
  web3Ext: '',
}

const permitCodeExamples: SdkObject = {
  viem: `import { useViem } from '@/hooks/independent'
import { useWalletClient } from 'wagmi'

const { client } = useViem({ chainId })
const { data: walletClient } = useWalletClient()

const tokenName = await client.readContract({
  address: contractAddress as \`0x\${string}\`,
  abi: JSON.parse(abi),
  functionName: 'name',
  args: [],
})

const decimals = await client.readContract({
  address: contractAddress as \`0x\${string}\`,
  abi: JSON.parse(abi),
  functionName: 'decimals',
  args: [],
})

const nonce = await client.readContract({
  address: contractAddress as \`0x\${string}\`,
  abi: JSON.parse(abi),
  functionName: 'nonces',
  args: [address],
})

const tokenValue = BigInt(tokenAmount || '1') * 10n ** BigInt(decimals)
const deadline = BigInt(Math.floor(Date.now() / 1000) + 60)

const domainData = {
  name: tokenName,
  version: '1',
  chainId: Number(chainId),
  verifyingContract: contractAddress as \`0x\${string}\`,
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
const s = \`0x\${signature.slice(66, 130)}\`
const v = parseInt(signature.slice(130, 132), 16)

const hash = await walletClient.writeContract({
  address: contractAddress as \`0x\${string}\`,
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
})`,
  ethers: `import { ethers } from 'ethers'
import { useWalletClient } from 'wagmi'

const { data: walletClient } = useWalletClient()
const ethersProvider = walletClient ? new ethers.BrowserProvider(walletClient.transport) : null
const ethersSigner = await ethersProvider.getSigner(address)

const contract = new ethers.Contract(contractAddress, JSON.parse(abi), ethersSigner)

const decimals = Number(await contract.decimals())
const tokenValue = parseUnits(tokenAmount || '1', decimals)
const deadline = BigInt(Math.floor(Date.now() / 1000) + 60)
const nonce = await contract.nonces(address)
const tokenName = await contract.name()

let domainData = {
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
    if (eip712Domain.chainId) domainData.chainId = Number(eip712Domain.chainId)
    if (eip712Domain.verifyingContract) domainData.verifyingContract = eip712Domain.verifyingContract
  }
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

const message = {
  owner: address,
  spender: DEAD_ADDRESS,
  value: tokenValue,
  nonce: nonce,
  deadline: deadline
}

const signature = await ethersSigner.signTypedData(domainData, types, message)

const sig = ethers.Signature.from(signature)
const { v, r, s } = sig

const tx = await contract.permit(
  address,
  DEAD_ADDRESS,
  tokenValue,
  deadline,
  v,
  r,
  s
)

await tx.wait()`,
  web3: `import Web3 from 'web3'
import { useWalletClient } from 'wagmi'

const { data: walletClient } = useWalletClient()
const web3 = new Web3(walletClient)
const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: address })

const decimals = Number(await contract.methods.decimals().call())
const tokenName = String(await contract.methods.name().call())
const nonce = String(await contract.methods.nonces(address).call())

const tokenValue = web3.utils.toBigInt(BigInt(tokenAmount || '1') * BigInt(10) ** BigInt(decimals))
const deadline = Math.floor(Date.now() / 1000) + 60

const domainData = {
  name: tokenName,
  version: '1',
  chainId: Number(chainId),
  verifyingContract: contractAddress,
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
    verifyingContract: domainData.verifyingContract as \`0x\${string}\`,
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
  .send({ from: address })`,
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
    tokenAmount,
    setTokenAmount,
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
          <ActionCard
            title="Generate Permit Signature"
            topComp={
              <StyledDeployForm>
                <KaText fontType="body/md_700">Contract Address</KaText>
                <KaTextInput
                  inputProps={{
                    value: contractAddress,
                    onChangeText: setContractAddress,
                    placeholder: '0x... (deployed contract address)',
                  }}
                />
                <KaText fontType="body/md_700">Token Amount</KaText>
                <KaTextInput
                  inputProps={{
                    value: tokenAmount,
                    onChangeText: setTokenAmount,
                    placeholder: 'Enter token amount',
                  }}
                />
                <StyledDesc
                  fontType="body/md_700"
                  color={getTheme('gray', '2')}
                >
                  {`This will generate a permit signature allowing 0x000...00dead to spend your tokens on your behalf.`}
                </StyledDesc>
              </StyledDeployForm>
            }
            code={permitCodeExamples[sdk]}
            btnDisabled={!ableToPermit}
            onClickBtn={generatePermit}
            result={permitResult[sdk]}
          />
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
