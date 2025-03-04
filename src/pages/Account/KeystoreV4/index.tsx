import { ReactElement, useState } from 'react'

import { Container, Row, SdkSelectBox } from '@/components'
import { useKeystorePage } from '@/hooks/page/useKeystorePage'
import { KaButton, KaText } from '@kaiachain/kaia-design-system'

const KeystoreV4 = (): ReactElement => {
  const useKeystorePageReturn = useKeystorePage()
  const { sdk, setSdk } = useKeystorePageReturn
  const [fromKey, setFromKey] = useState(true)

  return (
    <Container title="KeystoreV4">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['ethers', 'web3']}
      />
      <Row style={{ gap: 10 }}>
        <KaButton
          onClick={() => {
            setFromKey(true)
          }}
          type={fromKey ? 'secondary' : 'tertiary'}
        >{`Private key -> Keystore`}</KaButton>
        <KaButton
          onClick={() => {
            setFromKey(false)
          }}
          type={!fromKey ? 'secondary' : 'tertiary'}
        >{`Keystore -> Private key `}</KaButton>
      </Row>

      <KaText fontType="body/lg_400">Working</KaText>
    </Container>
  )
}

export default KeystoreV4
