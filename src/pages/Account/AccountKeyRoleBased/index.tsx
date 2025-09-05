import { ReactElement, useMemo, useState } from 'react'
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
import { useAccountKeyRoleBasedPage } from '@/hooks/page/useAccountKeyRoleBasedPage'
import { CODE_EG, EvmChainIdEnum, URL_MAP } from '@/consts'
import { UTIL } from '@/common'
import { useAccountKey, useBalance, useNetwork, useValidator } from '@/hooks'
import {
  Wallet,
  JsonRpcProvider,
  TxType,
} from '@kaiachain/ethers-ext/v6'
import { Web3 } from '@kaiachain/web3js-ext'
import { parseError } from '@/common'

const AccountKeyRoleBased = (): ReactElement => {
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
    pKeyList,
    setPKeyList,
  } = useAccountKeyRoleBasedPage()

  const { chainId } = useNetwork()
  const { getTheme } = useKaTheme()

  const [step2Success, setStep2Success] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [txLoading, setTxLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [txResult, setTxResult] = useState('')
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

  const canSendTransaction = useMemo(() => {
    return recipientAddress && amount
  }, [recipientAddress, amount])

  const handleSendTransaction = async () => {
    const signedTx = await handleSignTransaction()
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
      console.log('txResult', txResult)
    } catch (error) {
      setTxResult(parseError(error))
    } finally {
      setTxLoading(false)
    }
  }

  const handleSignTransaction = async () => {
    try {
      const amountInPeb = BigInt(parseFloat(amount) * 1e18).toString()
      let signedTx: { rawTransaction: string } = { rawTransaction: '' };
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
        const wallet = new Wallet(pKeyList[0], provider)
        const rawTransaction = await wallet.signTransaction(tx)
        signedTx = { rawTransaction: rawTransaction }
      } else if (sdk === 'web3Ext') {
        const provider = new Web3.providers.HttpProvider(rpcUrl)
        const web3 = new Web3(provider)
        const senderAccount = web3.eth.accounts.privateKeyToAccount(
          pKeyList[0]
        )
        const signResult = await senderAccount.signTransaction(tx)
        signedTx = { rawTransaction: signResult.rawTransaction }
      }
      return signedTx
    } catch (error) {
      console.error('Error signing transaction:', error)
      throw error
    }

  }

  return (
    <Container
      onlyKaia
      title="AccountKeyRoleBased"
      link={{
        url: `${URL_MAP.kaiaDocs}learn/accounts/#accountkeyrolebased-`,
        text: 'Kaia docs : AccountKeyRoleBased',
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
          title="Step 2. Update to AccountKeyRoleBased"
          topComp={
            <View style={{ gap: 10 }}>
              <PrivateKeyForm
                label="Private key of address"
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                disabled={loading}
              />

              <View style={{ gap: 8 }}>
                <PrivateKeyForm
                  label="RoleTransaction"
                  privateKey={pKeyList[0]}
                  setPrivateKey={(v) => {
                    setPKeyList([v, pKeyList[1], pKeyList[2]])
                  }}
                  disabled={loading}
                  generator
                />
                <PrivateKeyForm
                  label="RoleAccountUpdate"
                  privateKey={pKeyList[1]}
                  setPrivateKey={(v) => {
                    setPKeyList([pKeyList[0], v, pKeyList[2]])
                  }}
                  disabled={loading}
                  generator
                />
                <PrivateKeyForm
                  label="RoleFeePayer"
                  privateKey={pKeyList[2]}
                  setPrivateKey={(v) => {
                    setPKeyList([pKeyList[0], pKeyList[1], v])
                  }}
                  disabled={loading}
                  generator
                />
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
          code={CODE_EG.accountUpdateRoleBased[sdk]}
        />
      )}

      {step2Success && (
        <ActionCard
          title="Step 3. Send Transaction with RoleTransaction"
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
                <View style={{ gap: 8 }}>
                  <View key={`sign-transactionRole-pKey`} style={{ gap: 8 }}>
                    <PrivateKeyForm
                      label={`Transaction Role Key`}
                      privateKey={pKeyList[0] ?? ''}
                      setPrivateKey={(v) => {
                        setPKeyList((prev) => {
                          const next = [...prev] as [string, string, string]
                          next[0] = v
                          return next
                        })
                      }}
                      disabled={txLoading}
                    />
         
                  </View>
                </View>
              </View>
            </View>
          }
          onClickBtn={handleSendTransaction}
          btnLoading={txLoading}
          btnDisabled={!canSendTransaction}
          result={txResult}
          code={CODE_EG.accountRoleBasedValueTransfer[sdk]}
        />
      )}
    </Container>
  )
}

export default AccountKeyRoleBased
