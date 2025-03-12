import { ReactElement } from 'react'
import { KaTextInput } from '@kaiachain/kaia-design-system'

import { ActionCard, Container, SdkSelectBox } from '@/components'
import { useTxHistoryPage } from '@/hooks/page'
import { CODE_EG } from '@/consts'

const TxHistory = (): ReactElement => {
  const { sdk, setSdk, address, setAddress, getTxHistory, loading, result } =
    useTxHistoryPage()

  return (
    <Container title="Transaction History">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      <ActionCard
        title="Get Transaction History"
        topComp={
          <KaTextInput
            inputProps={{
              value: address,
              onChangeText: setAddress,
              placeholder: 'Enter address',
            }}
            containerStyle={{ flex: 1 }}
          />
        }
        onClickBtn={getTxHistory}
        btnLoading={loading}
        code={CODE_EG.txHistory[sdk]}
        result={result[sdk]}
      />
    </Container>
  )
}

export default TxHistory
