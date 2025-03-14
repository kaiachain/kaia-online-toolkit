import { ReactElement } from 'react'

import { ActionCard, Container, SdkSelectBox, Textarea } from '@/components'
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
          <Textarea
            value={txData}
            onChange={(e) => setTxData(e.target.value)}
            placeholder={`Fill the transaction data`}
            rows={8}
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
