import { ReactElement, ReactNode } from 'react'
import ReactModal, { Props } from 'react-modal'

export const Modal = (props: { children: ReactNode } & Props): ReactElement => {
  const { style, ...rest } = props

  return (
    <ReactModal
      style={{
        overlay: {
          backgroundColor: '#00000080',
          zIndex: 3,
          ...style?.overlay,
        },
        content: {
          inset: 0,
          border: 'none',
          padding: 0,
          borderRadius: 0,
          backgroundColor: 'transparent',
          ...style?.content,
        },
      }}
      {...rest}
      onAfterOpen={(): void => {
        document.body.style.overflow = 'hidden'
      }}
      onAfterClose={(): void => {
        document.body.style.overflow = ''
      }}
    />
  )
}
