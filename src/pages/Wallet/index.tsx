import { ReactElement } from 'react'

import { PageContainer, SideMenuListType } from '@/components'
import { RoutePath } from '@/types'

const subMenuList: SideMenuListType = [
  {
    title: 'Metamask',
    to: RoutePath.Wallet,
  },
  {
    title: 'RainbowKit',
    to: RoutePath.Wallet_RainbowKit,
  },
  {
    title: 'Kaiawallet Extension',
    to: RoutePath.Wallet_KaiawalletExtension,
    isKaiaOnly: true,
  },
  {
    title: 'Kaiawallet Mobile',
    to: RoutePath.Wallet_KaiawalletMobile,
    isKaiaOnly: true,
  },
  {
    title: 'Klip',
    to: RoutePath.Wallet_Klip,
    isKaiaOnly: true,
  },
]

const Account = (): ReactElement => {
  return <PageContainer menuList={subMenuList} />
}

export default Account
