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
// TODO import AveragingStrategyContract from 'public/AveragingStrategy.json'
import AveragingStrategyContract from '../../../../backend/artifacts/contracts/AveragingStrategy.sol/AveragingStrategy.json'


export const AveragingStrategiesTable = ({ supportedTokens, strategiesList, setStrategiesList }) => {
    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses & Blocks
    const AVERAGING_STRATEGY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AVERAGING_STRATEGY_CONTRACT_ADDRESS
    const DEPLOYMENT_BLOCK = process.env.NEXT_PUBLIC_AVERAGING_STRATEGY_DEPLOYMENT_BLOCK


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
            // console.log(strategiesList)
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
        const contract = new ethers.Contract(AVERAGING_STRATEGY_CONTRACT_ADDRESS, AveragingStrategyContract.abi, provider)
        let transaction = await contract.connect(address).readAveragingStrategy()
        // ...if there are strategies, update the state...
        if (transaction.length) {
            let strategies = []
            transaction.forEach((item) => {
                const strategy = {
                    sourceTokenAddress: item.sourceToken,
                    tokenToAverageAddress: item.averagedToken,
                    amount: item.amount.toNumber(),
                    frequency: item.frequency.toNumber(),
                    isActive: item.isActive,
                    averagingStrategyId: item.averagingStrategyId.toNumber()
                };
                strategies = [...strategies, strategy];
            });
            setStrategiesList(strategies);
        // if not empty it, so other addresses don't see the list of the previous address
        } else {
            setStrategiesList([])
        }
    }

    // Converts frequency data to seconds
    const convertSecondsToFrequency = (seconds) => {
        if (seconds < 60) {
            return seconds + " " + "Second(s)"
        } else if (seconds < 3600) {
            return Math.floor(seconds / 60) + " " + "Minute(s)"
        } else if (seconds < 86400) {
            return Math.floor(seconds / 3600) + " " + "Hour(s)"
        } else if (seconds < 604800) {
            return Math.floor(seconds / 86400) + " " + "Day(s)"
        } else if (seconds < 2592000) {
            return Math.floor(seconds / 604800) + " " + "Week(s)"
        } else {
            return Math.floor(seconds / 2592000) + " " + "Month(s)"
        }
    };


    // HTML Content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <TableContainer>
            <Table>
                <TableCaption placement="top">Defined dollar cost averaging strategies</TableCaption>
                <Thead>
                    <Tr key="tokenAddress_1">
                        <Th>Status</Th>
                        <Th isNumeric>Amount</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th isNumeric>Each</Th>
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
                        <Td isNumeric>{strategy.amount}</Td>
                        <Td>
                            <HStack>
                                <Avatar size="sm"
                                    name={supportedTokens.find(token => ethers.utils.getAddress(strategy.sourceTokenAddress) === ethers.utils.getAddress(token.address)).name}
                                    src={supportedTokens.find(token => ethers.utils.getAddress(strategy.sourceTokenAddress) === ethers.utils.getAddress(token.address)).icon}
                                />
                                <Text>
                                    {supportedTokens.find(token => ethers.utils.getAddress(strategy.sourceTokenAddress) === ethers.utils.getAddress(token.address)).name}
                                </Text>
                            </HStack>
                        </Td>
                        <Td>
                            <HStack>
                                <Avatar size="sm"
                                    name={supportedTokens.find(token => ethers.utils.getAddress(strategy.tokenToAverageAddress) === ethers.utils.getAddress(token.address)).name}
                                    src={supportedTokens.find(token => ethers.utils.getAddress(strategy.tokenToAverageAddress) === ethers.utils.getAddress(token.address)).icon}
                                />
                                <Text>
                                    {supportedTokens.find(token => ethers.utils.getAddress(strategy.tokenToAverageAddress) === ethers.utils.getAddress(token.address)).name}
                                </Text>
                            </HStack>
                        </Td>
                        <Td isNumeric>{convertSecondsToFrequency(strategy.frequency)}</Td>
                        {/* <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td> */}
                    </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    )
}