import { css } from 'styled-components'

const size = {
  DESKTOP_WIDE: 1920,
  DESKTOP: 1440,
  TABLET: 1024,
  MOBILE: 480,
  MINI: 320,
}

const media = {
  overWideDesktop: `(min-width: ${size.DESKTOP_WIDE + 1}px)`,
  overDesktop: `(min-width: ${size.DESKTOP + 1}px)`,
  mini: `(max-width: ${size.MINI}px)`,
  mobile: `(max-width: ${size.MOBILE}px)`,
  tablet: `(max-width: ${size.TABLET}px)`,
}

const clickable = css`
  cursor: pointer;
  user-select: none;
`

const setMediaWidth = () => css`
  margin: 0 auto;
  width: ${size.DESKTOP}px;
  @media ${media.tablet} {
    width: auto;
    margin: 0;
  }
`

const ellipsisRow = (row: number) => css`
  min-width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${row};
  -webkit-box-orient: vertical;
`

const inheritText = css`
  font: inherit;
`

const STYLE = {
  size,
  media,
  clickable,
  setMediaWidth,
  ellipsisRow,
  inheritText,
}

export default STYLE
