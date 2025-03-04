import { RoutePath } from './route'

export enum EIPTypeEnum {
  CORE = 'Core',
  NETWORKING = 'Networking',
  INTERFACE = 'Interface',
  ERC = 'ERC',
  META = 'Meta',
  INFORMATIONAL = 'Informational',
}

export type EipItemType = {
  no: '20' | '721' | '1155' | '2612'
  type: EIPTypeEnum
  to: RoutePath
  title: string
  doc: string
  summary: string
}
