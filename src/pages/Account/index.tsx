import { ReactElement } from 'react'

import { PageContainer } from '@/components'
import { RoutePath } from '@/types'

const subMenuList = [
  {
    title: 'Dev',
    to: RoutePath.Account_Dev,
  },
  {
    title: 'Account',
    to: RoutePath.Account,
  },
  {
    title: 'Mnemonic',
    to: RoutePath.Account_Mnemonic,
  },
  {
    title: 'KeystoreV3',
    to: RoutePath.Account_Keystore,
  },
  {
    title: 'KeystoreV4',
    isKaiaOnly: true,
    to: RoutePath.Account_KeystoreV4,
  },
  {
    title: 'AccountKeyPublic',
    isKaiaOnly: true,
    to: RoutePath.Account_AccountKeyPublic,
  },
  {
    title: 'AccountKeyFail',
    isKaiaOnly: true,
    to: RoutePath.Account_AccountKeyFail,
  },
  {
    title: 'AccountKeyWeightedMultiSig',
    isKaiaOnly: true,
    to: RoutePath.Account_AccountKeyWeightedMultiSig,
  },
  {
    title: 'AccountKeyRoleBased',
    isKaiaOnly: true,
    to: RoutePath.Account_AccountKeyRoleBased,
  },
]

const Account = (): ReactElement => {
  return <PageContainer menuList={subMenuList} />
}

export default Account
