import { ReactElement } from 'react'

import { Container, View } from '@/components'
import { EIP, URL_MAP } from '@/consts'

const EIP2612 = (): ReactElement => {
  const data = EIP.list.find((item) => item.no === '2612')

  return (
    <Container
      title="ERC-2612: Permit Extension for EIP-20 Signed Approvals"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-2612`,
        text: data?.summary ?? '',
      }}
    >
      <View></View>
    </Container>
  )
}

export default EIP2612
