export enum RoutePath {
  Home = '/',

  Account = '/account',
  Account_Dev = '/account/dev',
  //Account_Basic = '/account/basic',
  Account_Mnemonic = '/account/mnemonic',
  Account_Keystore = '/account/keystore',
  Account_AccountKeyPublic = '/account/accountKeyPublic',
  Account_AccountKeyFail = '/account/accountKeyFail',
  Account_AccountKeyWeightedMultiSig = '/account/accountKeyWeightedMultiSig',
  Account_AccountKeyRoleBased = '/account/accountKeyRoleBased',
  Account_KeystoreV4 = '/account/keystoreV4',

  EIP = '/eip',
  //EIP_About = '/eip/about',
  EIP_20 = '/eip/20',
  EIP_721 = '/eip/721',
  EIP_1155 = '/eip/1155',
  EIP_2612 = '/eip/2612',

  Wallet = '/wallet',
  //Wallet_Metamask = '/wallet/metamask',
  Wallet_RainbowKit = '/wallet/rainbowKit',
  Wallet_KaiawalletExtension = '/wallet/kaiawalletExtension',
  Wallet_KaiawalletMobile = '/wallet/kaiawalletMobile',
  Wallet_Klip = '/wallet/klip',

  Transaction = '/transaction',

  Utility = '/utility',
  //Utility_About = '/utility/about',
  Utility_UnitConverter = '/utility/unitConverter',
}

export type RouteParams = {
  [RoutePath.Home]: undefined

  [RoutePath.Account]: undefined
  [RoutePath.Account_Dev]: undefined
  //[RoutePath.Account_Basic]: undefined
  [RoutePath.Account_Mnemonic]: undefined
  [RoutePath.Account_Keystore]: undefined
  [RoutePath.Account_AccountKeyPublic]: undefined
  [RoutePath.Account_AccountKeyFail]: undefined
  [RoutePath.Account_AccountKeyWeightedMultiSig]: undefined
  [RoutePath.Account_AccountKeyRoleBased]: undefined
  [RoutePath.Account_KeystoreV4]: undefined

  [RoutePath.EIP]: undefined
  //[RoutePath.EIP_About]: undefined
  [RoutePath.EIP_20]: undefined
  [RoutePath.EIP_721]: undefined
  [RoutePath.EIP_1155]: undefined
  [RoutePath.EIP_2612]: undefined

  [RoutePath.Wallet]: undefined
  //[RoutePath.Wallet_Metamask]: undefined
  [RoutePath.Wallet_RainbowKit]: undefined
  [RoutePath.Wallet_KaiawalletExtension]: undefined
  [RoutePath.Wallet_KaiawalletMobile]: undefined
  [RoutePath.Wallet_Klip]: undefined

  [RoutePath.Transaction]: undefined

  [RoutePath.Utility]: undefined
  //[RoutePath.Utility_About]: undefined
  [RoutePath.Utility_UnitConverter]: undefined
}
