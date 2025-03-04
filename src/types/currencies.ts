import { NominalType } from './common'

export enum TokenSymbolEnum {
  KAIA = 'KAIA',
}

export type dToken = string & NominalType<'dToken'>

export type Token = string & NominalType<'Token'>
