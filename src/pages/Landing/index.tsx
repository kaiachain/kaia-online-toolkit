import { ReactElement } from 'react'
import styled from 'styled-components'
import kaiaBrandImg from '@/images/kaia_brand.svg'
import {
  KaButton,
  KaLogo,
  KaText,
  themeFunc,
  useKaTheme,
} from '@kaiachain/kaia-design-system'

import { Card, LinkA, Row, View } from '@/components'
import { useAppNavigate, useLayout } from '@/hooks'
import { RoutePath } from '@/types'
import { STYLE, URL_MAP } from '@/consts'
import { castRoutePath } from '../../utils/navigation'

import metamaskImg from '@/images/metamask.svg'
import rainbowkitImg from '@/images/rainbowkit.png'

const StyledContainer = styled(View)`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 60px;
  margin-bottom: 200px;
`

const StyledTop = styled(View)`
  margin-top: 120px;
  align-items: center;
  gap: 20px;
  text-align: center;

  @media ${STYLE.media.tablet} {
    margin-top: 80px;
  }
`

const StyledHeroTitle = styled.h1`
  font-size: 140px;
  line-height: 140px;
  color: ${themeFunc('gray', '0')};
  margin: 0;
`

const StyledWalletGrid = styled(View)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;

  @media ${STYLE.media.tablet} {
    grid-template-columns: 1fr;
  }
`

const StyledSection = styled(View)`
  gap: 20px;
  align-items: center;
`

const Landing = (): ReactElement => {
  const { navigate } = useAppNavigate()
  const { getTheme } = useKaTheme()
  const { isUnderTabletWidth } = useLayout()

  return (
    <StyledContainer>
      <StyledTop>
        <View style={{ paddingBottom: 80 }}>
          {!isUnderTabletWidth && (
            <Row style={{ alignItems: 'baseline', gap: 42, paddingBottom: 50 }}>
              <img src={kaiaBrandImg} alt="logo" style={{ height: 110 }} />
              <StyledHeroTitle>Toolkit</StyledHeroTitle>
            </Row>
          )}
          <KaText fontType="title/sm_700" color={getTheme('gray', '0')}>
            Tools, resources, and guidance to make your Web3 journey seamless.
          </KaText>
        </View>
        <View>
          <KaButton size="md" onClick={() => navigate(castRoutePath(RoutePath.Account))}>
            Start from account
          </KaButton>
        </View>
      </StyledTop>
      <StyledSection>
        <KaText fontType="title/md_700">Wallet integration</KaText>

        <StyledWalletGrid>
          <Card>
            <Row style={{ gap: 10 }}>
              <View style={{ alignItems: 'center', gap: 10 }}>
                <KaLogo.LightSymbolKaiaWallet width={50} />
                <KaText fontType="body/md_400">KaiaWallet</KaText>
              </View>
              <View style={{ gap: 10, flex: 1 }}>
                <KaButton type="secondary" fill>
                  Mobile
                </KaButton>
                <KaButton type="secondary" fill>
                  Extension
                </KaButton>
              </View>
            </Row>
          </Card>
          <Card>
            <Row style={{ gap: 10 }}>
              <View style={{ alignItems: 'center', gap: 10 }}>
                <img src={rainbowkitImg} style={{ width: 50 }} />
                <KaText fontType="body/md_400">RainbowKit</KaText>
              </View>
              <View style={{ gap: 10, flex: 1, alignItems: 'center' }}>
                <KaButton
                  type="secondary"
                  fill
                  onClick={() => navigate(castRoutePath(RoutePath.Wallet_RainbowKit))}
                >
                  Tryout
                </KaButton>
                <LinkA link={URL_MAP.rainbowKit}>Official Docs</LinkA>
              </View>
            </Row>
          </Card>
          <Card>
            <Row style={{ gap: 10 }}>
              <View style={{ alignItems: 'center', gap: 10 }}>
                <img src={metamaskImg} style={{ width: 50 }} />
                <KaText fontType="body/md_400">Metamask</KaText>
              </View>
              <View style={{ gap: 10, flex: 1, alignItems: 'center' }}>
                <KaButton
                  type="secondary"
                  fill
                  onClick={() => navigate(castRoutePath(RoutePath.Wallet))}
                >
                  Tryout
                </KaButton>
                <LinkA link={URL_MAP.metamaskDocs}>Official Docs</LinkA>
              </View>
            </Row>
          </Card>
        </StyledWalletGrid>
      </StyledSection>
      <StyledSection>
        <KaText fontType="title/md_700">Others</KaText>
        <Card>
          <KaText fontType="title/xs_700">SDK Extensions</KaText>
          <View>
            <KaText fontType="body/md_400" color={getTheme('gray', '2')}>
              Learn how to use SDKs and Libraries to build your own blockchain
            </KaText>
            <LinkA link="https://docs.kaia.io/references/sdk/">
              SDKs and Libraries docs
            </LinkA>
          </View>
        </Card>
        <Card>
          <KaText fontType="title/xs_700">Enhanced JSON-RPC methods</KaText>
          <View>
            <KaText fontType="body/md_400" color={getTheme('gray', '2')}>
              Fully compatible with Ethereum JSON-RPC methods.
            </KaText>
            <LinkA link="https://docs.kaia.io/references/public-en/#mainnet-public-json-rpc-endpoints">
              Public JSON-RPC Endpoints
            </LinkA>
          </View>
          <View>
            <KaText fontType="body/md_400" color={getTheme('gray', '2')}>
              Fully compatible with Ethereum JSON-RPC methods.
            </KaText>
            <LinkA link="https://docs.kaia.io/references/json-rpc/eth/accounts/">
              Ethereum JSON-RPC methods
            </LinkA>
          </View>
          <View>
            <KaText fontType="body/md_400" color={getTheme('gray', '2')}>
              Enabling support for various account types and gas fee delegation
              features.
            </KaText>
            <LinkA link="https://docs.kaia.io/references/json-rpc/kaia/get-account/">
              Kaia JSON-RPC methods
            </LinkA>
          </View>
        </Card>
      </StyledSection>
    </StyledContainer>
  )
}

export default Landing
