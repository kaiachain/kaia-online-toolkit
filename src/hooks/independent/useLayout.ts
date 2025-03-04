import { useMediaQuery } from 'react-responsive'

import { STYLE } from '@/consts'

export const useLayout = (): {
  isUnderTabletWidth: boolean
  isUnderMobileWidth: boolean
  isUnderMiniWidth: boolean
} => {
  const isUnderTabletWidth = useMediaQuery({ maxWidth: STYLE.size.TABLET })
  const isUnderMobileWidth = useMediaQuery({ maxWidth: STYLE.size.MOBILE })
  const isUnderMiniWidth = useMediaQuery({ maxWidth: STYLE.size.MINI })

  return {
    isUnderTabletWidth,
    isUnderMobileWidth,
    isUnderMiniWidth,
  }
}
