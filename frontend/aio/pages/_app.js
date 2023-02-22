// Rainbowkit
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
// Wagmi
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
// Chakra UI
import { ChakraProvider } from '@chakra-ui/react'

// Wagmi
const { chains, provider } = configureChains(
  [hardhat, goerli],
  [publicProvider()]
);

// Rainbowkit
const { connectors } = getDefaultWallets({
  appName: 'AIO Project',
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
