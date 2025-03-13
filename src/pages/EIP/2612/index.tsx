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

const ERC2612 = (): ReactElement => {
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
    activeTab,
    setActiveTab,
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
