import { AccountKeyType as KaiaAccountKeyType } from '@kaiachain/web3js-ext'

export type SdkType = 'viem' | 'ethers' | 'web3' | 'ethersExt' | 'web3Ext'
export type SdkObject = Record<SdkType, string>

export type AccountKeyType =
  | AccountKeyNil
  | AccountKeyLegacy
  | AccountKeyPublic
  | AccountKeyFail
  | AccountKeyWeightedMultiSig
  | AccountKeyRoleBased

type AccountKeyNil = null
type AccountKeyLegacy = {
  keyType: KaiaAccountKeyType.Legacy
  key: {}
}
type AccountKeyPublic = {
  keyType: KaiaAccountKeyType.Public
  key: {
    x: string
    y: string
  }
}
type AccountKeyFail = {
  keyType: KaiaAccountKeyType.Fail
  key: {}
}

type AccountKeyWeightedMultiSig = {
  keyType: KaiaAccountKeyType.WeightedMultiSig
  key: {
    threshold: number
    keys: {
      weight: number
      key: {
        x: string
        y: string
      }
    }[]
  }
}

type AccountKeyRoleBased = {
  keyType: KaiaAccountKeyType.RoleBased
  key: [
    // RoleTransaction
    Exclude<AccountKeyType, AccountKeyRoleBased>,
    // RoleAccountUpdate
    Exclude<AccountKeyType, AccountKeyRoleBased>,
    // RoleFeePayer
    Exclude<AccountKeyType, AccountKeyRoleBased>
  ]
}
