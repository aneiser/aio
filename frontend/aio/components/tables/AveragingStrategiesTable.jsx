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
import { Switch } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
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
    // ...the strategy list
    const [strategiesList, setStrategiesList] = useState([])


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

    // Gets the strategies
    // whenever the 'scEvents' status change
    useEffect(() => {
        if (isConnected && scEvents) {
            getSCStrategiesArray()
        }
    }, [scEvents])

    // Gets the strategies
    // whenever the 'scEvents' status change
    useEffect(() => {
        if (isConnected) {
            console.log(strategiesList)
        }
    }, [strategiesList])


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


    // Gets the strategies...
    const getSCStrategiesArray = async () => {
        // ...if there are strategies,...
        if (scEvents.filter(event => event.event === "AveragingStrategyCreated").length) {
            let strategies = []
            scEvents
                .filter(event => event.event === "AveragingStrategyCreated")
                .forEach((e) => {
                    const strategy = {
                        sourceTokenAddress: e.args.tokenAddress,
                        tokenToAverageAddress: e.args.sourceToken,
                        amount: e.args.amount.toNumber(),
                        frequency: e.args.frequency.toNumber(),
                        isActive: e.args.isActive
                    };
                    strategies = [...strategies, strategy];
                });
            setStrategiesList(strategies);
        }
    }


    // HTML Content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Defined dollar cost averaging strategies</TableCaption>
                <Thead>
                    <Tr key="tokenAddress_1">
                        <Th>Status</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric>Interval</Th>
                        {/* <Th isNumeric>Current price</Th>
                        <Th isNumeric>Avg. price</Th>
                        <Th isNumeric>Diff</Th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {strategiesList && strategiesList.map((strategy, index) =>
                    <Tr key={index}>
                        <Td>
                            <Switch
                                // id="initial-status"
                                isChecked={strategy.isActive}
                                isDisabled
                                // onChange={(e) => setSelectedInitialStatus(e.target.checked)}
                            />
                        </Td>
                        <Td>
                            <HStack>
                                {/* <SkeletonCircle isLoaded={!isLoadingSelectedSourceToken}> */}
                                    <Avatar
                                        size="sm"
                                        // name={selectedSourceToken ? selectedSourceToken.symbol : ''}
                                        // src={selectedSourceToken ? selectedSourceToken.icon : ''}
                                    />
                                {/* </SkeletonCircle> */}
                                    <Text>{strategy.sourceTokenAddress}</Text>
                            </HStack>
                        </Td>
                        <Td>
                            <HStack>
                                {/* <keletonCircle isLoaded={!isLoadingSelectedSourceToken}> */}
                                    <Avatar
                                        size="sm"
                                        // name={selectedSourceToken ? selectedSourceToken.symbol : ''}
                                        // src={selectedSourceToken ? selectedSourceToken.icon : ''}
                                    />
                                {/* </SkeletonCircle> */}
                                    <Text>{strategy.tokenToAverageAddress}</Text>
                            </HStack>
                        </Td>
                        <Td isNumeric>{strategy.amount}</Td>
                        <Td isNumeric>{strategy.frequency}</Td>
                        {/* <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td> */}
                    </Tr>
                    )}
                    <Tr color="blue" key="tokenAddress_4">
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