import { ReactElement } from 'react'

import { Container, View } from '@/components'
import { EIP } from '@/consts'

const ERC721 = (): ReactElement => {
  const data = EIP.list.find((item) => item.no === '721')

  return (
    <Container
      title="ERC-721: Non-Fungible Token Standard"
      link={{
        url: 'https://eips.ethereum.org/EIPS/eip-721',
        text: data?.summary ?? '',
      }}
    >
      <View></View>
    </Container>
  )
}

export default ERC721
