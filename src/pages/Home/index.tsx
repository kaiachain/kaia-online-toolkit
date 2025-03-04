import { ReactElement } from 'react'
import { Outlet } from 'react-router'
import styled from 'styled-components'
import { themeFunc } from '@kaiachain/kaia-design-system'

import { View } from '@/components'

import Header from './Header'

const StyledOuter = styled(View)`
  min-height: 100dvh;
  background-color: #111111;
`

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`

const StyledOutlet = styled(Outlet)`
  height: 100%;
  background-color: ${themeFunc('elevation', '10')};
`

const Home = (): ReactElement => {
  return (
    <StyledOuter>
      <Header />
      <StyledMain>
        <StyledOutlet />
      </StyledMain>
    </StyledOuter>
  )
}

export default Home
