import { ReactElement, useEffect, useState } from 'react'
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import { toHex } from 'viem'

import { ActionCard, CodeBlock, Container, LinkA, View } from '@/components'
import { EvmChainIdEnum, URL_MAP } from '@/consts'
import { useNetwork } from '@/hooks'
import { parseError, stringify } from '@/common'

const codes = {
  connectToOkx: `const universalUi = await OKXUniversalConnectUI.init({
    dappMetaData: {
      icon: 'https://toolkit.kaia.io/logo.png',
      name: 'Kaia Toolkit',
    },
    language: 'en_US',
    uiPreferences: {
      theme: THEME.DARK,
    },
  })
  
const res = await universalUi.openModal({
  namespaces: {
    eip155: {
      chains: ['eip155:\`\${chainId}\`],
      defaultChain: '\`\${chainId}\`,
    },
  },
})

if(res){
  const { topic, sessionConfig, wallet } = res
}
`,
  requestAccounts: `const addresses = await universalUi.request<string[]>({
    method: 'eth_requestAccounts'
  })
const address = addresses?.[0]`,
  disconnectOkx: `universalUi.disconnect()`,
  personalSign: `const res = await universalUi.request<string>({
  method: 'personal_sign',
  params: ['Hello, OKX!', address],
})
  
const signedData = res`,
  sendNative: `import { toHex } from 'viem'
  
const res = await universalUi.request<string>({
  method: 'eth_sendTransaction',
  params: [
    {
      from: from_address,
      to: to_address,
      value: toHex(weiAmount),
    },
  ],
})

const txHash = res`,
}

const Okx = (): ReactElement => {
  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()
  const [connectResult, setConnectResult] = useState('')
  const [personalSignResult, setPersonalSignResult] = useState('')
  const [sendNativeResult, setSendNativeResult] = useState('')

  const { data: universalUi } = useQuery({
    queryKey: ['okx', 'init'],
    queryFn: async () =>
      OKXUniversalConnectUI.init({
        dappMetaData: {
          icon: 'https://toolkit.kaia.io/logo.png',
          name: 'Kaia Toolkit',
        },
        language: 'en_US',
        uiPreferences: {
          theme: THEME.DARK,
        },
      }),
  })

  const { data: connected = false, refetch: refetchConnected } = useQuery({
    queryKey: ['okx', 'connected'],
    queryFn: () => universalUi?.connected(),
    enabled: !!universalUi,
  })

  const { data: address = '', refetch: refetchAccounts } = useQuery({
    queryKey: ['okx', 'eth_requestAccounts'],
    queryFn: async () => {
      if (universalUi) {
        const addresses = await universalUi.request<string[]>({
          method: 'eth_requestAccounts',
        })
        return addresses?.[0]
      }
      return ''
    },
    enabled: !!universalUi,
  })

  const connectToOkx = async () => {
    setConnectResult('')
    if (EvmChainIdEnum.KAIROS === chainId) {
      toast('Kaia Kairos Testnet is not supported by OKX Wallet', {
        type: 'error',
      })
      return
    }

    try {
      const chainIdInt = Number(chainId).toString()
      const res = await universalUi?.openModal({
        namespaces: {
          eip155: {
            chains: [`eip155:${chainIdInt}`],
            defaultChain: chainIdInt,
          },
        },
      })
      if (res) {
        setConnectResult(
          stringify({
            topic: res.topic,
            sessionConfig: res.sessionConfig,
            wallet: res.wallet,
          })
        )
      }
    } catch (error) {
      setConnectResult(parseError(error))
    } finally {
      refetchConnected()
    }
  }

  const personalSign = async () => {
    setPersonalSignResult('')
    try {
      const res = await universalUi?.request<string>({
        method: 'personal_sign',
        params: ['Hello, OKX!', address],
      })
      setPersonalSignResult(res ?? '')
    } catch (error) {
      setPersonalSignResult(parseError(error))
    }
  }

  const sendNative = async () => {
    setSendNativeResult('')
    try {
      const res = await universalUi?.request<string>({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: address,
            value: toHex(10_000_000_000_000_000n),
          },
        ],
      })
      setSendNativeResult(res ?? '')
    } catch (error) {
      setSendNativeResult(parseError(error))
    }
  }

  useEffect(() => {
    if (!universalUi) return

    // Disconnecting triggers this event;
    universalUi.on('session_delete', () => {
      refetchConnected()
    })

    universalUi.on('accountChanged', (session: any) => {
      if (session) {
        refetchAccounts()
      }
    })
  }, [universalUi])

  return (
    <Container
      title="OKX"
      link={{
        url: `${URL_MAP.okxDocs}sdks/okx-wallet-integration-introduction`,
        text: 'OKX documentation',
      }}
    >
      <ActionCard
        title="Connect to OKX Wallet"
        topComp={
          <LinkA link={`${URL_MAP.okxDocs}sdks/app-connect-evm-ui`}>
            {`DApp Connect Wallet > EVM > UI`}
          </LinkA>
        }
        code={codes.connectToOkx}
        onClickBtn={connectToOkx}
        btnDisabled={connected || !universalUi}
        result={connectResult}
      />
      {connected && (
        <>
          <ActionCard
            title="Disconnect OKX Wallet"
            onClickBtn={async () => {
              await universalUi?.disconnect()
              setConnectResult('')
            }}
            topComp={
              <View>
                <KaText fontType="body/md_700" color={getTheme('gray', '2')}>
                  {address}
                </KaText>
                <CodeBlock
                  title="Request Accounts Code"
                  text={codes.requestAccounts}
                />
              </View>
            }
            code={codes.disconnectOkx}
          />
          <ActionCard
            title="Personal Sign"
            onClickBtn={personalSign}
            code={codes.personalSign}
            result={personalSignResult}
          />
          <ActionCard
            title="Send Native Token"
            onClickBtn={sendNative}
            code={codes.sendNative}
            result={sendNativeResult}
          />
        </>
      )}
    </Container>
  )
}

export default Okx
