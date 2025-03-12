import { themeFunc, useKaTheme } from '@kaiachain/kaia-design-system'
import { CSSProperties, ReactElement, ReactNode, KeyboardEvent } from 'react'
import styled from 'styled-components'
import closeImg from '../../images/close.svg'

import { Modal, View } from '../atom'

const StyledContainerWrapper = styled(View)`
  background-color: ${themeFunc('gray', '10')};
  border-radius: 24px;
`
const StyledContainer = styled(View)`
  position: relative;
  padding: 36px 28px 28px;
  background-color: ${themeFunc('elevation', '10')};
  width: 320px;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 24px;
  gap: 12px;
  border: 1px solid ${themeFunc('elevation', '7')};
  box-shadow: 0px var(--Sizing-3, 16px) var(--Sizing-7, 32px) 0px
    ${themeFunc('elevation', '8')};
`

const StyledIconX = styled(View)`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`

export type KeyboardAccessibleFormModalProps = {
  isOpen: boolean
  onClickClose?: () => void
  children: ReactNode
  containerStyle?: CSSProperties
}

export const KeyboardAccessibleFormModal = ({
  isOpen,
  onClickClose,
  children,
  containerStyle,
}: KeyboardAccessibleFormModalProps): ReactElement => {
  const { getTheme } = useKaTheme()
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClickClose?.();
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <StyledContainerWrapper>
        <StyledContainer style={containerStyle}>
          <StyledIconX 
            onClick={onClickClose}
            role="button"
            aria-label="Close modal"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <img
              src={closeImg}
              style={{ width: 20 }}
              color={getTheme('elevation', '5')}
              alt="Close"
            />
          </StyledIconX>
          {children}
        </StyledContainer>
      </StyledContainerWrapper>
    </Modal>
  )
}
