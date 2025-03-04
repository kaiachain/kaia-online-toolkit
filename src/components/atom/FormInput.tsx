import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import {
  KaText,
  KaTextInput,
  KaTextInputProps,
  useKaTheme,
} from '@kaiachain/kaia-design-system'

import eye from '@/images/eye_normal.svg'
import eyeSlash from '@/images/eye_slash.svg'
import { View } from '@/components'

const StyledContainer = styled(View)`
  gap: 4px;
`

const StyledInputWrapper = styled(View)`
  position: relative;
`

const StyledHideButton = styled(View)`
  position: absolute;
  left: 10px;
  top: 10px;
`

export type FormInputProps = {
  label?: string
  errorMessage?: string
  hide?: boolean
} & KaTextInputProps

export const FormInput = ({
  label,
  errorMessage,
  hide,
  ...rest
}: FormInputProps): ReactElement => {
  const { getTheme } = useKaTheme()
  const { inputProps } = rest
  const [hideText, setHideText] = useState(hide ?? false)
  const [type, setType] = useState<typeof inputProps.type>(
    hide ? 'password' : inputProps.type
  )

  return (
    <StyledContainer>
      {label && (
        <KaText fontType="body/lg_700" color={getTheme('gray', '2')}>
          {label}
        </KaText>
      )}
      <StyledInputWrapper>
        <KaTextInput
          {...rest}
          inputProps={{ type, ...inputProps }}
          isError={!!errorMessage}
          leftUnit={inputProps.value && hide ? '  ' : undefined}
        />
        {inputProps.value && hide && (
          <StyledHideButton
            onClick={() => {
              setType(hideText ? inputProps.type : 'password')
              setHideText(!hideText)
            }}
          >
            {
              <img
                src={hideText ? eyeSlash : eye}
                alt="eye"
                style={{ width: 20 }}
              />
            }
          </StyledHideButton>
        )}
      </StyledInputWrapper>
      {errorMessage && (
        <KaText fontType="body/sm_400" color={getTheme('danger', '5')}>
          {errorMessage}
        </KaText>
      )}
    </StyledContainer>
  )
}
