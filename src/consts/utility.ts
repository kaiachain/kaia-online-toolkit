import { RoutePath, UtilityItemType, UtilityTypeEnum } from '@/types'

const list: UtilityItemType[] = [
  {
    id: 'unit-converter',
    type: UtilityTypeEnum.CONVERTER,
    title: 'Unit Converter',
    to: RoutePath.Utility_UnitConverter,
    description: 'Convert between different Kaia currency units (peb, ston, KAIA) with precision.',
  },
  {
    id: 'address-checksum',
    type: UtilityTypeEnum.ADDRESS,
    title: 'Address Checksum',
    to: RoutePath.Utility_AddressChecksum,
    description: 'Validate and convert Kaia addresses to their checksummed format using Ethereum address standards.',
  },
  {
    id: 'sign-verify',
    type: UtilityTypeEnum.VERIFICATION,
    title: 'Signature Verify',
    to: RoutePath.Utility_SignVerify,
    description: 'Cryptographically sign messages and verify signatures using Kaia-compatible wallets.',
  },
]

export default {
  list,
}
