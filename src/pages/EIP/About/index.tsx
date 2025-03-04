import { ReactElement, useMemo, useState } from 'react'
import { KaText, KaTextInput, useKaTheme } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { Container, Card, View, LinkA } from '@/components'
import { EIP, URL_MAP } from '@/consts'

import { useAppNavigate } from '@/hooks'
import { EipItemType } from '@/types'

const StyledCard = styled(Card)`
  display: grid;
  grid-template-columns: 30px 60px 1fr 40px;
  grid-gap: 10px;
`

const StyledLink = styled(View)`
  cursor: pointer;
`

const Item = ({
  no,
  type,
  title,
  doc,
  inputLower,
  to,
}: EipItemType & {
  inputLower: string
}): ReactElement => {
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()
  const noText = useMemo(() => {
    const indexOf = no.toLocaleLowerCase().indexOf(inputLower)
    return indexOf > -1 ? (
      <span>
        {no.slice(0, indexOf)}
        <span style={{ color: getTheme('brand', '5') }}>
          {no.slice(indexOf, indexOf + inputLower.length)}
        </span>
        {no.slice(indexOf + inputLower.length)}
      </span>
    ) : (
      no
    )
  }, [no, inputLower, getTheme])

  const typeText = useMemo(() => {
    const indexOf = type.toLocaleLowerCase().indexOf(inputLower)

    return indexOf > -1 ? (
      <span>
        {type.slice(0, indexOf)}
        <span style={{ color: getTheme('brand', '5') }}>
          {type.slice(indexOf, indexOf + inputLower.length)}
        </span>
        {type.slice(indexOf + inputLower.length)}
      </span>
    ) : (
      type
    )
  }, [type, inputLower, getTheme])

  const titleText = useMemo(() => {
    const indexOf = title.toLocaleLowerCase().indexOf(inputLower)
    return indexOf > -1 ? (
      <span>
        {title.slice(0, title.toLocaleLowerCase().indexOf(inputLower))}
        <span style={{ color: getTheme('brand', '5') }}>
          {title.slice(indexOf, indexOf + inputLower.length)}
        </span>
        {title.slice(
          title.toLocaleLowerCase().indexOf(inputLower) + inputLower.length
        )}
      </span>
    ) : (
      title
    )
  }, [title, inputLower, getTheme])

  return (
    <>
      <KaText fontType="body/md_400">{noText}</KaText>
      <KaText fontType="body/md_400">{typeText}</KaText>
      <StyledLink onClick={() => navigate(to)}>
        <KaText fontType="body/md_400" color={getTheme('info', '4')}>
          {titleText}
        </KaText>
      </StyledLink>
      <LinkA link={doc}>doc</LinkA>
    </>
  )
}

const About = (): ReactElement => {
  const [input, setInput] = useState('')
  const inputLower = useMemo(() => input.toLocaleLowerCase(), [input])
  const filteredList = useMemo(() => {
    return inputLower
      ? EIP.list.filter(
          (x) =>
            x.no.toLocaleLowerCase().includes(inputLower) ||
            x.type.toLocaleLowerCase().includes(inputLower) ||
            x.title.toLocaleLowerCase().includes(inputLower)
        )
      : EIP.list
  }, [inputLower])

  return (
    <Container
      title="About EIP"
      link={{
        url: `${URL_MAP.eip}all`,
        text: 'Ethereum Improvement Proposals',
      }}
    >
      <KaTextInput
        inputProps={{
          value: input,
          onChangeText: setInput,
          placeholder: 'Search',
        }}
      />
      <StyledCard>
        {filteredList.map((item, index) => {
          return <Item key={index} {...item} inputLower={inputLower} />
        })}
      </StyledCard>
    </Container>
  )
}

export default About
