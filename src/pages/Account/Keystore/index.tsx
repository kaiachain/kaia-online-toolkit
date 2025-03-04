import { ReactElement, useState } from 'react'
import { KaButton } from '@kaiachain/kaia-design-system'

import { Container, Row, SdkSelectBox } from '@/components'
import { useKeystorePage } from '@/hooks/page/useKeystorePage'
import KeyToStore from './KeyToStore'
import StoreToKey from './StoreToKey'

const Keystore = (): ReactElement => {
  const useKeystorePageReturn = useKeystorePage()
  const { sdk, setSdk } = useKeystorePageReturn
  const [fromKey, setFromKey] = useState(true)

  return (
    <Container title="Keystore">
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
      {fromKey ? (
        <KeyToStore useKeystorePageReturn={useKeystorePageReturn} />
      ) : (
        <StoreToKey useKeystorePageReturn={useKeystorePageReturn} />
      )}
    </Container>
  )
}

export default Keystore
