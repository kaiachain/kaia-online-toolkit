import { ReactElement, ReactNode, useMemo } from 'react'
import styled from 'styled-components'
import { LinkA, Row, View } from '../atom'
import { KaButton, KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import { useNetwork } from '@/hooks'
import { EvmChainIdEnum } from '@/consts'

type ContainerType = {
  title: string
  link?: {
    url: string
    text: string
  }
  children: ReactNode
  onlyKaia?: boolean
}

const StyledContainer = styled(View)`
  padding: 20px;
  gap: 20px;
`

export const Container = ({
  children,
  title,
  link,
  onlyKaia,
}: ContainerType): ReactElement => {
  const { chainId, changeNetwork } = useNetwork()
  const { getTheme } = useKaTheme()
  const isValidChain = useMemo(
    () =>
      !onlyKaia ||
      [EvmChainIdEnum.KAIA, EvmChainIdEnum.KAIROS].includes(chainId),
    [chainId, onlyKaia]
  )

  return (
    <StyledContainer>
      <View>
        <KaText fontType="title/md_700">{title}</KaText>
        {link && <LinkA link={link.url}>{link?.text}</LinkA>}
      </View>
      {isValidChain ? (
        children
      ) : (
        <View style={{ gap: 10 }}>
          <KaText fontType="title/xs_700" color={getTheme('danger', '5')}>
            This page is only available on Kaia and Kairos.
          </KaText>
          <Row style={{ gap: 10 }}>
            <KaButton
              onClick={() => {
                changeNetwork(EvmChainIdEnum.KAIA)
              }}
              type="secondary"
              size="md"
            >
              Change to Kaia
            </KaButton>
            <KaButton
              onClick={() => {
                changeNetwork(EvmChainIdEnum.KAIROS)
              }}
              type="secondary"
              size="md"
            >
              Change to Kairos
            </KaButton>
          </Row>
        </View>
      )}
    </StyledContainer>
  )
}
