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
          inputProps={{ 
            type, 
            ...inputProps
          }}
          aria-label={label || 'Input field'}
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessage ? `error-${label?.replace(/\s+/g, '-').toLowerCase() || 'input'}` : undefined}
          isError={!!errorMessage}
          leftUnit={inputProps.value && hide ? '  ' : undefined}
        />
        {inputProps.value && hide && (
          <StyledHideButton
            onClick={() => {
              setType(hideText ? inputProps.type : 'password')
              setHideText(!hideText)
            }}
            role="button"
            aria-label={hideText ? "Show password" : "Hide password"}
            tabIndex={0}
          >
            {
              <img
                src={hideText ? eyeSlash : eye}
                alt={hideText ? "Show password" : "Hide password"}
                style={{ width: 20 }}
              />
            }
          </StyledHideButton>
        )}
      </StyledInputWrapper>
      {errorMessage && (
        <KaText 
          fontType="body/sm_400" 
          color={getTheme('danger', '5')}
          id={`error-${label?.replace(/\s+/g, '-').toLowerCase() || 'input'}`}
          role="alert"
        >
          {errorMessage}
        </KaText>
      )}
    </StyledContainer>
  )
}
