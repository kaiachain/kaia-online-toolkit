import { font, themeFunc } from '@kaiachain/kaia-design-system'
import styled from 'styled-components'

export const Textarea = styled.textarea<{ $isError?: boolean }>`
  width: 100%;
  padding: 16px 20px;
  border-radius: 24px;
  box-sizing: border-box;
  background-color: ${themeFunc('elevation', '9')};
  color: ${themeFunc('gray', '0')};
  ${font['body/md_600'].styles};
  resize: none;
  border: none;
  outline: ${(props) =>
    props.$isError ? `1px solid ${themeFunc('danger', '6')(props)}` : 'none'};

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::placeholder {
    color: ${themeFunc('elevation', '5')};
  }

  &:focus {
    outline: ${(props) =>
      props.$isError
        ? undefined
        : `4px solid ${themeFunc('elevation', '8')(props)}`};
  }
`
