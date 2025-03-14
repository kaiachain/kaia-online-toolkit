import { ReactElement, useMemo, useState } from 'react'
import { KaText, KaTextInput, useKaTheme } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

import { Container, Card, View } from '@/components'
import { UTILITY } from '@/consts'

import { useAppNavigate } from '@/hooks'
import { UtilityItemType } from '@/types'

const StyledCard = styled(Card)`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 10px;
`

const StyledLink = styled(View)`
  cursor: pointer;
`

const Item = ({
  id,
  type,
  title,
  description,
  inputLower,
  to,
}: UtilityItemType & {
  inputLower: string
}): ReactElement => {
  const { getTheme } = useKaTheme()
  const { navigate } = useAppNavigate()
  
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

  const descriptionText = useMemo(() => {
    const indexOf = description.toLocaleLowerCase().indexOf(inputLower)
    return indexOf > -1 ? (
      <span>
        {description.slice(0, description.toLocaleLowerCase().indexOf(inputLower))}
        <span style={{ color: getTheme('brand', '5') }}>
          {description.slice(indexOf, indexOf + inputLower.length)}
        </span>
        {description.slice(
          description.toLocaleLowerCase().indexOf(inputLower) + inputLower.length
        )}
      </span>
    ) : (
      description
    )
  }, [description, inputLower, getTheme])

  return (
    <>
      <KaText fontType="body/md_400">{typeText}</KaText>
      <StyledLink onClick={() => navigate(to)}>
        <KaText fontType="body/md_700" mb="1">
          {titleText}
        </KaText>
        <KaText fontType="body/sm_400" color={getTheme('gray', '6')}>
          {descriptionText}
        </KaText>
      </StyledLink>
    </>
  )
}

const About = (): ReactElement => {
  const [input, setInput] = useState('')
  const inputLower = useMemo(() => input.toLocaleLowerCase(), [input])
  const filteredList = useMemo(() => {
    return inputLower
      ? UTILITY.list.filter(
          (x) =>
            x.id.toLocaleLowerCase().includes(inputLower) ||
            x.type.toLocaleLowerCase().includes(inputLower) ||
            x.title.toLocaleLowerCase().includes(inputLower) ||
            x.description.toLocaleLowerCase().includes(inputLower)
        )
      : UTILITY.list
  }, [inputLower])

  return (
    <Container title="About Utility">
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
