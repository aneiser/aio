// React
import { useState, useEffect } from 'react'
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount } from 'wagmi'
import { useProvider } from 'wagmi'
// ChakraProvider
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
// Components & Dapp contracts
import AveragingStrategyContract from 'public/AveragingStrategy.json'


export function AveragingStrategiesTable() {

    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses & Blocks
    const AVERAGING_STRATEGY_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const DEPLOYMENT_BLOCK = 0


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the smartcontract (sc/SC) events
    const [scEvents, setSCEvents] = useState(null)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // ...accessing Client's ethers Provider.
    const provider = useProvider()


    // `useEffect`s
    // -----------------------------------------------------------------------------------------------------------------
    // Gets blockchain events whenever the users:
    // - connect their wallet to the Dapp (isConnected)
    // - change the account in their wallet (address)
    useEffect(() => {
        if (isConnected) {
            getEvents()
        }
    }, [isConnected, address])


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Gets the previous events emited by the blockchain
    const getEvents = async () => {
        const contract = new ethers.Contract(AVERAGING_STRATEGY_CONTRACT_ADDRESS, AveragingStrategyContract.abi, provider)

        let filter = {
            address: AVERAGING_STRATEGY_CONTRACT_ADDRESS,
            fromBlock: DEPLOYMENT_BLOCK
        }
        let events = await contract.queryFilter(filter)
        console.log(events)
        setSCEvents(events)
    }


    // HTML Content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Defined dollar cost averaging strategies</TableCaption>
                <Thead>
                    <Tr key="tokenAddress_1">
                        <Th>Status</Th>{/* <Th>isActive</Th> */}
                        <Th>Token</Th>{/* <Th>tokenName</Th> */}
                        <Th isNumeric>DCA amount</Th>{/* <Th>amount</Th> */}
                        <Th isNumeric>DCA interval</Th>{/* <Th>frequency</Th> */}
                        <Th isNumeric>Current price</Th>
                        <Th isNumeric>Avg. price</Th>
                        <Th isNumeric>Diff</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr key="tokenAddress_2">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                    <Tr key="tokenAddress_3">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                    <Tr key="tokenAddress_4">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}