import { ReactElement } from 'react'
import { KaText } from '@kaiachain/kaia-design-system'
import { Container } from '@/components'

import { URL_MAP } from '@/consts'

const AccountKeyMultiSig = (): ReactElement => {
  return (
    <Container
      onlyKaia
      title="AccountKeyRoleBased"
      link={{
        url: `${URL_MAP.kaiaDocs}learn/accounts/#accountkeyrolebased-`,
        text: 'Kaia docs : AccountKeyRoleBased',
      }}
    >
      <KaText fontType="body/lg_400">Working</KaText>
    </Container>
  )
}

export default AccountKeyMultiSig
