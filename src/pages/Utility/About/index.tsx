import { ReactElement } from 'react'
import { KaText } from '@kaiachain/kaia-design-system'

import { Container, View } from '@/components'

const About = (): ReactElement => {
  return (
    <Container title="About Utility">
      <View>
        <KaText fontType="body/md_700" mb="4">Kaia Blockchain Utilities</KaText>
        <KaText fontType="body/md_400" mb="4">
          The Utility section provides essential tools for Kaia blockchain developers to perform common operations and conversions. These utilities are designed to simplify development workflows and enhance productivity when building on the Kaia network.
        </KaText>
        
        <KaText fontType="body/md_700" mb="2">Unit Converter</KaText>
        <KaText fontType="body/md_400" mb="4">
          Convert between different Kaia currency units (peb, ston, KAIA) with precision. The converter supports both simple and extended modes, allowing developers to work with the full range of Kaia denominations.
        </KaText>
        
        <KaText fontType="body/md_700" mb="2">Sign & Verify</KaText>
        <KaText fontType="body/md_400" mb="4">
          Cryptographically sign messages and verify signatures using Kaia-compatible wallets. This utility helps developers implement secure authentication and message verification in their applications.
        </KaText>
        
        <KaText fontType="body/md_700" mb="2">Address Checksum</KaText>
        <KaText fontType="body/md_400" mb="4">
          Validate and convert Kaia addresses to their checksummed format according to KIP-13 standards. Proper address checksumming helps prevent errors when handling addresses in your applications.
        </KaText>
        
        <KaText fontType="body/md_700" mb="2">Getting Started</KaText>
        <KaText fontType="body/md_400">
          Select a utility from the navigation menu to begin. Each tool includes detailed instructions and examples to help you understand its functionality and integrate it into your development workflow.
        </KaText>
      </View>
    </Container>
  )
}

export default About
