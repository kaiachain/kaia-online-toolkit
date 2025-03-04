import { ReactElement, useMemo, useState } from 'react'
import { KaText, KaTextInput, useKaTheme } from '@kaiachain/kaia-design-system'
import { english } from 'viem/accounts'
import styled from 'styled-components'

import { Container, Card } from '@/components'

const StyledCard = styled(Card)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`

const Mnemonic = (): ReactElement => {
  const [input, setInput] = useState('')
  const inputLower = useMemo(() => input.toLocaleLowerCase(), [input])
  const filteredList = useMemo(() => {
    return inputLower
      ? english.filter((word) => word.toLocaleLowerCase().includes(inputLower))
      : english
  }, [inputLower])

  const { getTheme } = useKaTheme()

  return (
    <Container title={`Mnemonic (${english.length})`}>
      <KaTextInput
        inputProps={{
          value: input,
          onChangeText: setInput,
          placeholder: 'Search',
        }}
      />
      <StyledCard>
        {filteredList.map((word, index) => (
          <KaText key={index} fontType="body/md_400">
            {inputLower ? (
              <span>
                {word.slice(0, word.indexOf(inputLower))}
                <span style={{ color: getTheme('brand', '5') }}>
                  {inputLower}
                </span>
                {word.slice(word.indexOf(inputLower) + inputLower.length)}
              </span>
            ) : (
              word
            )}
          </KaText>
        ))}
      </StyledCard>
    </Container>
  )
}

export default Mnemonic
