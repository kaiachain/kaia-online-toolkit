import { ReactElement } from 'react'
import {
  KaSelectBox,
  KaText,
  KaTextInput,
  useKaTheme,
} from '@kaiachain/kaia-design-system'

import { ActionCard, Card, Container, Row, SdkSelectBox } from '@/components'
import { DataTypeEnum, useRlpEncodePage } from '@/hooks/page/useRlpEncodePage'
import { CODE_EG } from '@/consts'

const RlpEncode = (): ReactElement => {
  const { sdk, setSdk, data, setData, dataType, setDataType, encode, result } =
    useRlpEncodePage()

  const isWeb3 = sdk === 'web3'
  const { getTheme } = useKaTheme()

  return (
    <Container title="Rlp Encode">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      {isWeb3 ? (
        <Card>
          <KaText fontType="title/xs_700">Encode</KaText>
          <KaText fontType="body/md_700" color={getTheme('info', '5')}>
            {`Web3.js alone does not support RLP encoding.`}
          </KaText>
        </Card>
      ) : (
        <ActionCard
          title="Encode"
          topComp={
            <Row style={{ alignItems: 'center', gap: 8 }}>
              <KaSelectBox
                optionList={[
                  {
                    value: DataTypeEnum.STRING_ARRAY,
                    label: 'string | Array',
                  },
                  {
                    value: DataTypeEnum.UINT8ARRAY,
                    label: 'Uint8Array',
                  },
                ]}
                selectedValue={dataType}
                onSelect={(value) => {
                  setDataType(value as DataTypeEnum)
                }}
                containerStyle={{ maxWidth: 200 }}
              />
              <KaTextInput
                inputProps={{
                  value: data,
                  onChangeText: setData,
                }}
                containerStyle={{ flex: 1 }}
              />
            </Row>
          }
          onClickBtn={encode}
          code={CODE_EG.rlpEncode[sdk]}
          result={result[sdk]}
        />
      )}
    </Container>
  )
}

export default RlpEncode
