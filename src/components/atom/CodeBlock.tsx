import { ReactElement } from 'react'
import styled from 'styled-components'
import { Highlight, themes } from 'prism-react-renderer'
import { useKaTheme } from '@kaiachain/kaia-design-system'
import { ReactComponent as Copy } from '@/images/copy.svg'

import { View } from './View'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'

const StyledContainer = styled(View)`
  width: 100%;
`
const StyledBlockContainer = styled(View)`
  position: relative;
`

const StyledPre = styled.pre`
  text-align: left;
  padding: 5px;
  margin: 0;
  overflow: scroll;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`
const StyledCopyIconBox = styled(View)`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 10px;
`

const StyledLine = styled.div`
  display: table-row;
`

const StyledLineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`

const StyledLineContent = styled.span`
  display: table-cell;
`

export const CodeBlock = ({
  toggle = true,
  text,
  title,
}: {
  toggle?: boolean
  text: string
  title?: string
}): ReactElement => {
  const { getTheme } = useKaTheme()
  const Block = (): ReactElement => (
    <StyledBlockContainer>
      <Highlight theme={themes.nightOwl} code={text} language="tsx">
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }): ReactElement => (
          <StyledPre className={className} style={style}>
            {tokens.map((line, i) => {
              return (
                <StyledLine {...getLineProps({ line })} key={`tokens-${i}`}>
                  <StyledLineNo>{i + 1}</StyledLineNo>
                  <StyledLineContent>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </StyledLineContent>
                </StyledLine>
              )
            })}
          </StyledPre>
        )}
      </Highlight>
      <StyledCopyIconBox
        onClick={() => {
          copy(text)
          toast.success('Copied!')
        }}
      >
        <Copy fill={getTheme('gray', '4')} width={20} height={20} />
      </StyledCopyIconBox>
    </StyledBlockContainer>
  )

  return (
    <StyledContainer>
      {toggle ? (
        <details>
          <summary style={{ cursor: 'pointer', color: getTheme('brand', '5') }}>
            {title || 'Code'}
          </summary>
          <Block />
        </details>
      ) : (
        <Block />
      )}
    </StyledContainer>
  )
}
