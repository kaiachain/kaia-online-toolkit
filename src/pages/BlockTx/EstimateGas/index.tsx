import { ReactElement } from 'react'
import { KaText, KaTextInput, useKaTheme } from '@kaiachain/kaia-design-system'

import { ActionCard, Card, Container, SdkSelectBox } from '@/components'
import { useEstimateGasPage } from '@/hooks/page/useEstimateGasPage'
import { CODE_EG } from '@/consts'

const EstimateGas = (): ReactElement => {
  const { sdk, setSdk, txData, setTxData, estimateGas, result } =
    useEstimateGasPage()
  const { getTheme } = useKaTheme()

  const isNotViem = sdk !== 'viem'

  return (
    <Container title="Estimate Gas">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      {isNotViem ? (
        <Card>
          <KaText fontType="title/xs_700">Estimate Gas</KaText>
          <KaText fontType="body/md_700" color={getTheme('info', '5')}>
            {`This functionality is only supported with viem.`}
          </KaText>
        </Card>
      ) : (
        <ActionCard
          title="Estimate Gas"
          topComp={
            <KaTextInput
              inputProps={{
                value: txData,
                onChangeText: setTxData,
              }}
              containerStyle={{ flex: 1 }}
            />
          }
          onClickBtn={estimateGas}
          code={CODE_EG.estimateGas[sdk]}
          result={result[sdk]}
        />
      )}
    </Container>
  )
}

export default EstimateGas
