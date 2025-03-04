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
import { useExplorer, useNetwork } from '@/hooks'
import { SdkObject } from '@/types'
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

import {ERC1155} from "@openzeppelin/contracts@5.2.0/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts@5.2.0/access/Ownable.sol";

contract ToolkitToken is ERC1155, Ownable {
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        mint(msg.sender, 0, 1, '');
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
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

const ERC1155 = (): ReactElement => {
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
            <KaText fontType="body/lg_700">Pausable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows token transfers to be paused by designated addresses.
Useful for emergency response and security measures during critical situations.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Burnable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Enables users to destroy their own tokens, reducing the total supply.
Provides a standard way to remove tokens from circulation when they're no longer needed.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Supply</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Adds tracking of total supply per token ID.
Useful for distinguishing between fungible and non-fungible tokens within the same contract.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">URIStorage</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Provides storage-based token URI management for individual token types.
Allows setting different URIs for each token ID while maintaining a common base URI.`}
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
