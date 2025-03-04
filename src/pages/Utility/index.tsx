import { ReactElement } from 'react'
import { Outlet } from 'react-router'

import { PageContainer } from '@/components'
import { RoutePath } from '@/types'

const subMenuList = [
  {
    title: 'About',
    to: RoutePath.Utility,
  },
  {
    title: 'Unit Converter',
    to: RoutePath.Utility_UnitConverter,
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
