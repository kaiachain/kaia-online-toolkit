import { ReactElement } from 'react'
import Lottie from 'lottie-react'

import loadingAnimation from '@/animation/lottie/new_loading_animation.json'

export const Loading = ({ size = 60 }: { size?: number }): ReactElement => {
  return (
    <Lottie
      style={{ width: size, height: size }}
      loop
      autoplay
      animationData={loadingAnimation}
      rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
    />
  )
}
