import { ReactElement, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useQuery } from '@tanstack/react-query'
import { toHex } from 'viem'
import { KaButton, KaText, useKaTheme } from '@kaiachain/kaia-design-system'

import { ActionCard, Card, Container, LinkA } from '@/components'
import { NETWORK, URL_MAP } from '@/consts'
import { parseError } from '@/common'
import { useNetwork } from '@/hooks'

const provider = typeof window.klaytn !== 'undefined' ? window.klaytn : null

const codes = {
  connectWallet: `const provider = typeof window.klaytn !== 'undefined' ? window.klaytn : null
  
const addresses = await provider.enable()
const address = addresses[0]`,

  switchNetwork: `await provider.request({
  method: 'wallet_switchKlaytnChain',
  params: [{ chainId }],
})`,

  personalSign: `const res = await provider.request({
  method: 'personal_sign',
  params: ['Hello, Kaia!', address],
})
const signedData = res`,

  sendNative: `import { toHex } from 'viem'
  
const res = await provider.request({
  method: 'eth_sendTransaction',
  params: [
    {
      from: address,
      to: address,
      value: toHex(weiAmount),
    },
  ],
})
const txHash = res`,
}

const KaiawalletExtension = (): ReactElement => {
  const { getTheme } = useKaTheme()
  const { chainId } = useNetwork()
  const [personalSignResult, setPersonalSignResult] = useState('')
  const [sendNativeResult, setSendNativeResult] = useState('')

  const { data: walletNetwork, refetch: refetchWalletNetwork } = useQuery<
    1001 | 8217 | string
  >({
    queryKey: ['kaiawallet', 'network'],
    queryFn: async () => {
      return provider?.networkVersion
    },
    enabled: !!provider,
  })

  const isSameNetwork = walletNetwork === Number(chainId)

  const { data: address = '', refetch: refetchAccounts } = useQuery({
    queryKey: ['kaiawallet', 'eth_requestAccounts'],
    queryFn: async () => {
      if (provider) {
        const addresses = await provider.request({
          method: 'eth_requestAccounts',
        })
        return addresses?.[0]
      }
      return ''
    },
    enabled: !!provider,
  })

  const connectToWallet = async () => {
    await provider.enable()
  }

  const switchNetwork = async () => {
    try {
      await provider.request({
        method: 'wallet_switchKlaytnChain',
        params: [{ chainId }],
      })
    } catch (error) {
      console.error(error)
    }
    refetchWalletNetwork()
  }

  const personalSign = async () => {
    setPersonalSignResult('')
    try {
      const res = await provider.request({
        method: 'personal_sign',
        params: ['Hello, Kaia!', address],
      })
      setPersonalSignResult(res ?? '')
    } catch (error) {
      setPersonalSignResult(parseError(error))
    }
  }

  const sendNative = async () => {
    setSendNativeResult('')
    try {
      const res = await provider.request({
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
    if (provider) {
      provider.on('accountsChanged', () => {
        refetchAccounts()
      })
      provider.on('networkChanged', () => {
        refetchWalletNetwork()
      })
    }
  }, [provider])

  return (
    <Container
      onlyKaia
      title="Kaiawallet Extension"
      link={{
        url: `${URL_MAP.kaiawallet}api_reference/klaytn_provider/`,
        text: 'Kaiawallet Extension Docs',
      }}
    >
      {isMobile ? (
        <Card>
          <KaText fontType="body/lg_700" color={getTheme('warning', '5')}>
            Kaiawallet Extension is not supported on mobile.
          </KaText>
        </Card>
      ) : !provider ? (
        <Card>
          <KaText fontType="body/lg_700">
            Please download Kaiawallet Extension to connect to wallet.
          </KaText>
          <LinkA link="https://chromewebstore.google.com/detail/kaia-wallet/jblndlipeogpafnldhgmapagcccfchpi">
            Chrome web store
          </LinkA>
          <KaButton type="secondary" onClick={() => window.location.reload()}>
            Refresh this page
          </KaButton>
        </Card>
      ) : (
        <ActionCard
          title="Connect to wallet using Kaiawallet Extension"
          onClickBtn={connectToWallet}
          result={address}
          code={codes.connectWallet}
        />
      )}
      {address && (
        <>
          <ActionCard
            title="Switch network"
            topComp={
              <KaText
                fontType="body/md_400"
                color={getTheme(isSameNetwork ? 'info' : 'warning', '5')}
              >
                {isSameNetwork
                  ? 'Already on the correct network'
                  : `Please switch wallet network to the ${NETWORK.evmChainParams[chainId].chainName}`}
              </KaText>
            }
            btnDisabled={isSameNetwork}
            onClickBtn={switchNetwork}
            code={codes.switchNetwork}
          />
          {isSameNetwork && (
            <>
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
        </>
      )}
    </Container>
  )
}

export default KaiawalletExtension
