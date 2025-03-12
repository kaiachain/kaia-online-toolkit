import { ReactElement } from 'react'
import { KaButton } from '@kaiachain/kaia-design-system'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

import { useTheme } from '../../hooks/independent'

export const ThemeToggle = (): ReactElement => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <KaButton
      onClick={toggleTheme}
      style={{
        padding: '8px',
        minWidth: 'auto',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
    </KaButton>
  )
}

export default ThemeToggle
