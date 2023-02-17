// React
import { useState, useEffect } from 'react'
// Next
import Head from 'next/head'
// WagmiConfig
import { useAccount } from 'wagmi'
// ChakraProvider
import { Flex } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
// Component & Dapp
import { Layout } from '@/components/layout/Layout.jsx'
import { AveragingStrategiesTable } from '@/components/tables/AveragingStrategiesTable.jsx'
import { AveragingStrategiesForm } from '@/components/forms/AveragingStrategiesForm.jsx'
// Openocean API/SDK integation
// Must be done dynamically with useEffect after Next.js pre-renders


export default function Home() {
  // Constants
  // -----------------------------------------------------------------------------------------------------------------
  // Supported tokens by AIO
  const SUPPORTED_TOKENS = ["DAI", "1INCH", "AAVE", "AXS", "CRV", "LINK", "MANA", "MATIC", "MKR", "SHIB", "SUSHI", "UNI", "YFI", "WETH", "WBTC", "SAND"];


  // States for...
  // -----------------------------------------------------------------------------------------------------------------
  // ...the tokens supported by AIO
  const [supportedTokens, setSupportedTokens] = useState([])


  // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
  // -----------------------------------------------------------------------------------------------------------------
  // ...accessing account data and connection status.
  const { address, isConnected } = useAccount()


  // `useEffect`s
  // -------------------------------------------------------------------------------------------------------------------
  // Openocean API/SDK integration
  // Dynamically imported according to option 1 (of 3): https://stackoverflow.com/questions/66096260/why-am-i-getting-referenceerror-self-is-not-defined-when-i-import-a-client-side
  // The error occurs because the library requires Web APIs to work, which are not available when Next.js pre-renders the page on the server-side.
  // In your case, `openocean` tries to access the window object which is not present on the server.
  // To fix it, you have to dynamically import `openocean` so it only gets loaded on the client-side.
  useEffect(() => {
    const initOpenocean = async () => {
      const { OpenoceanApiSdk } = await import('@openocean.finance/api')
      const openoceanApiSdk = new OpenoceanApiSdk()
      const { api, swapSdk, config } = openoceanApiSdk

      // Gets all the available tokens OpenOcean on `eth`...
      const getAvailableTokens = async () => {
        api.getTokenList({
          chain: 'eth',
        }).then((data) => {
          // ...but saves only the surpported by AIO ones
          const filteredArray = data.data.filter(token => SUPPORTED_TOKENS.includes(token.symbol));
          setSupportedTokens(filteredArray)
          loadingSplashScreen = false
        }).catch((error) => {
          console.error(error)
          return
        });
      }
      getAvailableTokens()
    }
    initOpenocean()
  }, [])


  return (
    <>
      <Head>
        <title>AIO</title>
        <meta name="description" content="AIO Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isConnected ? (
          <>
            <AveragingStrategiesForm supportedTokens={supportedTokens}>
            </AveragingStrategiesForm>
            <AveragingStrategiesTable supportedTokens={supportedTokens}>
            </AveragingStrategiesTable>
          </>
        ) : (
          <Flex p="2rem" justifyContent="center">
            <Text>Please, connect your wallet to use AIO</Text>
          </Flex>
        )}
      </Layout>
    </>
  )
}
