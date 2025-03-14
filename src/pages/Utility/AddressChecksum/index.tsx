import { ReactElement } from 'react'
import { KaTextInput } from '@kaiachain/kaia-design-system'

import { ActionCard, Container, SdkSelectBox } from '@/components'
import { useAddressChecksumPage } from '@/hooks/page/useAddressChecksumPage'
import { CODE_EG } from '@/consts'

const AddressChecksum = (): ReactElement => {
  const { sdk, setSdk, address, setAddress, verifyAddress, loading, result } =
    useAddressChecksumPage()

  return (
    <Container title="Address Checksum">
      <SdkSelectBox
        sdk={sdk}
        setSdk={setSdk}
        optionsList={['viem', 'ethers', 'web3']}
      />

      <ActionCard
        title="Verify Address Checksum"
        topComp={
          <KaTextInput
            inputProps={{
              value: address,
              onChangeText: setAddress,
              placeholder: 'Enter Ethereum address',
            }}
            containerStyle={{ flex: 1 }}
          />
        }
        onClickBtn={verifyAddress}
        btnLoading={loading}
        code={CODE_EG.addressChecksum[sdk]}
        result={result[sdk]}
      />
    </Container>
  )
}

export default AddressChecksum
