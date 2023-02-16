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


export default function Home() {
  // States for...
  // -----------------------------------------------------------------------------------------------------------------
  // ...the tokens supported by AIO
  const [supportedTokens, setSupportedTokens] = useState([])


  // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
  // -----------------------------------------------------------------------------------------------------------------
  // ...accessing account data and connection status.
  const { address, isConnected } = useAccount()


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
            <AveragingStrategiesForm supportedTokens={supportedTokens}
                                     setSupportedTokens={setSupportedTokens}>
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
