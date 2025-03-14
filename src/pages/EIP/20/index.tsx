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
import { useEip20Page } from '@/hooks/page/useEip20Page'

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

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ToolkitToken is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("ToolkitToken", "TKT")
        Ownable(initialOwner)
        ERC20Permit("ToolkitToken")
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

const ERC20 = (): ReactElement => {
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
  } = useEip20Page()
  const data = EIP.list.find((item) => item.no === '20')

  return (
    <Container
      title="ERC-20: Fungible Token Standard"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-20`,
        text: data?.summary ?? '',
      }}
    >
      <Card>
        <details style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
          <StyledSummary>Features</StyledSummary>
          <View>
            <KaText fontType="body/lg_700">Pausable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows certain contract functions (such as transfers, minting, swapping) to be paused or resumed. 
Useful for security measures and emergency response.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Mintable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Enables an administrator to mint new tokens.
Used in ERC-20 and ERC-721 tokens when token supply is dynamic.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">Burnable</KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows users to permanently destroy (burn) their tokens. 
Reduces the total supply and is useful for deflationary token models.`}
            </StyledDesc>
          </View>
          <View>
            <KaText fontType="body/lg_700">
              Permit{' '}
              <span
                onClick={(): void => {
                  navigate(RoutePath.EIP_2612 as any)
                }}
                style={{ cursor: 'pointer', color: getTheme('info', '4') }}
              >
                (EIP-2612)
              </span>
            </KaText>
            <StyledDesc fontType="body/md_700" color={getTheme('gray', '2')}>
              {`Allows users to approve ERC-20 transfers with a signature instead of an on-chain transaction.
Reduces gas costs and improves user experience.`}
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
            title="Deploy ERC-20 contract"
            topComp={
              <StyledDeployForm>
                <KaButton
                  onClick={(): void => {
                    setBytecode(CONTRACT.ERC20.bytecode)
                    setAbi(JSON.stringify(CONTRACT.ERC20.abi, null, 2))
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

export default ERC20
