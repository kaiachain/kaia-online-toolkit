import { ReactElement } from 'react'
import { KaTextInput } from '@kaiachain/kaia-design-system'

import { ActionCard, Container, SdkSelectBox } from '@/components'
import { useEstimateGasPage } from '@/hooks/page/useEstimateGasPage'
import { CODE_EG } from '@/consts'

const EstimateGas = (): ReactElement => {
  const { sdk, setSdk, txData, setTxData, estimateGas, result } =
    useEstimateGasPage()

  return (
    <Container title="Estimate Gas">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      <ActionCard
        title="Transaction Data"
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
    </Container>
  )
}

export default EstimateGas
