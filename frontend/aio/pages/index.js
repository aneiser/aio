// Next
import Head from 'next/head'
// Component & Dapp
import { Layout } from '@/components/layout/Layout.jsx'


export default function Home() {
  return (
    <>
      <Head>
        <title>AIO</title>
        <meta name="description" content="AIO Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        Body goes here
      </Layout>
    </>
  )
}
