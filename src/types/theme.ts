import { darkTheme as kaDarkTheme } from '@kaiachain/kaia-design-system'

export type ThemeModeType = 'dark' | 'light'

export type ThemeType = typeof kaDarkTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
