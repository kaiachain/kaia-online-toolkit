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

  return (
    <PageContainer menuList={subMenuList}>
      <Container
        onlyKaia
        title="Kaia Bridge (FNSA -> KAIA)"
        link={{
          url: `${URL_MAP.kaiaDocs}misc/kaia-transition/kaiabridge/`,
          text: 'Kaia docs : KaiaBridge',
        }}
      >
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
