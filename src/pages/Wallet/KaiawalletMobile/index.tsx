import { ReactElement } from 'react'
import { isMobile } from 'react-device-detect'

import { ActionCard, Container } from '@/components'
import { URL_MAP } from '@/consts'
import { KAIAWALLET_MOBILE_API, KmApi, UTIL } from '@/common'
import { useNetwork } from '@/hooks'
import { useKaiawalletMobilePage } from '@/hooks/page/useKaiawalletMobilePage'

import InteractionModal from './InteractionModal'
import { toast } from 'react-toastify'

const requestBaseCode = ({
  prepareParam,
  completed,
}: {
  prepareParam?: string
  completed: string
}) => `const prepare = await axios
  .post('${KAIAWALLET_MOBILE_API}/prepare', 
  {
    type: 'auth',
    bapp: { name: 'Kaia Toolkit' },
    chain_id,${prepareParam ? `\n    ${prepareParam}` : ''}
  })

const { request_key } = prepare.data

setInterval(() => {
  const { data } = await axios
    .get(\`${KAIAWALLET_MOBILE_API}/result/\${request_key}\`)

  if(data.status === 'completed') {
    ${completed}
  }
}, 1000)`

const codes = {
  connectWallet: `${requestBaseCode({
    completed: 'const address = data.result.klaytn_address',
  })}`,
  signMessage: `const message = 'Hello, Kaia!'
${requestBaseCode({
  prepareParam: 'sign: { message },',
  completed: 'const signedData = data.result.signed_data',
})}`,
  sendKaia: `const to = '0x...'; // Wallet address
const amount = '0.1'
${requestBaseCode({
  prepareParam: `transaction: {
      to, 
      amount,
    },`,
  completed: 'const txHash = data.result.tx_hash',
})}`,
}

const KaiawalletMobile = (): ReactElement => {
  const useKaiawalletMobilePageReturn = useKaiawalletMobilePage()
  const { address, signResult, request, sendKaiaResult, setRequest } =
    useKaiawalletMobilePageReturn
  const { chainId } = useNetwork()

  const connectToWallet = async () => {
    const res = await KmApi.authApi(Number(chainId))
    setRequest({ type: 'auth', requestKey: res.data.request_key })
  }

  const signMessage = async () => {
    const message = 'Hello, Kaia!'
    const res = await KmApi.signApi({
      chain_id: Number(chainId),
      message,
    })
    setRequest({ type: 'sign', message, requestKey: res.data.request_key })
  }

  const sendKaia = async () => {
    if (!address) {
      toast('Please connect to wallet first', { type: 'error' })
      return
    }

    const res = await KmApi.sendKaiaApi({
      chain_id: Number(chainId),
      to: address,
      amount: '0.1',
    })
    setRequest({ type: 'send_klay', requestKey: res.data.request_key })
  }

  return (
    <>
      {request && (
        <InteractionModal
          request={request}
          useKaiawalletMobilePageReturn={useKaiawalletMobilePageReturn}
        />
      )}
      <Container
        onlyKaia
        title="Kaiawallet Mobile"
        link={{
          url: `${URL_MAP.kaiawallet}category/ko-kaia-wallet-mobile/`,
          text: 'KaiawalletMobile Docs',
        }}
      >
        <ActionCard
          title={`Connect to wallet using ${
            isMobile ? 'app2app scheme' : 'QR code'
          }`}
          onClickBtn={connectToWallet}
          result={address}
          code={codes.connectWallet}
        />
        {address && (
          <>
            <ActionCard
              title="Sign message"
              onClickBtn={signMessage}
              result={signResult}
              code={codes.signMessage}
            />
            <ActionCard
              title={`Send KAIA to ${UTIL.truncate(address, [5, 5])}`}
              onClickBtn={sendKaia}
              result={sendKaiaResult}
              code={codes.sendKaia}
            />
          </>
        )}
      </Container>
    </>
  )
}

export default KaiawalletMobile
