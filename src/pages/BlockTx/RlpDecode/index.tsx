import { ReactElement } from 'react'
import { KaText, KaTextInput, useKaTheme } from '@kaiachain/kaia-design-system'

import { ActionCard, Card, Container, SdkSelectBox } from '@/components'
import { useRlpDecodePage } from '@/hooks/page/useRlpDecodePage'
import { CODE_EG } from '@/consts'

const RlpDecode = (): ReactElement => {
  const { sdk, setSdk, data, setData, decode, result } = useRlpDecodePage()

  const isWeb3 = sdk === 'web3'
  const { getTheme } = useKaTheme()

  return (
    <Container title="Rlp Decode">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      {isWeb3 ? (
        <Card>
          <KaText fontType="title/xs_700">Decode</KaText>
          <KaText fontType="body/md_700" color={getTheme('info', '5')}>
            {`Web3.js alone does not support RLP decoding.`}
          </KaText>
        </Card>
      ) : (
        <ActionCard
          title="Decode"
          topComp={
            <KaTextInput
              inputProps={{
                value: data,
                onChangeText: setData,
              }}
              containerStyle={{ flex: 1 }}
            />
          }
          onClickBtn={decode}
          code={CODE_EG.rlpDecode[sdk]}
          result={result[sdk]}
        />
      )}
    </Container>
  )
}

export default RlpDecode
