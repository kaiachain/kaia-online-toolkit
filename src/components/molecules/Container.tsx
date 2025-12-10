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
  allowedChainIds?: EvmChainIdEnum[]
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
  allowedChainIds,
}: ContainerType): ReactElement => {
  const { chainId, changeNetwork } = useNetwork()
  const { getTheme } = useKaTheme()

  const validChainIds = useMemo(() => {
    if (allowedChainIds) {
      return allowedChainIds
    }
    if (onlyKaia) {
      return [EvmChainIdEnum.KAIA, EvmChainIdEnum.KAIROS]
    }
    return []
  }, [onlyKaia, allowedChainIds])

  const isValidChain = useMemo(
    () =>
      validChainIds.length === 0 || validChainIds.includes(chainId),
    [chainId, validChainIds]
  )

  const getNetworkName = (chainId: EvmChainIdEnum): string => {
    switch (chainId) {
      case EvmChainIdEnum.KAIA:
        return 'Kaia'
      case EvmChainIdEnum.KAIROS:
        return 'Kairos'
      case EvmChainIdEnum.ETHEREUM:
        return 'Ethereum'
      case EvmChainIdEnum.SEPOLIA:
        return 'Sepolia'
      default:
        return 'Unknown'
    }
  }

  const errorMessage = useMemo(() => {
    if (validChainIds.length === 0) return ''
    const networkNames = validChainIds.map(getNetworkName).join(' and ')
    return `This page is only available on ${networkNames}.`
  }, [validChainIds])

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
            {errorMessage}
          </KaText>
          <Row style={{ gap: 10 }}>
            {validChainIds.includes(EvmChainIdEnum.KAIA) && (
              <KaButton
                onClick={() => {
                  changeNetwork(EvmChainIdEnum.KAIA)
                }}
                type="secondary"
                size="md"
              >
                Change to Kaia
              </KaButton>
            )}
            {validChainIds.includes(EvmChainIdEnum.KAIROS) && (
              <KaButton
                onClick={() => {
                  changeNetwork(EvmChainIdEnum.KAIROS)
                }}
                type="secondary"
                size="md"
              >
                Change to Kairos
              </KaButton>
            )}
          </Row>
        </View>
      )}
    </StyledContainer>
  )
}
