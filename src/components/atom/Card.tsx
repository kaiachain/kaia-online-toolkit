import { themeFunc } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'
import { View } from './View'

export const Card = styled(View)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;
  width: 100%;
  background: ${themeFunc('gray', '10')};
  border-radius: 24px;
  box-sizing: border-box;
`
