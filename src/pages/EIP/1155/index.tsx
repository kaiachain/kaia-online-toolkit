import { ReactElement } from 'react'
import {
  font,
  KaButton,
  KaText,
  themeFunc,
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
import { useAppNavigate, useExplorer, useNetwork } from '@/hooks'
import { RoutePath, SdkObject } from '@/types'
import { useEip1155Page } from '@/hooks/page/useEip1155Page'

const StyledSummary = styled.summary`
  cursor: pointer;
  color: ${themeFunc('brand', '5')};
  ${font['title/xs_700'].styles}
`

const StyledDesc = styled(KaText)`
  padding: 4px 0 10px 4px;
`

const StyledDeployForm = styled(View)`
  gap: 10px;
`

const solidity = `// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ToolkitMultiToken is ERC1155, Ownable {
    constructor(address initialOwner, string memory uri_)
        ERC1155(uri_)
        Ownable(initialOwner)
    {
        // Mint some initial tokens to the deployer
        _mint(msg.sender, 0, 1000, ""); // Fungible token with ID 0
        _mint(msg.sender, 1, 1, "");    // Non-fungible token with ID 1
        _mint(msg.sender, 2, 100, "");  // Semi-fungible token with ID 2
    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) 
        public 
        onlyOwner 
    {
        _mint(to, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
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
  args: [address, ""],
})`
  ),
  ethers: codeWrapper(
    `import { ethers } from 'ethers'`,
    `const cf = new ethers.ContractFactory(abi, bytecode)
const deployTx = await cf.getDeployTransaction(...[address, ""])
const encodedData = deployTx.data`
  ),
  web3: codeWrapper(
    `import { Contract } from 'web3'`,
    `const contract = new Contract(abi)

const encodedData = contract
  .deploy({ data: bytecode, arguments: [address, ""] })
  .encodeABI()`
  ),
  ethersExt: '',
  web3Ext: '',
}

const ERC1155 = (): ReactElement => {
  const { address, chainId } = useAccount()
  const { chainId: appChainId } = useNetwork()
  const showDeployForm = address && chainId === Number(appChainId)
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()
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
  } = useEip1155Page()
  const data = EIP.list.find((item) => item.no === '1155')

  return (
    <Container
      title="ERC-1155: Multi Token Standard"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-1155`,
        text: data?.summary ?? '',
      }}
    >
      <Card>
        <details style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
          <StyledSummary>Features</StyledSummary>
          <View>
            <KaText fontType="body/lg_700">Multi-Token Support</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows a single contract to manage multiple token types (fungible, non-fungible, and semi-fungible).
Reduces deployment costs and simplifies token management compared to separate ERC-20 and ERC-721 contracts.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Batch Operations</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Enables efficient batch transfers of multiple token types in a single transaction.
Significantly reduces gas costs for operations involving multiple tokens or recipients.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Metadata Handling</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Provides a standard way to associate metadata with tokens through URI mapping.
Supports both shared and token-specific metadata through URI substitution.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Receiver Interface</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Includes ERC1155TokenReceiver interface for secure token transfers to contracts.
Prevents tokens from being locked in contracts that don't support ERC-1155 tokens.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Approval Mechanism</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Uses setApprovalForAll to grant or revoke operator permissions for all tokens owned by an address.
Simplifies approval management compared to per-token approvals in ERC-20 and ERC-721.`}
            </StyledDesc>
          </View>
        </details>
      </Card>

      {showDeployForm ? (
        <>
          <SdkSelectBox
            sdk={sdk}
            setSdk={setSdk}
            optionsList={['viem', 'ethers', 'web3']}
          />
          <ActionCard
            title="Deploy ERC-1155 contract"
            topComp={
              <StyledDeployForm>
                <KaButton
                  onClick={(): void => {
                    setBytecode(CONTRACT.ERC1155.bytecode)
                    setAbi(JSON.stringify(CONTRACT.ERC1155.abi, null, 2))
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

export default ERC1155
