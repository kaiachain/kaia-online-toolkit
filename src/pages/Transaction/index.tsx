import { ReactElement } from 'react'
import { Outlet } from 'react-router'

import { PageContainer } from '@/components'

const Utility = (): ReactElement => {
  return (
    <PageContainer menuList={[]}>
      <Outlet />
    </PageContainer>
  )
}

export default Utility
