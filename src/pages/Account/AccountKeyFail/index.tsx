import { ReactElement, useMemo } from 'react'
import { KaButton, KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

import {
  View,
  LinkA,
  Container,
  Card,
  SdkSelectBox,
  FormInput,
  ActionCard,
  CodeBlock,
  Row,
  PrivateKeyForm,
} from '@/components'

import { useAccountKeyFailPage } from '@/hooks/page/useAccountKeyFailPage'
import { CODE_EG, EvmChainIdEnum, URL_MAP } from '@/consts'
import { UTIL } from '@/common'
import { useAccountKey, useBalance, useNetwork } from '@/hooks'

const AccountKeyFail = (): ReactElement => {
  const {
    sdk,
    setSdk,
    privateKey,
    setPrivateKey,
    address,
    setAddress,
    addressErrMsg,
    accountUpdate,
    loading,
    result,
  } = useAccountKeyFailPage()

  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()

  const { balance, refetch: refetchBalance } = useBalance({ address })
  const {
    accountKey,
    accountKeyName,
    refetch: refetchAccountKey,
  } = useAccountKey({ address })

  const sufficientBalance = useMemo(
    () => !!balance && UTIL.toBn(UTIL.demicrofy(balance)).isGreaterThan(0.1),
    [balance]
  )
  return (
    <Container
      onlyKaia
      title="AccountKeyFail"
      link={{
        url: `${URL_MAP.kaiaDocs}learn/accounts/#accountkeyfail-`,
        text: 'Kaia docs : AccountKeyFail',
      }}
    >
      <Card>
        <KaText fontType="body/lg_700" color={getTheme('danger', '5')}>
          After updating the account key, the key is no longer available.
        </KaText>
      </Card>

      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['ethersExt', 'web3Ext']}
      />

      <Card>
        {[EvmChainIdEnum.ETHEREUM, EvmChainIdEnum.KAIA].includes(chainId) && (
          <KaText fontType="title/xs_700" color={getTheme('warning', '5')}>
            {`WARNING. The current selected network is the mainnet.\nplease execute the test tx on kairos.`}
          </KaText>
        )}
        <KaText fontType="title/xs_700">Step 1. Ready account</KaText>
        <FormInput
          label="Address"
          inputProps={{
            placeholder: 'Enter address',
            value: address,
            onChangeText: setAddress,
          }}
          disabled={loading}
          rightComponent={
            address ? undefined : (
              <KaButton
                size="md"
                style={{ alignSelf: 'center' }}
                onClick={() => {
                  const key = generatePrivateKey()

                  setPrivateKey(key)

                  if (!address) {
                    setAddress(privateKeyToAccount(key).address)
                  }
                }}
              >
                Generate
              </KaButton>
            )
          }
          errorMessage={addressErrMsg}
        />
        {balance && (
          <View>
            <Row>
              <KaText fontType="body/lg_400">Balance : </KaText>
              <KaText fontType="body/lg_700">
                {UTIL.formatAmount(balance)} KAIA
              </KaText>
            </Row>
            {!sufficientBalance && (
              <KaText fontType="body/md_400" color={getTheme('danger', '5')}>
                Please have at least 0.1 KAIA to execute the tx.
              </KaText>
            )}
            {EvmChainIdEnum.KAIROS === chainId && (
              <LinkA link={`${URL_MAP.kairosFaucet}`}>
                Get Kairos KAIA from faucet
              </LinkA>
            )}
          </View>
        )}
        {accountKey !== undefined && (
          <CodeBlock
            toggle={false}
            text={
              accountKey === null
                ? 'The address does not exist on the actual blockchain network. '
                : `${accountKeyName}\n${JSON.stringify(accountKey, null, 2)}`
            }
          />
        )}
      </Card>
      {address && !addressErrMsg && (
        <ActionCard
          title="Step 2. Update to AccountKeyFail"
          topComp={
            <View style={{ gap: 10 }}>
              <PrivateKeyForm
                label="Private key of address"
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                disabled={loading}
              />
            </View>
          }
          onClickBtn={() => {
            accountUpdate().finally(() => {
              refetchAccountKey()
              refetchBalance()
            })
          }}
          btnLoading={loading}
          result={result}
          code={CODE_EG.accountUpdateFail[sdk]}
        />
      )}
    </Container>
  )
}

export default AccountKeyFail
