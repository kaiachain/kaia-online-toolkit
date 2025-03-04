import axios, { AxiosResponse } from 'axios'

import { AddrType, KwmApi } from '@/types'

export const KAIAWALLET_MOBILE_API = 'https://api.kaiawallet.io/api/v1/k'
const bapp = { name: 'Kaia Toolkit' }

const resultApi = (requestKey: string) =>
  `${KAIAWALLET_MOBILE_API}/result/${requestKey}`

const postPrepare = async (
  data: Record<string, any>
): Promise<AxiosResponse<KwmApi.PrepareResponseType>> =>
  await axios.post(`${KAIAWALLET_MOBILE_API}/prepare`, data)

const authApi = async (chain_id: number) =>
  postPrepare({
    type: 'auth',
    bapp,
    chain_id,
  })

const sendKaiaApi = async ({
  chain_id,
  to,
  amount,
}: {
  chain_id: number
  to: AddrType // '0x0000000000000000000000000000000000000000'
  amount: string // '0.1'
}) =>
  postPrepare({
    type: 'send_klay',
    bapp,
    chain_id,
    transaction: {
      to,
      amount,
    },
  })

const executeContractApi = async ({
  chain_id,
  abiStr,
  value,
  toAddress,
  params,
}: {
  chain_id: number
  abiStr: string // '{"inputs":[],"name":"stake","outputs":[],"stateMutability":"payable","type":"function"}'
  value: string
  toAddress: AddrType
  params: string // '["0x...","100000000000000000"]'
}) =>
  postPrepare({
    type: 'execute_contract',
    bapp,
    chain_id,
    transaction: {
      abi: abiStr,
      value: value || '0',
      to: toAddress,
      params,
    },
  })

const signApi = async ({
  chain_id,
  message,
}: {
  chain_id: number
  message: string
}) =>
  postPrepare({
    type: 'sign',
    bapp,
    chain_id,
    sign: { message },
  })

export default {
  authApi,
  executeContractApi,
  signApi,
  resultApi,
  sendKaiaApi,
}
