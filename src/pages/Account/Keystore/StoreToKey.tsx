import { ReactElement } from 'react'
import styled from 'styled-components'

import { ActionCard, Card, FormFile, FormInput, View } from '@/components'
import { UseKeystorePageReturn } from '@/hooks/page/useKeystorePage'
import { CODE_EG } from '@/consts'

const StyledContainer = styled(View)``

const StoreToKey = ({
  useKeystorePageReturn,
}: {
  useKeystorePageReturn: UseKeystorePageReturn
}): ReactElement => {
  const {
    sdk,
    keystore4PKey,
    setKeystore4PKey,
    password,
    setPassword,
    decryptKeystore,
    decryptResult,
    decryptedKey,
  } = useKeystorePageReturn

  const handleKeystoreChange = (files?: FileList): void => {
    if (files && files.length > 0) {
      const fileReader = new FileReader()
      fileReader.readAsText(files[0], 'UTF-8')
      fileReader.onload = (event): void => {
        if (typeof event.target?.result === 'string') {
          setKeystore4PKey(event.target.result)
        }
      }
    }
  }

  return (
    <StyledContainer>
      <ActionCard
        title="Decrypt Keystore"
        topComp={
          <View style={{ gap: 10 }}>
            <FormFile
              placeholder="Keystore File"
              accept=".json"
              onChange={handleKeystoreChange}
            />
            <FormInput
              label="Decrypt Password"
              hide
              inputProps={{
                value: password,
                onChangeText: setPassword,
              }}
            />
          </View>
        }
        onClickBtn={decryptKeystore}
        btnDisabled={!keystore4PKey}
        result={decryptResult}
        code={CODE_EG.decryptPrivateKey[sdk]}
      />
      {decryptedKey && (
        <Card>
          <FormInput
            label="Decrypted Private Key"
            hide
            inputProps={{
              value: decryptedKey,
            }}
            readOnly
          />
        </Card>
      )}
    </StyledContainer>
  )
}

export default StoreToKey
