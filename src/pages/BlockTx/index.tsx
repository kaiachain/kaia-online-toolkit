import { ReactElement } from 'react'
import { Outlet } from 'react-router'

import { PageContainer } from '@/components'
import { RoutePath } from '@/types'

const subMenuList = [
  {
    title: 'Block Info',
    to: RoutePath.BlockTx,
  },
  {
    title: 'RLP Encode',
    to: RoutePath.BlockTx_RlpEncode,
  },
  {
    title: 'RLP Decode',
    to: RoutePath.BlockTx_RlpDecode,
  },
]

const Utility = (): ReactElement => {
  return (
    <PageContainer menuList={subMenuList}>
      <Outlet />
    </PageContainer>
  )
}

export default Utility
