import { ReactElement } from 'react'
import { KaSelect } from '@kaiachain/kaia-design-system'

import { useDefaultSdk } from '../../hooks/independent'
import { SdkType } from '../../types/sdk'

export const DefaultSdkSelector = (): ReactElement => {
  const { defaultSdk, setDefaultSdk } = useDefaultSdk()
  
  const handleChange = (value: string) => {
    setDefaultSdk(value as SdkType)
  }
  
  return (
    <KaSelect
      label="Default SDK"
      value={defaultSdk}
      onChange={handleChange}
      options={[
        { value: 'viem', label: 'Viem' },
        { value: 'ethers', label: 'Ethers' },
        { value: 'web3', label: 'Web3' },
      ]}
      style={{ minWidth: '120px' }}
    />
  )
}

export default DefaultSdkSelector
