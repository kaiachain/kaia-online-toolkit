import { ReactElement, useMemo, useState } from 'react'
import {
  KaButton,
  KaSelectBox,
  KaText,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import _ from 'lodash'
import {
  Wallet,
  parseTransaction,
  JsonRpcProvider,
  TxType,
} from '@kaiachain/ethers-ext/v6'
import { Web3 } from '@kaiachain/web3js-ext'
import { parseError } from '@/common'

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

  const [step2Success, setStep2Success] = useState(false)
  const [txLoading, setTxLoading] = useState(false)
  const [txResult, setTxResult] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [signedKeys, setSignedKeys] = useState<boolean[]>([])
  const [signedTx, setSignedTx] = useState<{ rawTransaction: string } | null>(
    null
  )

  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()
  const { rpcUrl } = useNetwork()

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

  const { errorMessage: recipientErrMsg } = useValidator({
    value: recipientAddress,
    type: 'address',
  })

  const sufficientBalance = useMemo(
    () => !!balance && UTIL.toBn(UTIL.demicrofy(balance)).isGreaterThan(0.1),
    [balance]
  )

  const signedWeight = useMemo(() => {
    return signedKeys.reduce((total, isSigned, index) => {
      return total + (isSigned ? weightList[index] : 0)
    }, 0)
  }, [signedKeys, weightList])

  const canSendTransaction = useMemo(() => {
    return signedWeight >= threshold
  }, [signedWeight, threshold])

  const handleSignTransaction = async (keyIndex: number) => {
    try {
      if (signedTx) {
        if (sdk === 'ethersExt') {
          const provider = new JsonRpcProvider(rpcUrl)
          const wallet = new Wallet(pKeyList[keyIndex], provider)
          const tx = parseTransaction(signedTx.rawTransaction)

          const newSignedTx = await wallet.signTransaction(tx)
          setSignedTx({ rawTransaction: newSignedTx })
        } else if (sdk === 'web3Ext') {
          const provider = new Web3.providers.HttpProvider(rpcUrl)
          const web3 = new Web3(provider)
          const senderAccount = web3.eth.accounts.privateKeyToAccount(
            pKeyList[keyIndex]
          )
          const signResult = await senderAccount.signTransaction(
            signedTx.rawTransaction
          )
          setSignedTx({ rawTransaction: signResult.rawTransaction })
        }
      } else {
        const amountInPeb = BigInt(parseFloat(amount) * 1e18).toString()

        let nonce: number
        let gasPrice: string
        if (sdk === 'ethersExt') {
          const provider = new JsonRpcProvider(rpcUrl)
          nonce = Number(await provider.getTransactionCount(address))
          gasPrice =
            (await provider.getFeeData()).gasPrice?.toString() || '0x5d21dba00'
        } else {
          const provider = new Web3.providers.HttpProvider(rpcUrl)
          const web3 = new Web3(provider)
          nonce = Number(await web3.eth.getTransactionCount(address))
          gasPrice = (await web3.eth.getGasPrice()).toString()
        }

        const tx = {
          type: TxType.ValueTransfer,
          from: address,
          to: recipientAddress,
          value: amountInPeb,
          gasLimit: 1_000_000,
          nonce,
          gasPrice,
        }

        if (sdk === 'ethersExt') {
          const provider = new JsonRpcProvider(rpcUrl)
          const wallet = new Wallet(pKeyList[keyIndex], provider)
          const signedTx = await wallet.signTransaction(tx)
          setSignedTx({ rawTransaction: signedTx })
        } else if (sdk === 'web3Ext') {
          const provider = new Web3.providers.HttpProvider(rpcUrl)
          const web3 = new Web3(provider)
          const senderAccount = web3.eth.accounts.privateKeyToAccount(
            pKeyList[keyIndex]
          )
          const signResult = await senderAccount.signTransaction(tx)
          setSignedTx({ rawTransaction: signResult.rawTransaction })
        }
      }
      setSignedKeys((prev) => {
        const next = [...prev]
        next[keyIndex] = true
        return next
      })
    } catch (error) {
      console.error('Error signing transaction:', error)
    }
  }

  const handleSendTransaction = async () => {
    if (!signedTx) {
      console.error('No signed transaction available')
      return
    }

    try {
      setTxLoading(true)
      setTxResult('')

      if (sdk === 'ethersExt') {
        const provider = new JsonRpcProvider(rpcUrl)
        const txHash = await provider.klay.sendRawTransaction(
          signedTx.rawTransaction
        )

        // Retry logic to get transaction receipt
        let result = null
        let attempts = 0
        const maxAttempts = 5
        const delay = 2000 // 2 seconds delay between attempts

        while (attempts < maxAttempts) {
          try {
            result = await provider.klay.getTransactionReceipt(txHash)
            if (result) break
          } catch (error) {
            console.log(
              `Attempt ${attempts + 1}: Waiting for transaction receipt...`,
              error
            )
          }
          await new Promise((resolve) => setTimeout(resolve, delay))
          attempts++
        }

        if (!result) {
          throw new Error(
            'Transaction receipt not found after maximum attempts'
          )
        }

        setTxResult(JSON.stringify(result, null, 2))
      } else if (sdk === 'web3Ext') {
        const provider = new Web3.providers.HttpProvider(rpcUrl)
        const web3 = new Web3(provider)
        const result = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        )

        // Helper function to handle BigInt serialization
        const serializeResult = (obj: any): any => {
          if (obj === null || obj === undefined) return obj
          if (typeof obj === 'bigint') return obj.toString()
          if (Array.isArray(obj)) return obj.map(serializeResult)
          if (typeof obj === 'object') {
            const result: any = {}
            for (const key in obj) {
              result[key] = serializeResult(obj[key])
            }
            return result
          }
          return obj
        }
        setTxResult(JSON.stringify(serializeResult(result), null, 2))
      }

      setStep2Success(true)
    } catch (error) {
      setTxResult(parseError(error))
    } finally {
      setTxLoading(false)
    }
  }

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
              setStep2Success(true)
            })
          }}
          btnLoading={loading}
          result={result}
          code={CODE_EG.accountUpdateMultiSig[sdk]}
        />
      )}

      {step2Success && (
        <ActionCard
          title="Step 3. Send Transaction with MultiSig"
          topComp={
            <View style={{ gap: 10 }}>
              <FormInput
                label="Recipient Address"
                inputProps={{
                  placeholder: 'Enter recipient address',
                  value: recipientAddress,
                  onChangeText: setRecipientAddress,
                }}
                disabled={txLoading}
                errorMessage={recipientErrMsg}
              />
              <FormInput
                label="Amount (KAIA)"
                inputProps={{
                  placeholder: 'Enter amount',
                  value: amount,
                  onChangeText: setAmount,
                }}
                disabled={txLoading}
              />
              <View style={{ gap: 4 }}>
                <Row
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
                    Sign with Private Keys
                  </KaText>
                  <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
                    {`Weighted Signatures: ${signedWeight}/${threshold}`}
                  </KaText>
                </Row>
                <View
                  style={{
                    height: 8,
                    backgroundColor: getTheme('gray', '1'),
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min(
                        100,
                        (signedWeight / threshold) * 100
                      )}%`,
                      backgroundColor: canSendTransaction
                        ? getTheme('success', '5')
                        : getTheme('brand', '5'),
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </View>
                <View style={{ gap: 8 }}>
                  {_.times(numberOfKeys, (i) => (
                    <View key={`sign-pKey-${i}`} style={{ gap: 8 }}>
                      <PrivateKeyForm
                        label={`Key ${i + 1} (Weight: ${weightList[i]})`}
                        privateKey={pKeyList[i] ?? ''}
                        setPrivateKey={(v) => {
                          setPKeyList((prev) => {
                            const next = [...prev]
                            next[i] = v
                            return next
                          })
                        }}
                        disabled={txLoading}
                      />
                      <KaButton
                        type={signedKeys[i] ? 'secondary' : 'primary'}
                        size="md"
                        onClick={() => handleSignTransaction(i)}
                        disabled={
                          txLoading ||
                          !recipientAddress ||
                          !amount ||
                          signedKeys[i]
                        }
                      >
                        {signedKeys[i] ? 'Signed' : 'Sign Transaction'}
                      </KaButton>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          }
          onClickBtn={handleSendTransaction}
          btnLoading={txLoading}
          btnDisabled={!canSendTransaction}
          result={txResult}
          code={CODE_EG.accountUpdateMultiSigValueTransfer[sdk]}
        />
      )}
    </Container>
  )
}

export default AccountKeyMultiSig
