import { ReactElement, useMemo } from 'react'
import {
  font,
  KaButton,
  KaText,
  themeFunc,
  useKaTheme,
} from '@kaiachain/kaia-design-system'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import styled from 'styled-components'

import { View, FormInput, Row } from '@/components'
import { UTIL } from '@/common'
import { useValidator } from '@/hooks'

const StyledContainer = styled(View)`
  flex: 1;
`

const StyledSummary = styled.summary`
  cursor: pointer;
  color: ${themeFunc('brand', '5')};
  ${font['body/sm_700'].styles}
`

export const PrivateKeyForm = ({
  label,
  privateKey,
  setPrivateKey,
  disabled,
  generator,
}: {
  label?: string
  privateKey: string
  setPrivateKey: (value: string) => void
  disabled?: boolean
  generator?: boolean
}): ReactElement => {
  const { getTheme } = useKaTheme()
  const pubKey = useMemo(() => {
    if (UTIL.isValidPrivateKey(privateKey)) {
      return privateKeyToAccount(privateKey as '0x').publicKey
    }
  }, [privateKey])
  const { errorMessage } = useValidator({
    value: privateKey,
    type: 'privateKey',
  })

  return (
    <StyledContainer>
      <FormInput
        label={label}
        hide
        inputProps={{
          placeholder: 'Enter private key',
          value: privateKey,
          onChangeText: setPrivateKey,
        }}
        disabled={disabled}
        rightComponent={
          !generator || privateKey ? undefined : (
            <KaButton
              size="md"
              style={{ alignSelf: 'center' }}
              onClick={() => {
                setPrivateKey(generatePrivateKey())
              }}
            >
              Generate
            </KaButton>
          )
        }
        errorMessage={errorMessage}
      />
      {pubKey && (
        <View style={{ padding: 6 }}>
          <details>
            <StyledSummary>Public key</StyledSummary>
            <Row>
              <KaText fontType="body/sm_400">
                {pubKey.slice(0, 4)}
                <span
                  style={{
                    color: getTheme('success', '4'),
                  }}
                >
                  {pubKey.slice(4, 68)}
                </span>
                <span
                  style={{
                    color: getTheme('brand', '4'),
                  }}
                >
                  {pubKey.slice(68)}
                </span>
              </KaText>
            </Row>
          </details>
        </View>
      )}
    </StyledContainer>
  )
}
