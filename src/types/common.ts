export type NominalType<T extends string> = { __type: T }

export enum QueryKeyEnum {
  NETWORK = 'NETWORK',

  BALANCE = 'BALANCE',
  ACCOUNT_KEY = 'ACCOUNT_KEY',
}

export type AddrType = `0x${string}`
