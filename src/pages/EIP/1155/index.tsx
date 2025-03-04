import { ReactElement } from 'react'

import { Container, View } from '@/components'
import { EIP, URL_MAP } from '@/consts'

const ERC1155 = (): ReactElement => {
  const data = EIP.list.find((item) => item.no === '1155')

  return (
    <Container
      title="ERC-1155: Multi Token Standard"
      link={{
        url: `${URL_MAP.eip}EIPS/eip-1155`,
        text: data?.summary ?? '',
      }}
    >
      <View></View>
    </Container>
  )
}

export default ERC1155
