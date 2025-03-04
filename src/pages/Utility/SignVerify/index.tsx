import { ReactElement } from 'react'
import { KaTextInput } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { ActionCard, Container, SdkSelectBox, View } from '@/components'
import { useSignVerifyPage } from '@/hooks/page/useSignVerifyPage'
import { CODE_EG } from '@/consts'

const InputContainer = styled(View)`
  margin-bottom: 16px;
`

const SignVerify = (): ReactElement => {
  const {
    sdk,
    setSdk,
    message,
    setMessage,
    signature,
    setSignature,
    verifySignature,
    loading,
    result,
  } = useSignVerifyPage()

  return (
    <Container title="Signature Verification">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      <ActionCard
        title="Verify Message Signature"
        topComp={
          <>
            <InputContainer>
              <KaTextInput
                inputProps={{
                  value: message,
                  onChangeText: setMessage,
                  placeholder: 'Enter message',
                }}
                containerStyle={{ flex: 1 }}
              />
            </InputContainer>
            <InputContainer>
              <KaTextInput
                inputProps={{
                  value: signature,
                  onChangeText: setSignature,
                  placeholder: 'Enter signature',
                }}
                containerStyle={{ flex: 1 }}
              />
            </InputContainer>
          </>
        }
        onClickBtn={verifySignature}
        btnLoading={loading}
        code={CODE_EG.signVerify[sdk]}
        result={result[sdk]}
      />
    </Container>
  )
}

export default SignVerify
