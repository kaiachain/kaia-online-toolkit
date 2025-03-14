import { RoutePath, EipItemType, EIPTypeEnum } from '@/types'
import URL_MAP from './urlMap'

const list: EipItemType[] = [
  {
    no: '20',
    type: EIPTypeEnum.ERC,
    title: 'Fungible Token',
    to: RoutePath.EIP_20,
    doc: `${URL_MAP.eip}EIPS/eip-20`,
    summary: 'A standard interface for tokens.',
  },
  {
    no: '721',
    type: EIPTypeEnum.ERC,
    title: 'Non-Fungible Token',
    to: RoutePath.EIP_721,
    doc: `${URL_MAP.eip}EIPS/eip-721`,
    summary:
      'A standard interface for non-fungible tokens, also known as deeds.',
  },
  {
    no: '1155',
    type: EIPTypeEnum.ERC,
    title: 'Multi Token',
    to: RoutePath.EIP_1155,
    doc: `${URL_MAP.eip}EIPS/eip-1155`,
    summary:
      'A standard interface for contracts that manage multiple token types.\nA single deployed contract may include any combination of fungible tokens, non-fungible tokens or other configurations (e.g. semi-fungible tokens).',
  },
  {
    no: '2612',
    type: EIPTypeEnum.ERC,
    title: 'ERC-20 Permit',
    to: RoutePath.EIP_2612,
    doc: `${URL_MAP.eip}EIPS/eip-2612`,
    summary:
      'EIP-2612 introduces a new mechanism for approving ERC-20 token transfers using off-chain signatures, eliminating the need for users to send an on-chain approval transaction before transferring tokens.',
  },
]

export default {
  list,
}
