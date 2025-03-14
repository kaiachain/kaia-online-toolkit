import { ReactElement } from 'react'
import { KaText, KaBox, KaHeading } from '@kaiachain/kaia-design-system'

import { Container, View } from '@/components'

const About = (): ReactElement => {
  return (
    <Container title="About Utility">
      <View>
        <KaBox mb="4">
          <KaHeading as="h2" fontType="heading/lg_700" mb="2">
            Kaia Blockchain Utilities
          </KaHeading>
          <KaText fontType="body/md_400" mb="4">
            The Utility section provides essential tools for Kaia blockchain developers to perform common operations and conversions. These utilities are designed to simplify development workflows and enhance productivity when building on the Kaia network.
          </KaText>
        </KaBox>

        <KaBox mb="4">
          <KaHeading as="h3" fontType="heading/md_700" mb="2">
            Unit Converter
          </KaHeading>
          <KaText fontType="body/md_400" mb="2">
            Convert between different Kaia currency units (peb, ston, KAIA) with precision. The converter supports both simple and extended modes, allowing developers to work with the full range of Kaia denominations.
          </KaText>
        </KaBox>

        <KaBox mb="4">
          <KaHeading as="h3" fontType="heading/md_700" mb="2">
            Sign & Verify
          </KaHeading>
          <KaText fontType="body/md_400" mb="2">
            Cryptographically sign messages and verify signatures using Kaia-compatible wallets. This utility helps developers implement secure authentication and message verification in their applications.
          </KaText>
        </KaBox>

        <KaBox mb="4">
          <KaHeading as="h3" fontType="heading/md_700" mb="2">
            Address Checksum
          </KaHeading>
          <KaText fontType="body/md_400" mb="2">
            Validate and convert Kaia addresses to their checksummed format according to KIP-13 standards. Proper address checksumming helps prevent errors when handling addresses in your applications.
          </KaText>
        </KaBox>

        <KaBox>
          <KaHeading as="h3" fontType="heading/md_700" mb="2">
            Getting Started
          </KaHeading>
          <KaText fontType="body/md_400">
            Select a utility from the navigation menu to begin. Each tool includes detailed instructions and examples to help you understand its functionality and integrate it into your development workflow.
          </KaText>
        </KaBox>
      </View>
    </Container>
  )
}

export default About
