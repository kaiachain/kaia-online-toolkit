import { ReactElement, useMemo } from 'react'
import styled from 'styled-components'

import {
  ActionCard,
  FormInput,
  PrivateKeyForm,
  View,
  FormDownload,
} from '@/components'
import { UseKeystorePageReturn } from '@/hooks/page/useKeystorePage'
import { privateKeyToAccount } from 'viem/accounts'
import { UTIL } from '@/common'
import { CODE_EG } from '@/consts'

const StyledContainer = styled(View)``

const KeyToStore = ({
  useKeystorePageReturn,
}: {
  useKeystorePageReturn: UseKeystorePageReturn
}): ReactElement => {
  const {
    sdk,
    pKey4Keystore,
    setPKey4Keystore,
    pKey4KeystoreErrMsg,
    generateKeystore,
    encryptResult,
    password,
    setPassword,
  } = useKeystorePageReturn

  const account = useMemo(() => {
    if (UTIL.isValidPrivateKey(pKey4Keystore)) {
      return privateKeyToAccount(pKey4Keystore as '0x')
    }
  }, [pKey4Keystore])

  return (
    <StyledContainer>
      <ActionCard
        title="Generate Keystore from Private Key"
        topComp={
          <View style={{ gap: 10 }}>
            <PrivateKeyForm
              label="Private Key for keystore"
              privateKey={pKey4Keystore}
              setPrivateKey={setPKey4Keystore}
              generator
            />
            <FormInput
              label="Encrypt Password"
              hide
              inputProps={{
                value: password,
                onChangeText: setPassword,
              }}
            />
          </View>
        }
        onClickBtn={generateKeystore}
        btnDisabled={!pKey4Keystore || !!pKey4KeystoreErrMsg || !password}
        result={encryptResult}
        code={CODE_EG.encryptPrivateKey[sdk]}
        bottomComp={
          account &&
          encryptResult && (
            <FormDownload
              title="Download Keystore File"
              fileData={encryptResult}
              fileName={`keystoreV3-${account.address}`}
            />
          )
        }
      />
    </StyledContainer>
  )
}

export default KeyToStore
