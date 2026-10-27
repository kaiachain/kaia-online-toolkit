import { ReactElement, useEffect } from 'react'
import { useLocation } from 'react-router'
import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'

import { View } from '@/components'
import { URL_MAP } from '@/consts'

// The wizard is a static page outside this app. S3 doesn't resolve
// /contracts-wizard to its index.html, so CloudFront falls back to the app;
// send the browser on to the static page.
const ContractsWizardPage = (): ReactElement => {
  const { pathname, search, hash } = useLocation()
  const { getTheme } = useKaTheme()
  // Already on the static page's URL means it wasn't built; don't reload forever
  const isMissing = pathname === URL_MAP.contractsWizard

  useEffect(() => {
    if (!isMissing) {
      window.location.replace(URL_MAP.contractsWizard + search + hash)
    }
  }, [isMissing, search, hash])

  return (
    <View style={{ padding: 40, alignItems: 'center' }}>
      <KaText color={getTheme('gray', '2')} fontType="body/md_400">
        {isMissing
          ? 'Contracts Wizard is not available. Run `yarn build:wizard`.'
          : 'Opening Contracts Wizard…'}
      </KaText>
    </View>
  )
}

export default ContractsWizardPage
