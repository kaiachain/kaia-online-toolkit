import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Outlet, useLocation } from 'react-router'
import { KaButton, KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useSwitchChain } from 'wagmi'

import { Card, CodeBlock, LinkA, PageContainer, Row, View } from '@/components'
import { RoutePath } from '@/types'
import { EIP, NETWORK, STYLE, URL_MAP } from '@/consts'
import { useNetwork } from '@/hooks'

const StyledContractLinkGrid = styled(Row)`
  gap: 20px;
`

const StyledTopBox = styled(View)`
  padding: 20px 20px 0;

  @media ${STYLE.media.mobile} {
    padding: 20px 3% 0;
  }
`

const subMenuList = [
  {
    title: 'About',
    to: RoutePath.EIP,
  },
].concat(
  EIP.list.map((item) => ({
    title: `${item.no}. ${item.title}`,
    to: item.to,
  }))
)

const EIPIndex = (): ReactElement => {
  const { pathname } = useLocation()
  const { chain } = useAccount()
  const { getTheme } = useKaTheme()
  const { switchChainAsync } = useSwitchChain()
  const { chainId: appChainId } = useNetwork()
  const [switchChainErrMsg, setSwitchChainErrMsg] = useState('')

  const contractRelated = [
    RoutePath.EIP_20,
    RoutePath.EIP_721,
    RoutePath.EIP_1155,
    RoutePath.EIP_2612,
  ].includes(pathname as RoutePath)

  return (
    <PageContainer menuList={subMenuList}>
      {contractRelated && (
        <StyledTopBox>
          <Card>
            <StyledContractLinkGrid>
              <View>
                <LinkA link={URL_MAP.remix}>Remix</LinkA>
                <KaText fontType="body/xs_700">Ethereum IDE</KaText>
              </View>
              <View>
                <LinkA link={URL_MAP.openZeppelinWizard}>OpenZeppelin</LinkA>
                <KaText fontType="body/xs_700">Contract wizard</KaText>
              </View>
            </StyledContractLinkGrid>
            <ConnectButton chainStatus="none" />
            {chain && chain?.id !== Number(appChainId) && (
              <View>
                <KaText fontType="body/md_700" color={getTheme('danger', '5')}>
                  {`Project network(${NETWORK.evmChainParams[appChainId].chainName}) and wallet network(${chain.name}) are not the same.`}
                </KaText>
                <KaButton
                  type="secondary"
                  onClick={() => {
                    setSwitchChainErrMsg('')
                    switchChainAsync({ chainId: Number(appChainId) }).catch(
                      (e) => {
                        setSwitchChainErrMsg(JSON.stringify(e, null, 2))
                      }
                    )
                  }}
                >
                  Switch wallet chain
                </KaButton>
                {switchChainErrMsg && (
                  <CodeBlock text={switchChainErrMsg} toggle={false} />
                )}
              </View>
            )}
          </Card>
        </StyledTopBox>
      )}
      <Outlet />
    </PageContainer>
  )
}

export default EIPIndex
