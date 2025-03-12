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
  {
    title: 'Address Checksum',
    to: RoutePath.Utility_AddressChecksum,
  },
  {
    title: 'Signature Verify',
    to: RoutePath.Utility_SignVerify,
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
