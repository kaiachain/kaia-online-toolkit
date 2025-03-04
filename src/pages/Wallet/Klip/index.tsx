import { ReactElement } from 'react'
import { KaButton } from '@kaiachain/kaia-design-system'

import { Container } from '@/components'

const Klip = (): ReactElement => {
  return (
    <Container title="Klip">
      <KaButton>Connect Klip</KaButton>
    </Container>
  )
}

export default Klip
