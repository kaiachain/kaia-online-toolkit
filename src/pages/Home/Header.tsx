import { ReactElement, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  KaSelectBox,
  KaText,
  themeFunc,
  useKaTheme,
} from '@kaiachain/kaia-design-system'

import kaiaBrandImg from '@/images/kaia_brand.svg'
import { ReactComponent as MenuImg } from '@/images/menu.svg'

import { Row, View } from '@/components'
import { RoutePath } from '@/types'
import { useAppNavigate, useLayout, useNetwork } from '@/hooks'
import { useLocation } from 'react-router'
import { EvmChainIdEnum } from '@/consts'
import ClickAwayListener from 'react-click-away-listener'

const StyledContainer = styled(View)`
  background-color: ${themeFunc('gray', '10')};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const StyledMainNav = styled(Row)`
  padding: 16px 24px;
  justify-content: space-between;
`

const StyledText = styled(View)`
  color: white;
  text-align: center;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
`

const StyledMenuItem = styled(View)`
  cursor: pointer;
  height: 40px;
  justify-content: center;
`

const StyledHeightBar = styled(View)`
  height: 2px;
  background-color: ${themeFunc('brand', '5')};
  border-radius: 360px;
`

const StyledMobileMenuFloat = styled(View)`
  position: absolute;
  top: 60px;
  left: 12px;
  width: 100%;
  max-width: 300px;
  z-index: 100;
`

const StyledMobileMenu = styled(View)`
  background-color: ${themeFunc('gray', '10')};
  gap: 12px;
  padding: 24px 0;
  border-radius: 32px;
  box-shadow: 0px 16px 32px 0px ${themeFunc('gray', '8')};
`

const StyledMobileMenuItem = styled(View)`
  cursor: pointer;
  height: 20px;
  align-items: flex-start;
`

const StyledMobileHeightBar = styled(View)`
  width: 4px;
  height: 100%;
  background-color: ${themeFunc('brand', '5')};
  border-radius: 360px;
`

const menuList: {
  title: string
  to: RoutePath
}[] = [
  {
    title: 'Account',
    to: RoutePath.Account,
  },
  {
    title: 'EIP',
    to: RoutePath.EIP,
  },
  {
    title: 'Wallet',
    to: RoutePath.Wallet,
  },
  {
    title: 'Block & Tx',
    to: RoutePath.BlockTx_Block,
  },
  {
    title: 'Utility',
    to: RoutePath.Utility,
  },
]

const MenuItem = ({ title, to }: { title: string; to: RoutePath }) => {
  const { pathname } = useLocation()
  const isCurrent = pathname.includes(to)
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()

  return (
    <StyledMenuItem onClick={() => navigate(to)}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <KaText
          color={isCurrent ? getTheme('brand', '5') : getTheme('gray', '2')}
          fontType={isCurrent ? 'body/md_700' : 'body/md_400'}
        >
          {title}
        </KaText>
      </View>
      {isCurrent && <StyledHeightBar />}
    </StyledMenuItem>
  )
}

const MobileMenuItem = ({
  title,
  to,
  onClick,
}: {
  title: string
  to: RoutePath
  onClick: () => void
}) => {
  const { pathname } = useLocation()
  const isCurrent = pathname.includes(to)
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()

  return (
    <StyledMobileMenuItem
      onClick={() => {
        navigate(to)
        onClick()
      }}
    >
      <Row style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
        {isCurrent ? <StyledMobileHeightBar /> : <View style={{ width: 4 }} />}
        <KaText
          color={isCurrent ? getTheme('brand', '5') : getTheme('gray', '2')}
          fontType={isCurrent ? 'body/md_700' : 'body/md_400'}
        >
          {title}
        </KaText>
      </Row>
    </StyledMobileMenuItem>
  )
}

const Header = (): ReactElement => {
  const { chainId, changeNetwork } = useNetwork()
  const { navigate } = useAppNavigate()
  const { isUnderTabletWidth } = useLayout()
  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  const networkOptionList: { label: string; value: EvmChainIdEnum }[] = useMemo(
    () => [
      {
        label: isUnderTabletWidth ? 'Ethereum' : 'Ethereum (1)',
        value: EvmChainIdEnum.ETHEREUM,
      },
      {
        label: isUnderTabletWidth ? 'Sepolia' : 'Sepolia (11155111)',
        value: EvmChainIdEnum.SEPOLIA,
      },
      {
        label: isUnderTabletWidth ? 'Kaia' : 'Kaia (8217)',
        value: EvmChainIdEnum.KAIA,
      },
      {
        label: isUnderTabletWidth ? 'Kairos' : 'Kairos (1001)',
        value: EvmChainIdEnum.KAIROS,
      },
    ],
    [isUnderTabletWidth]
  )

  useEffect(() => {
    if (!isUnderTabletWidth) {
      setOpenMobileMenu(false)
    }
  }, [isUnderTabletWidth])

  return (
    <StyledContainer>
      <StyledMainNav>
        {isUnderTabletWidth && (
          <View
            style={{ justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => {
              setOpenMobileMenu(!openMobileMenu)
            }}
          >
            <MenuImg style={{ height: 24 }} />
          </View>
        )}
        <View
          style={{ justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => navigate(RoutePath.Home)}
        >
          <Row style={{ alignItems: 'baseline', gap: 6.2 }}>
            <img src={kaiaBrandImg} alt="logo" style={{ height: 16 }} />
            <StyledText>Toolkit</StyledText>
          </Row>
        </View>
        {!isUnderTabletWidth && (
          <Row style={{ gap: 40 }}>
            {menuList.map((menu) => (
              <MenuItem key={menu.title} title={menu.title} to={menu.to} />
            ))}
          </Row>
        )}
        <KaSelectBox
          containerStyle={{ maxWidth: isUnderTabletWidth ? 120 : 200 }}
          selectedValue={chainId}
          optionList={networkOptionList}
          onSelect={(value) => {
            changeNetwork(value as EvmChainIdEnum)
          }}
        />
      </StyledMainNav>
      {openMobileMenu && (
        <ClickAwayListener onClickAway={() => setOpenMobileMenu(false)}>
          <StyledMobileMenuFloat>
            <StyledMobileMenu>
              {menuList.map((menu) => (
                <MobileMenuItem
                  key={menu.title}
                  title={menu.title}
                  to={menu.to}
                  onClick={() => setOpenMobileMenu(false)}
                />
              ))}
            </StyledMobileMenu>
          </StyledMobileMenuFloat>
        </ClickAwayListener>
      )}
    </StyledContainer>
  )
}

export default Header
