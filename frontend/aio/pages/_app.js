// Rainbowkit
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
// Wagmi
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// Chakra UI
import { ChakraProvider } from '@chakra-ui/react'

// Wagmi
const { chains, provider } = configureChains(
  [hardhat],
  [publicProvider()]
);

// Rainbowkit
const { connectors } = getDefaultWallets({
  appName: 'Adrián Neila Serrano Project #3',
  chains
});

// Wagmi
const wagmiClient = createClient({
  autoConnect: false, // true
  connectors,
  provider
})


export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
