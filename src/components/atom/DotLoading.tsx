import Lottie from 'lottie-react'

import dotLoadingDark from '@/animation/lottie/dot_loading.json'
import dotLoadingLimeDark from '@/animation/lottie/dot_loading_lime_dark.json'
import dotLoadingLimeLight from '@/animation/lottie/dot_loading_lime_light.json'
import dotLoadingLight from '@/animation/lottie/dot_loading_white.json'

const dotLoadingMap = {
  dark: {
    lime: {
      light: dotLoadingLimeLight,
      dark: dotLoadingLimeDark,
    },
    default: {
      light: dotLoadingLight,
      dark: dotLoadingDark,
    },
  },
  light: {
    lime: {
      light: dotLoadingLimeDark,
      dark: dotLoadingLimeLight,
    },
    default: {
      light: dotLoadingDark,
      dark: dotLoadingLight,
    },
  },
} as const

const DotLoading = (props: {
  light?: boolean
  lime?: boolean
  height?: number
}) => {
  const dotLoading =
    dotLoadingMap['dark'][props.lime ? 'lime' : 'default'][
      props.light ? 'light' : 'dark'
    ]

  return (
    <Lottie
      style={{ height: props.height || 20 }}
      loop
      autoplay
      animationData={dotLoading}
    />
  )
}

export default DotLoading
