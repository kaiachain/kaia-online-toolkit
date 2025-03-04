import { ReactElement, ReactNode } from 'react'

import { Card, CodeBlock, View } from '@/components'
import { KaButton, KaText } from '@kaiachain/kaia-design-system'
import DotLoading from '../atom/DotLoading'

export const ActionCard = ({
  title,
  topComp,
  btnDisabled,
  btnLoading,
  onClickBtn,
  code,
  result,
  bottomComp,
}: {
  title: string
  topComp?: ReactNode
  btnDisabled?: boolean
  btnLoading?: boolean
  onClickBtn: () => void
  code?: string
  result?: string
  bottomComp?: ReactNode
}): ReactElement => {
  return (
    <Card>
      <KaText fontType="title/xs_700">{title}</KaText>
      {topComp}
      <KaButton
        type="secondary"
        disabled={btnLoading || btnDisabled}
        onClick={onClickBtn}
      >
        {btnLoading ? <DotLoading light /> : 'Confirm'}
      </KaButton>
      {code && <CodeBlock text={code} />}
      {result && (
        <View>
          <KaText fontType="body/md_700">Result</KaText>
          <CodeBlock toggle={false} text={result} />
        </View>
      )}
      {bottomComp}
    </Card>
  )
}
