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
  Wallet_Okx = '/wallet/okx',

  BlockTx = '/blockTx',
  //BlockTx_Block = '/blockTx/block',
  BlockTx_TxHistory = '/blockTx/txHistory',
  BlockTx_RlpEncode = '/blockTx/rlpEncode',
  BlockTx_RlpDecode = '/blockTx/rlpDecode',

  Utility = '/utility',
  //Utility_About = '/utility/about',
  Utility_UnitConverter = '/utility/unitConverter',
  Utility_AddressChecksum = '/utility/addressChecksum',
  Utility_SignVerify = '/utility/signVerify',
}

const RouteParams: Record<RoutePath, any> = {
  [RoutePath.Home]: undefined,

  [RoutePath.Account]: undefined,
  [RoutePath.Account_Dev]: undefined,
  //[RoutePath.Account_Basic]: undefined,
  [RoutePath.Account_Mnemonic]: undefined,
  [RoutePath.Account_Keystore]: undefined,
  [RoutePath.Account_AccountKeyPublic]: undefined,
  [RoutePath.Account_AccountKeyFail]: undefined,
  [RoutePath.Account_AccountKeyWeightedMultiSig]: undefined,
  [RoutePath.Account_AccountKeyRoleBased]: undefined,

  [RoutePath.EIP]: undefined,
  //[RoutePath.EIP_About]: undefined,
  [RoutePath.EIP_20]: undefined,
  [RoutePath.EIP_721]: undefined,
  [RoutePath.EIP_1155]: undefined,
  [RoutePath.EIP_2612]: undefined,

  [RoutePath.Wallet]: undefined,
  //[RoutePath.Wallet_Metamask]: undefined,
  [RoutePath.Wallet_RainbowKit]: undefined,
  [RoutePath.Wallet_KaiawalletExtension]: undefined,
  [RoutePath.Wallet_KaiawalletMobile]: undefined,
  [RoutePath.Wallet_Okx]: undefined,

  [RoutePath.BlockTx]: undefined,
  //[RoutePath.BlockTx_Block]: undefined,
  [RoutePath.BlockTx_TxHistory]: undefined,
  [RoutePath.BlockTx_RlpEncode]: undefined,
  [RoutePath.BlockTx_RlpDecode]: undefined,

  [RoutePath.Utility]: undefined,
  //[RoutePath.Utility_About]: undefined,
  [RoutePath.Utility_UnitConverter]: undefined,
  [RoutePath.Utility_AddressChecksum]: undefined,
  [RoutePath.Utility_SignVerify]: undefined,
}

export type RouteParams = typeof RouteParams
