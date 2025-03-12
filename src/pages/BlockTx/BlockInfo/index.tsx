import { ReactElement } from 'react'
import { KaTextInput } from '@kaiachain/kaia-design-system'

import { ActionCard, Container, SdkSelectBox } from '@/components'
import { useBlockInfoPage } from '@/hooks/page/useBlockInfoPage'
import { CODE_EG } from '@/consts'

const BlockInfo = (): ReactElement => {
  const { sdk, setSdk, blockQuery, setBlockQuery, getBlockInfo, loading, result } =
    useBlockInfoPage()

  return (
    <Container title="Block Info">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      <ActionCard
        title="Get Block Information"
        topComp={
          <KaTextInput
            inputProps={{
              value: blockQuery,
              onChangeText: setBlockQuery,
              placeholder: 'Enter block number or hash',
            }}
            containerStyle={{ flex: 1 }}
          />
        }
        onClickBtn={getBlockInfo}
        btnLoading={loading}
        code={CODE_EG.blockInfo[sdk]}
        result={result[sdk]}
      />
    </Container>
  )
}

export default BlockInfo
