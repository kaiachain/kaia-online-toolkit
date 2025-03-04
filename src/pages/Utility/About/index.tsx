import { ReactElement } from 'react'
import { KaText } from '@kaiachain/kaia-design-system'

import { Container, View } from '@/components'

const About = (): ReactElement => {
  return (
    <Container title="About Utility">
      <View>
        <KaText fontType="body/md_700">Working</KaText>
      </View>
    </Container>
  )
}

export default About
