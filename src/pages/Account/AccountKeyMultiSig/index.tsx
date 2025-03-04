import { ReactElement, useMemo } from 'react'
import {
  KaButton,
  KaSelectBox,
  KaText,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import _ from 'lodash'

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
import { useAccountKeyMultiSigPage } from '@/hooks/page/useAccountKeyMultiSigPage'
import { CODE_EG, EvmChainIdEnum, URL_MAP } from '@/consts'
import { UTIL } from '@/common'
import { useAccountKey, useBalance, useNetwork, useValidator } from '@/hooks'

const AccountKeyMultiSig = (): ReactElement => {
  const {
    sdk,
    setSdk,
    privateKey,
    setPrivateKey,
    address,
    setAddress,
    accountUpdate,
    loading,
    result,
    threshold,
    setThreshold,
    numberOfKeys,
    setNumberOfKeys,
    pKeyList,
    setPKeyList,
    weightList,
    setWeightList,
  } = useAccountKeyMultiSigPage()

  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()

  const { balance, refetch: refetchBalance } = useBalance({ address })
  const {
    accountKey,
    accountKeyName,
    refetch: refetchAccountKey,
  } = useAccountKey({ address })

  const { errorMessage: addressErrMsg } = useValidator({
    value: address,
    type: 'address',
  })

  const sufficientBalance = useMemo(
    () => !!balance && UTIL.toBn(UTIL.demicrofy(balance)).isGreaterThan(0.1),
    [balance]
  )
  return (
    <Container
      onlyKaia
      title="AccountKeyWeightedMultiSig"
      link={{
        url: `${URL_MAP.kaiaDocs}learn/accounts/#accountkeyweightedmultisig-`,
        text: 'Kaia docs : AccountKeyWeightedMultiSig',
      }}
    >
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
                Please ready at least 0.1 KAIA to execute the tx.
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
          title="Step 2. Update to AccountKeyMultiSig"
          topComp={
            <View style={{ gap: 10 }}>
              <PrivateKeyForm
                label="Private key of address"
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                disabled={loading}
              />
              <View style={{ gap: 4 }}>
                <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
                  Threshold
                </KaText>
                <KaSelectBox
                  optionList={[2, 3, 4, 5].map((v) => ({
                    label: v.toString(),
                    value: v.toString(),
                  }))}
                  selectedValue={threshold.toString()}
                  onSelect={(v) => {
                    setThreshold(parseInt(v))
                  }}
                  disabled={loading}
                  containerStyle={{ width: 200 }}
                />
              </View>
              <View style={{ gap: 4 }}>
                <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
                  Number of keys
                </KaText>
                <Row style={{ gap: 8 }}>
                  {_.times(4, (i) => {
                    const key = i + 2
                    return (
                      <KaButton
                        key={`numberOfKeys-${key}`}
                        type={numberOfKeys === key ? 'secondary' : 'tertiary'}
                        size="md"
                        onClick={() => {
                          setNumberOfKeys(key)
                        }}
                      >
                        {key}
                      </KaButton>
                    )
                  })}
                </Row>
              </View>
              <View>
                <Row style={{ gap: 8 }}>
                  <KaText
                    fontType="body/lg_700"
                    color={getTheme('gray', '2')}
                    style={{ width: 100 }}
                  >
                    Weight
                  </KaText>

                  <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
                    Private key
                  </KaText>
                </Row>

                <View style={{ gap: 8 }}>
                  {_.times(numberOfKeys, (i) => {
                    const pKey = pKeyList[i]

                    const weight = weightList[i]
                      ? weightList[i].toString()
                      : '1'
                    if (!weightList[i]) {
                      setWeightList((prev) => {
                        const next = [...prev]
                        next[i] = 1
                        return next
                      })
                    }

                    return (
                      <Row style={{ gap: 8 }} key={`pKey-${i}`}>
                        <KaSelectBox
                          optionList={_.times(5, (i) => ({
                            label: (i + 1).toString(),
                            value: (i + 1).toString(),
                          }))}
                          selectedValue={weight}
                          onSelect={(v) => {
                            setWeightList((prev) => {
                              const next = [...prev]
                              next[i] = parseInt(v)
                              return next
                            })
                          }}
                          disabled={loading}
                          containerStyle={{ maxWidth: 100 }}
                        />
                        <PrivateKeyForm
                          key={`pKeyList-${i}`}
                          privateKey={pKey ?? ''}
                          setPrivateKey={(v) => {
                            setPKeyList((prev) => {
                              const next = [...prev]
                              next[i] = v
                              return next
                            })
                          }}
                          disabled={loading}
                          generator
                        />
                      </Row>
                    )
                  })}
                </View>
              </View>
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
          code={CODE_EG.accountUpdateMultiSig[sdk]}
        />
      )}
    </Container>
  )
}

export default AccountKeyMultiSig
