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
import { useEip721Page } from '@/hooks/page/useEip721Page'

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

import {ERC721} from "@openzeppelin/contracts@5.2.0/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts@5.2.0/access/Ownable.sol";

contract ToolkitToken is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("ToolkitToken", "TKT")
        Ownable(initialOwner)
    {
        safeMint(msg.sender);
    }

    function safeMint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
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
const deployTx = await cf.getDeployTransaction(address)
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

const ERC721 = (): ReactElement => {
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
  } = useEip721Page()
  const data = EIP.list.find((item) => item.no === '721')

  return (
    <Container
      title="ERC-721: Non-Fungible Token Standard"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-721`,
        text: data?.summary ?? '',
      }}
    >
      <Card>
        <details style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
          <StyledSummary>Features</StyledSummary>
          <View>
            <KaText fontType="body/lg_700">Burnable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows token holders to destroy their own tokens.
Provides a way to permanently remove tokens from circulation.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Enumerable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Enables on-chain enumeration of all tokens or tokens owned by an address.
Adds functionality to track and query the total supply and token ownership.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">URIStorage</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`A more flexible but more expensive way of storing token metadata.
Allows for dynamic URI updates for individual tokens after minting.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Votes</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Support for voting and vote delegation with ERC-721 tokens.
Enables token-based governance where each NFT represents voting power.`}
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
            title="Deploy ERC-721 contract"
            topComp={
              <StyledDeployForm>
                <KaButton
                  onClick={(): void => {
                    setBytecode(CONTRACT.ERC721.bytecode)
                    setAbi(JSON.stringify(CONTRACT.ERC721.abi, null, 2))
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

export default ERC721
