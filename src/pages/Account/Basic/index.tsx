import { ReactElement } from 'react'
import { KaButton, KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import {
  Container,
  ActionCard,
  FormInput,
  Card,
  SdkSelectBox,
} from '@/components'

import { useAccountBasicPage } from '@/hooks/page/useAccountBasicPage'
import { CODE_EG, URL_MAP } from '@/consts'

const Basic = (): ReactElement => {
  const {
    sdk,
    setSdk,
    privateKey,
    setPrivateKey,
    accountFromPrivateKey,
    mnemonic,
    setMnemonic,
    accountFromMnemonic,
    pKeyErrMsg,
    mnemonicErrMsg,
    generatePrivateKey,
    privateKeyToAccount,
    generateMnemonic,
    mnemonicToAccount,
  } = useAccountBasicPage()

  const isWeb3 = sdk === 'web3'
  const { getTheme } = useKaTheme()

  return (
    <Container
      title="Account"
      link={{
        url: `${URL_MAP.kaiaDocs}learn/accounts/#accountkeylegacy-`,
        text: 'Kaia docs : AccountKeyLegacy',
      }}
    >
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />
      <ActionCard
        title="Account from private key"
        topComp={
          <FormInput
            inputProps={{
              placeholder: 'Enter private key',
              value: privateKey,
              onChangeText: setPrivateKey,
            }}
            rightComponent={
              <KaButton
                style={{ alignSelf: 'center' }}
                onClick={generatePrivateKey}
              >
                Generate
              </KaButton>
            }
            errorMessage={pKeyErrMsg}
          />
        }
        btnDisabled={!privateKey || !!pKeyErrMsg}
        onClickBtn={privateKeyToAccount}
        code={CODE_EG.accountFromPrivateKey[sdk]}
        result={accountFromPrivateKey[sdk]}
      />

      {isWeb3 ? (
        <Card>
          <KaText fontType="title/xs_700">Account from mnemonic</KaText>
          <KaText fontType="body/md_700" color={getTheme('info', '5')}>
            {`Web3.js alone does not support generating mnemonics or creating accounts from mnemonics.\nyou need additional libraries like bip39 or @ethereumjs/wallet.`}
          </KaText>
        </Card>
      ) : (
        <ActionCard
          title="Account from mnemonic"
          topComp={
            <FormInput
              inputProps={{
                placeholder: 'Enter Menmonic',
                value: mnemonic,
                onChangeText: setMnemonic,
              }}
              rightComponent={
                <KaButton
                  style={{ alignSelf: 'center' }}
                  onClick={generateMnemonic}
                >
                  Generate
                </KaButton>
              }
              errorMessage={mnemonicErrMsg}
            />
          }
          btnDisabled={!mnemonic || !!mnemonicErrMsg}
          onClickBtn={mnemonicToAccount}
          code={CODE_EG.accountFromMnemonic[sdk]}
          result={accountFromMnemonic[sdk]}
        />
      )}
    </Container>
  )
}

export default Basic
