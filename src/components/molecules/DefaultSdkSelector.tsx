import { ReactElement } from 'react'
import { KaText } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { SdkSelectBox, View } from '@/components'
import { useDefaultSdk } from '@/hooks'
import { SdkType } from '@/types'

const Container = styled(View)`
  margin-bottom: 16px;
`

export const DefaultSdkSelector = (): ReactElement => {
  const { defaultSdk, setDefaultSdk } = useDefaultSdk()

  return (
    <Container>
      <KaText fontType="body/md_700" style={{ marginBottom: 8 }}>
        Default SDK
      </KaText>
      <SdkSelectBox
        sdk={defaultSdk}
        setSdk={setDefaultSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />
    </Container>
  )
}
