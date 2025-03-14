import { ReactElement, ReactNode, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Outlet } from 'react-router'
import {
  KaIcon,
  KaText,
  themeFunc,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import { useLocation } from 'react-router'

import kaiaImg from '@/images/kaia.svg'

import { Row, View } from '@/components'
import { useAppNavigate, useLayout } from '@/hooks'
import { RoutePath } from '@/types'
import { STYLE } from '@/consts'
import ClickAwayListener from 'react-click-away-listener'
import { castRoutePath } from '../../utils/navigation'

export type SideMenuListType = {
  title: string
  to: RoutePath
  isKaiaOnly?: boolean
}[]

const StyledContainer = styled(View)`
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100dvh;

  @media ${STYLE.media.tablet} {
    grid-template-columns: 8% 92%;
  }

  @media ${STYLE.media.mobile} {
    grid-template-columns: 14% 86%;
  }
`

const StyledBody = styled(View)`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 200px;
`

const StyledSideMenu = styled(View)`
  border-right: 2px solid ${themeFunc('gray', '8')};
`

const StyledSubMenuItem = styled(View)`
  cursor: pointer;
  height: 36px;
  justify-content: center;
`

const StyledSubHeightBar = styled(View)`
  height: 2px;
  background-color: ${themeFunc('gray', '2')};
  border-radius: 360px;
`

const mobileSubMenuOpen = keyframes`
  
  from {
    left: -100%;
  }
  to {
    left: 0;
  }
`

const mobileSubMenuClose = keyframes`
  from {
    left: 0;
  }
  to {
    left: -100%;
  }
`

const showSubMenu = keyframes`
  0% {
    opacity: 0;
    }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
        `

const StyledSubMenu = styled(View)<{ $isMobileOpen: boolean }>`
  padding: 20px;
  align-items: flex-start;
  background-color: ${themeFunc('gray', '10')};

  @media ${STYLE.media.tablet} {
    opacity: 0;
    box-shadow: 0px 16px 32px 0px ${themeFunc('gray', '8')};
    width: 50%;
    position: absolute;
    z-index: 10;
    animation: 0.5s
        ${({ $isMobileOpen }) =>
          $isMobileOpen ? mobileSubMenuOpen : mobileSubMenuClose}
        forwards,
      ${showSubMenu} 1s forwards;
  }

  @media ${STYLE.media.mobile} {
    width: 80%;
    padding: 20px 3%;
  }
`

const StyledSubMenuOpen = styled(View)`
  ${STYLE.clickable}
  padding-top: 20px;
  align-items: center;
  gap: 10px;
`

const StyledMobileSubMenuClose = styled(View)`
  ${STYLE.clickable}
  position: absolute;
  right: 20px;
  top: 20px;
`

const SubMenuItem = ({
  title,
  to,
  isKaiaOnly,
  onClick,
}: {
  title: string
  to: RoutePath
  isKaiaOnly?: boolean
  onClick: () => void
}) => {
  const { pathname } = useLocation()
  const isCurrent = pathname === to
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()

  return (
    <StyledSubMenuItem
      onClick={() => {
        navigate(castRoutePath(to))
        onClick()
      }}
    >
      <Row style={{ flex: 1, alignItems: 'center', gap: 4 }}>
        <KaText
          color={isCurrent ? getTheme('gray', '2') : getTheme('gray', '5')}
          fontType={isCurrent ? 'body/md_700' : 'body/md_400'}
        >
          {title}
        </KaText>
        {isKaiaOnly && <img src={kaiaImg} style={{ width: 20 }} />}
      </Row>
      {isCurrent && <StyledSubHeightBar />}
    </StyledSubMenuItem>
  )
}
const SideMenu = ({
  menuList,
}: {
  menuList: {
    title: string
    to: RoutePath
    isKaiaOnly?: boolean
  }[]
}): ReactElement => {
  const { isUnderTabletWidth } = useLayout()

  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(false)

  return (
    <ClickAwayListener onClickAway={() => setOpenMobileSubMenu(false)}>
      <StyledSideMenu>
        {isUnderTabletWidth && (
          <StyledSubMenuOpen onClick={() => setOpenMobileSubMenu(true)}>
            <KaIcon.ChevronRight fill="white" width={18} />
            <KaText color="white" fontType="body/md_400" center>
              {`Sub\nMenu`}
            </KaText>
          </StyledSubMenuOpen>
        )}
        <StyledSubMenu $isMobileOpen={openMobileSubMenu}>
          {menuList.map((item) => (
            <SubMenuItem
              key={item.title}
              title={item.title}
              to={item.to}
              isKaiaOnly={item.isKaiaOnly}
              onClick={() => setOpenMobileSubMenu(false)}
            />
          ))}
          {isUnderTabletWidth && (
            <StyledMobileSubMenuClose
              onClick={() => setOpenMobileSubMenu(false)}
            >
              <KaIcon.X fill="white" width={18} />
            </StyledMobileSubMenuClose>
          )}
        </StyledSubMenu>
      </StyledSideMenu>
    </ClickAwayListener>
  )
}

export const PageContainer = ({
  menuList,
  children,
}: {
  menuList: SideMenuListType
  children?: ReactNode
}): ReactElement => {
  return (
    <StyledContainer>
      <SideMenu menuList={menuList} />
      <StyledBody>{children ?? <Outlet />}</StyledBody>
    </StyledContainer>
  )
}
