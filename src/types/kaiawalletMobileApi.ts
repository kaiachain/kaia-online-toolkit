import { AddrType } from './common'

export type KmRequestType = {
  requestKey: string
} & (
  | { type: 'auth' }
  | { type: 'sign'; message: string }
  | {
      type: 'execute_contract' | 'send_klay'
    }
)

export namespace KwmApi {
  export type PrepareResponseType = {
    chain_id: '8217' | '1001'
    request_key: string //'4a4f2d97-6ef7-44e0-8c06-2de9ef5cca6e'
    status: 'prepared'
    expiration_time: number // 1647663586
  }

  type ResultReturnTypeBase = {
    status: 'completed' | 'canceled' | 'error'
    chain_id: '8217' | '1001'
    request_key: string // '9aba402f-9110-4db5-99c7-d5ae32881181'
    expiration_time: number // 1647666405
  }

  export type ResultReturnType = ResultReturnTypeBase &
    (
      | {
          type: 'auth'
          result: {
            klaytn_address: AddrType
          }
        }
      | {
          type: 'sign'
          result: {
            address: AddrType
            signed_data: string
          }
        }
      | {
          type: 'execute_contract' | 'send_klay'
          result: {
            signed_tx: string
            tx_hash: string
          }
        }
    )
}
