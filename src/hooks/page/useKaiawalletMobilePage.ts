import { AddrType, KmRequestType } from '@/types'
import { useState } from 'react'

export type UseKaiawalletMobilePageReturn = {
  request?: KmRequestType
  setRequest: (request?: KmRequestType) => void
  address?: AddrType
  setAddress: (address?: AddrType) => void
  signResult: string
  setSignResult: (signResult: string) => void
  sendKaiaResult: string
  setSendKaiaResult: (sendKaiaResult: string) => void
}

export const useKaiawalletMobilePage = (): UseKaiawalletMobilePageReturn => {
  const [request, setRequest] = useState<KmRequestType>()
  const [address, setAddress] = useState<AddrType>()
  const [signResult, setSignResult] = useState('')
  const [sendKaiaResult, setSendKaiaResult] = useState('')

  return {
    request,
    setRequest,
    address,
    setAddress,
    signResult,
    setSignResult,
    sendKaiaResult,
    setSendKaiaResult,
  }
}
