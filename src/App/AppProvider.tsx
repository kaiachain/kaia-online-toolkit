import { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { darkTheme, KaThemeProvider } from '@kaiachain/kaia-design-system'
import { ThemeProvider } from 'styled-components'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { kaiaWallet, okxWallet } from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia, kaia, kairos } from 'wagmi/chains'
import Modal from 'react-modal'
import { ToastContainer } from 'react-toastify'
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'Kaia Toolkit',
  projectId: '5de2f00888d1164b447ff6449b29c05e',
  chains: [mainnet, sepolia, kaia, kairos],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [kaiaWallet, okxWallet],
    },
  ],
})

const queryClient = new QueryClient()
Modal.setAppElement('#root')

function AppProvider({ children }: { children: ReactNode }): ReactElement {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MetaMaskProvider
            sdkOptions={{
              dappMetadata: {
                name: 'Example React Dapp',
                url: window.location.href,
              },
            }}
          >
            <ThemeProvider theme={darkTheme}>
              <KaThemeProvider theme="dark">
                {children}
                <ToastContainer />
              </KaThemeProvider>
            </ThemeProvider>
          </MetaMaskProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppProvider
