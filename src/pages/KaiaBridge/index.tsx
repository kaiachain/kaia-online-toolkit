import { ReactElement, useState } from 'react'
import { KaText, KaButton, useKaTheme } from '@kaiachain/kaia-design-system'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'

import {
  View,
  Container,
  Card,
  CodeBlock,
  Row,
  PageContainer,
  LinkA,
} from '@/components'
import { useKaiaBridgePage } from '@/hooks/page/useKaiaBridgePage'
import { EvmChainIdEnum, URL_MAP } from '@/consts'
import { useMetamask, useNetwork, useExplorer } from '@/hooks'
import { parseError } from '@/common'
import { RoutePath } from '@/types'

const StyledCardRow = styled(Row)`
  gap: 16px;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const StyledHalfCard = styled(Card)`
  flex: 1;
  min-width: 0;
`

// TODO: Remove this after we have a mainnet version
const TestnetBanner = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
`
// TODO: Remove this after we have a mainnet version
const InfoIcon = styled.div`
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`
// TODO: Remove this after we have a mainnet version
const BannerContent = styled.div`
  flex: 1;
`

const kaiaProvider = typeof window !== 'undefined' && typeof window.klaytn !== 'undefined' ? window.klaytn : null

const subMenuList = [
  {
    title: 'Kaia Bridge',
    to: RoutePath.KaiaBridge,
  },
]

const KaiaBridge = (): ReactElement => {
  const {
    loading,
    finschiaAddress,
    signAndDerive,
    errorMsg,
    signature,
    conyBalance,
    provisionSeq,
    recordLoading,
    hasProvisionedBefore,
    canRequestProvision,
    provisionLoading,
    requestProvision,
    provisionError,
    provisionTxHash,
    provisionJustSucceeded,
    claimLoading,
    claimError,
    claimTxHash,
    hasClaimed,
    claimJustSucceeded,
    canRequestClaim,
    requestClaim,
    balanceBeforeClaim,
    balanceAfterClaim,
    balanceBeforeClaimKaia,
    balanceAfterClaimKaia,
    checkingClaimed,
  } = useKaiaBridgePage()

  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()
  const { getExplorerLink } = useExplorer()

  // MetaMask connection
  const {
    connected: metamaskConnected,
    connect: connectMetamask,
    disconnect: disconnectMetamask,
    provider: metamaskProvider,
  } = useMetamask()
  const [metamaskError, setMetamaskError] = useState('')

  // Kaia Wallet connection
  const { data: kaiaAddress = '', refetch: refetchKaiaAccounts } = useQuery({
    queryKey: ['kaiawallet', 'eth_requestAccounts'],
    queryFn: async () => {
      if (kaiaProvider) {
        const addresses = await kaiaProvider.request({
          method: 'eth_requestAccounts',
        })
        return addresses?.[0]
      }
      return ''
    },
    enabled: !!kaiaProvider,
  })
  const [kaiaWalletError, setKaiaWalletError] = useState('')

  const connectKaiaWallet = async () => {
    setKaiaWalletError('')
    try {
      if (kaiaProvider) {
        await kaiaProvider.enable()
        refetchKaiaAccounts()
      } else {
        setKaiaWalletError('Kaia Wallet not installed')
      }
    } catch (error) {
      setKaiaWalletError(parseError(error))
    }
  }

  const handleMetamaskConnect = async () => {
    setMetamaskError('')
    const result = await connectMetamask()
    if (!result.success) {
      setMetamaskError(parseError(result.error))
    }
  }

  const handleMetamaskDisconnect = async () => {
    setMetamaskError('')
    const result = await disconnectMetamask()
    if (!result.success) {
      setMetamaskError(parseError(result.error))
    }
  }

  // TODO: Remove TestnetBanner after we have a mainnet version
  return (
    <PageContainer menuList={subMenuList}>
      <Container
        allowedChainIds={[EvmChainIdEnum.KAIROS]}
        title="Kaia Bridge (FNSA -> KAIA)"
        link={{
          url: `${URL_MAP.kaiaDocs}misc/kaia-transition/kaiabridge/`,
          text: 'Kaia docs : KaiaBridge',
        }}
      >
      <TestnetBanner>
        <InfoIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 20 21">
            <path fillRule="evenodd" d="M1.563 10.5a8.438 8.438 0 1 1 16.875 0 8.438 8.438 0 0 1-16.875 0m8.28-4.687a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M8.439 9.875c0-.518.42-.937.937-.937H10c.518 0 .938.42.938.937v3.49a.938.938 0 0 1-.313 1.822H10a.937.937 0 0 1-.937-.937v-3.49a.94.94 0 0 1-.626-.885" clipRule="evenodd"></path>
          </svg>
        </InfoIcon>
        <BannerContent>
          <KaText fontType="body/md_700" style={{ color: '#FFFFFF', marginBottom: '4px' }}>
            Testing Version - Kairos Testnet Only
          </KaText>
          <KaText fontType="body/sm_400" style={{ color: '#FFFFFF', opacity: 0.95 }}>
            This is a testing version of the Kaia Bridge to be used internally in Kaia Foundation. Do not attempt to use this.
          </KaText>
        </BannerContent>
      </TestnetBanner>

      <Card>
        <KaText fontType="body/md_400">
          {`You can swap your FNSA balance to KAIA tokens.

Note that the provision and claim processcan be executed only once, and cannot be undone.`}
        </KaText>
      </Card>

      <StyledCardRow>
        <StyledHalfCard>
          <KaText fontType="title/xs_700">MetaMask</KaText>
          {!metamaskConnected ? (
            <>
              <KaText fontType="body/sm_400">
                Connect your MetaMask wallet
              </KaText>
              <KaButton onClick={handleMetamaskConnect} size="md">
                Connect MetaMask
              </KaButton>
              {metamaskError && (
                <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
                  {metamaskError}
                </KaText>
              )}
            </>
          ) : (
            <>
              <KaText fontType="body/sm_400">
                Connected: {metamaskProvider?.getSelectedAddress()}
              </KaText>
              <KaButton type="redLine" onClick={handleMetamaskDisconnect} size="md">
                Disconnect
              </KaButton>
            </>
          )}
        </StyledHalfCard>

        <StyledHalfCard>
          <KaText fontType="title/xs_700">Kaia Wallet</KaText>
          {!kaiaAddress ? (
            <>
              <KaText fontType="body/sm_400">
                Connect your Kaia Wallet
              </KaText>
              <KaButton onClick={connectKaiaWallet} size="md" disabled={!kaiaProvider}>
                {kaiaProvider ? 'Connect Kaia Wallet' : 'Kaia Wallet Not Installed'}
              </KaButton>
              {kaiaWalletError && (
                <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
                  {kaiaWalletError}
                </KaText>
              )}
            </>
          ) : (
            <>
              <KaText fontType="body/sm_400">
                Connected: {kaiaAddress}
              </KaText>
            </>
          )}
        </StyledHalfCard>
      </StyledCardRow>

      <Card>
        {[EvmChainIdEnum.ETHEREUM, EvmChainIdEnum.KAIA].includes(chainId) && (
          <KaText fontType="title/xs_700" color={getTheme('warning', '5')}>
            {`WARNING. The current selected network is the mainnet.\nplease execute the test tx on kairos.`}
          </KaText>
        )}
        <KaText fontType="title/xs_700">Step 1. Derive FNSA address</KaText>
        <KaText fontType="body/md_400">
          Sign a message with your wallet to derive your Finschia address.
        </KaText>
        <KaButton
          size="lg"
          onClick={signAndDerive}
          disabled={loading || (!metamaskConnected && !kaiaAddress)}
        >
          {loading ? 'Signing...' : 'Sign & Derive Finschia Address'}
        </KaButton>
        {!metamaskConnected && !kaiaAddress && (
          <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
            Please connect MetaMask or Kaia Wallet first
          </KaText>
        )}
        {errorMsg && (
          <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
            {errorMsg}
          </KaText>
        )}
        {signature && (
          <View>
            <KaText fontType="body/md_700">Signature:</KaText>
            <CodeBlock toggle={false} text={signature} />
          </View>
        )}
        {finschiaAddress && (
          <View>
            <KaText fontType="body/md_700">Finschia Address:</KaText>
            <CodeBlock toggle={false} text={finschiaAddress} />
          </View>
        )}
        {recordLoading && (
          <KaText fontType="body/sm_400">Loading record...</KaText>
        )}
        {finschiaAddress && !recordLoading && (
          <View>
            <KaText fontType="body/md_700">Record:</KaText>
            <CodeBlock
              toggle={false}
              text={JSON.stringify({
                conyBalance,
                provisionSeq,
                provisioned: hasProvisionedBefore,
                claimed: hasClaimed,
              }, null, 2)}
            />
          </View>
        )}
      </Card>

      {finschiaAddress && !recordLoading && (
        <Card>
          <KaText fontType="title/xs_700">Step 2. Request Provision</KaText>
          <KaText fontType="body/md_400">
            {provisionJustSucceeded
              ? 'Your provision request was successful!'
              : canRequestProvision
              ? 'You have CONY balance and have not provisioned yet. Click below to request provision.'
              : hasProvisionedBefore
              ? 'You have already provisioned before.'
              : 'You do not have CONY balance to provision.'}
          </KaText>
          <KaButton
            size="lg"
            onClick={requestProvision}
            disabled={!canRequestProvision || provisionLoading}
          >
            {provisionLoading ? 'Requesting Provision...' : 'Request Provision'}
          </KaButton>
          {provisionError && (
            <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
              {provisionError}
            </KaText>
          )}
          {provisionTxHash && (
            <View>
              <KaText fontType="body/md_700">Transaction Hash:</KaText>
              <CodeBlock toggle={false} text={provisionTxHash} />
              <LinkA
                link={getExplorerLink({
                  address: provisionTxHash,
                  type: 'tx',
                })}
              >
                View on Explorer
              </LinkA>
            </View>
          )}
          {hasProvisionedBefore && !provisionJustSucceeded && (
            <View>
              {checkingClaimed ? (
                <KaText fontType="body/sm_400">Checking claim status...</KaText>
              ) : (
                <>
                  <KaText fontType="body/md_700">Provision Info:</KaText>
                  <CodeBlock
                    toggle={false}
                    text={JSON.stringify({
                      provisionSeq,
                      claimed: hasClaimed,
                    }, null, 2)}
                  />
                </>
              )}
            </View>
          )}
        </Card>
      )}

      {finschiaAddress && !recordLoading && hasProvisionedBefore && (
        <Card>
          <KaText fontType="title/xs_700">Step 3. Request Claim</KaText>
          <KaText fontType="body/md_400">
            {claimJustSucceeded
              ? 'Your claim request was successful!'
              : hasClaimed
              ? 'You have already claimed your KAIA tokens.'
              : 'You can claim your KAIA tokens.'}
          </KaText>
          <KaButton
            size="lg"
            onClick={requestClaim}
            disabled={!canRequestClaim || claimLoading}
          >
            {claimLoading ? 'Claiming...' : 'Request Claim'}
          </KaButton>
          {claimError && (
            <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
              {claimError}
            </KaText>
          )}
          {claimTxHash && (
            <View>
              <KaText fontType="body/md_700">Transaction Hash:</KaText>
              <CodeBlock toggle={false} text={claimTxHash} />
              <LinkA
                link={getExplorerLink({
                  address: claimTxHash,
                  type: 'tx',
                })}
              >
                View on Explorer
              </LinkA>
            </View>
          )}
          {balanceBeforeClaim && balanceAfterClaim && (
            <View>
              <KaText fontType="body/md_700">Balance Change:</KaText>
              <CodeBlock
                toggle={false}
                text={JSON.stringify({
                  before: `${balanceBeforeClaimKaia} KAIA`,
                  after: `${balanceAfterClaimKaia} KAIA`,
                  difference: `${(parseFloat(balanceAfterClaimKaia) - parseFloat(balanceBeforeClaimKaia)).toFixed(6)} KAIA`,
                }, null, 2)}
              />
            </View>
          )}
        </Card>
      )}
      </Container>
    </PageContainer>
  )
}

export default KaiaBridge
