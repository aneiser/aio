// React
import { useState, useEffect } from 'react'
// Next
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount } from 'wagmi'
import { useProvider } from 'wagmi'
import { useSigner } from 'wagmi'
// RainbowKitProvider
// ChakraProvider
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Switch } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// Components & Dapp contracts
import MockDaiTokenContract from 'public/MockDaiToken.json'
import AveragingStrategyContract from 'public/AveragingStrategy.json'


export const AveragingStrategiesForm = ({ supportedTokens }) => {
    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const MOCK_DAI_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const AVERAGING_STRATEGY_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    // Source amount values
    const MIN_SOURCE_UNIT_VALUE = 1
    const MAX_SOURCE_UNIT_VALUE = 1000
    // Frequency names and values
    const SECOND_UNIT= "Seconds"
    const MINUTE_UNIT= "Minutes"
    const HOUR_UNIT= "Hours"
    const DAY_UNIT= "Days"
    const WEEK_UNIT= "Weeks"
    const MONTH_UNIT= "Months" // Not natively supported by Solidity
    const MIN_FREQUENCY_VALUE = 1
    const MAX_FREQUENCY_VALUE_FOR_SECOND_MINUTE_UNIT = 60
    const MAX_FREQUENCY_VALUE_FOR_HOUR_UNIT = 24
    const MAX_FREQUENCY_VALUE_FOR_DAY_UNIT = 30
    const MAX_FREQUENCY_VALUE_FOR_WEEK_UNIT = 4
    const MAX_FREQUENCY_VALUE_FOR_MONTH_UNIT = 12 // Not natively supported by Solidity
    const DEFAULT_FREQUENCY_UNIT = "Weeks"
    const TIME_IN_SECONDS = {
        Seconds: 1,
        Minutes: 60,
        Hours: 60 * 60,
        Days: 24 * 60 * 60,
        Weeks: 7 * 24 * 60 * 60,
        Months: 30 * 24 * 60 * 60, // approximately 30 days per month
    };


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the mockDAI balance
    const [mockDaiBalance, setMockDaiBalance] = useState("?")
    // ...the selected averaging source token and its loading
    const [selectedSourceToken, setSelectedSourceToken] = useState(null)
    const [isLoadingSelectedSourceToken, setIsLoadingSelectedSourceToken] = useState(true)
    // ...the selected token to average and its loading
    const [selectedTokenToAverage, setSelectedTokenToAverage] = useState(null)
    const [isLoadingSelectedTokenToAverage, setIsLoadingSelectedTokenToAverage] = useState(true)
    // ...the selected amount, in dollar pegged stablecoin, to buy each time
    const [selectedAmount, setSelectedAmount] = useState(MIN_SOURCE_UNIT_VALUE)
    // ...the selected frequency amount and frequency unit to buy
    const [selectedFrequency, setSelectedFrequency] = useState(MIN_FREQUENCY_VALUE)
    const [maxFrequencyValue, setMaxFrequencyValue] = useState(MAX_FREQUENCY_VALUE_FOR_WEEK_UNIT)
    const [selectedFrequencyUnit, setSelectedFrequencyUnit] = useState(DEFAULT_FREQUENCY_UNIT)
    // ...the selected initial status
    const [selectedInitialStatus, setSelectedInitialStatus] = useState(true)
    // ...the new strategy
    const [newStrategy, setNewStrategy] = useState({
        sourceTokenAddress: MOCK_DAI_CONTRACT_ADDRESS,
        tokenToAverageAddress: null,
        amount: 0,
        frequency: 0,
        initialStatus: true,
    });
    // ...the strategy list
    const [strategiesList, setStrategiesList] = useState([])
    // ...the waiting for the blockchain confirmation
    const [waitingBlochainSignatureConfirmation, setWaitingBlochainSignatureConfirmation] = useState(false)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // ...accessing Client's ethers Provider.
    const provider = useProvider()
    // ...accessing ethers Signer object for connected account.
    const { data: signer } = useSigner()


    // RainbowKit
    // -----------------------------------------------------------------------------------------------------------------
    // ...RainbowKit A
    // ...RainbowKit B


    // ChakraProvider
    // -----------------------------------------------------------------------------------------------------------------
    const toast = useToast()

    const handleSelectedTokenToAverageChange = (event) => {
        setIsLoadingSelectedTokenToAverage(true)
        setSelectedTokenToAverage(
            supportedTokens.find(token => token.address === event.target.value)
        )
    }

    const handleSelectedFrequencyUnitChange = (event) => {
        const { value } = event.target;
        setSelectedFrequencyUnit(value);

        const maxFrequencyValues = {
            [SECOND_UNIT]: MAX_FREQUENCY_VALUE_FOR_SECOND_MINUTE_UNIT,
            [MINUTE_UNIT]: MAX_FREQUENCY_VALUE_FOR_SECOND_MINUTE_UNIT,
            [HOUR_UNIT]: MAX_FREQUENCY_VALUE_FOR_HOUR_UNIT,
            [DAY_UNIT]: MAX_FREQUENCY_VALUE_FOR_DAY_UNIT,
            [WEEK_UNIT]: MAX_FREQUENCY_VALUE_FOR_WEEK_UNIT,
            [MONTH_UNIT]: MAX_FREQUENCY_VALUE_FOR_MONTH_UNIT,
        };

        const maxFrequencyValue = maxFrequencyValues[value];

        setMaxFrequencyValue(maxFrequencyValue);
        if (selectedFrequency > maxFrequencyValue) {
            setSelectedFrequency(maxFrequencyValue);
        }
    }


    // `useEffect`s
    // Gets the mock DAI balance whenever the users:
    // - connect their wallet to the Dapp (isConnected)
    // - change the account in their wallet (address)
    useEffect(() => { if (isConnected) { getMockDaiBalance() } }, [isConnected, address])
    // Sets the selected source token whenever its information (supportedTokens) is fully set
    useEffect(() => { if (isConnected) { setSelectedSourceToken(supportedTokens.find(token => token.symbol === "DAI")) } }, [supportedTokens])
    // Sets the selected token to average whenever its information (supportedTokens) is fully set
    useEffect(() => { if (isConnected) { setSelectedTokenToAverage(supportedTokens.find(token => token.symbol === "WBTC")) } }, [supportedTokens])
    // Sets to false the corresponding loading status of the selected source token whenever it (selectedSourceToken) is fully set
    useEffect(() => { if (isConnected && selectedSourceToken) { setIsLoadingSelectedSourceToken(false) } }, [selectedSourceToken])
    // Sets to false the corresponding loading status of the selected token to average whenever it (selectedTokenToAverage) is fully set
    useEffect(() => { if (isConnected && selectedTokenToAverage) { setIsLoadingSelectedTokenToAverage(false) } }, [selectedTokenToAverage])
    // Updates the newStrategy object whenever some of its fiels changes
    useEffect(() => { if (isConnected) { updateNewStrategy() } }, [selectedSourceToken, selectedTokenToAverage, selectedAmount, selectedFrequency, selectedInitialStatus, selectedFrequencyUnit])


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Gets mock DAI balance
    const getMockDaiBalance = async () => {
        const contract = new ethers.Contract(MOCK_DAI_CONTRACT_ADDRESS, MockDaiTokenContract.abi, provider)
        let transaction = await contract.balanceOf(address)
        setMockDaiBalance(ethers.utils.formatEther(transaction.toString()))
    }

    // Converts frequency data to seconds
    const convertToSeconds = (value, unit) => {
        const seconds = value * TIME_IN_SECONDS[unit];
        return seconds;
    };

    // Updates the new strategy object
    const updateNewStrategy = async () => {
        let frequencyInSecs = convertToSeconds(selectedFrequency, selectedFrequencyUnit);

        setNewStrategy({
            sourceTokenAddress: selectedSourceToken ? selectedSourceToken.address : '',
            tokenToAverageAddress: selectedTokenToAverage ? selectedTokenToAverage.address : '',
            amount: selectedAmount,
            frequency: frequencyInSecs,
            initialStatus: selectedInitialStatus
        });
    }

    // Creates an averaging strategy
    const createAveragingStrategy = async () => {
        setWaitingBlochainSignatureConfirmation(true)

        try {
            const contract = new ethers.Contract(AVERAGING_STRATEGY_CONTRACT_ADDRESS, AveragingStrategyContract.abi, signer)
            let transaction = await contract.createAveragingStrategy(
                newStrategy.sourceTokenAddress,
                newStrategy.tokenToAverageAddress,
                newStrategy.initialStatus,
                newStrategy.amount,
                newStrategy.frequency
            )
            await transaction.wait() // = wait(1)

            setStrategiesList([...strategiesList, newStrategy])

            setWaitingBlochainSignatureConfirmation(false)
            toast({
                title: `Strategy created ${selectedInitialStatus ? 'and activated' : ''}`,
                description: selectedAmount + ' ' + selectedSourceToken.symbol + ' to ' + selectedTokenToAverage.symbol + ' each ' + selectedFrequency + ' ' + selectedFrequencyUnit,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            setWaitingBlochainSignatureConfirmation(false)
            toast({
                title: 'Error creating the strategy',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }


    // HTML content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <Card maxW="sm">
            <FormControl>

                <CardHeader align="center" pb="0">
                    <Heading as="h4" size="md">Averaging strategy</Heading>
                </CardHeader>

                <CardBody>
                    <VStack spacing="1.5rem" align="stretch">
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Source token</FormLabel>
                            <HStack>
                                <Card p="0.5rem">
                                    <HStack>
                                        <SkeletonCircle isLoaded={!isLoadingSelectedSourceToken}>
                                            <Avatar
                                                size="sm"
                                                name={selectedSourceToken ? selectedSourceToken.symbol : ''}
                                                src={selectedSourceToken ? selectedSourceToken.icon : ''}
                                            />
                                        </SkeletonCircle>
                                        <Text>{mockDaiBalance} mDAI</Text>
                                    </HStack>
                                </Card>
                                <Card p="0.5rem">
                                    <HStack>
                                        <Avatar
                                            size="sm"
                                            name='?'
                                        />
                                        <Text fontSize="sm">More coming soon!</Text>
                                    </HStack>
                                </Card>
                            </HStack>
                        </VStack>
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Token to average</FormLabel>
                            <HStack>
                                <SkeletonCircle isLoaded={!isLoadingSelectedTokenToAverage}>
                                    <Avatar
                                        size="sm"
                                        name={selectedTokenToAverage ? selectedTokenToAverage.symbol : ''}
                                        src={selectedTokenToAverage ? selectedTokenToAverage.icon : ''}
                                    />
                                </SkeletonCircle>
                                <Select value={selectedTokenToAverage ? selectedTokenToAverage.address : ''} onChange={handleSelectedTokenToAverageChange}>
                                    {supportedTokens.slice(1).map(token =>
                                        <option key={token.address} value={token.address}>{token.name}</option>
                                    )}
                                </Select>
                            </HStack>
                        </VStack>
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Averaging amount</FormLabel>
                            <NumberInput
                                allowMouseWheel
                                max={MAX_SOURCE_UNIT_VALUE}
                                min={MIN_SOURCE_UNIT_VALUE}
                                onChange={value => setSelectedAmount(Number(value))}
                                value={selectedAmount}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </VStack>
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Averaging interval</FormLabel>
                            <HStack>
                                <NumberInput
                                    min={MIN_FREQUENCY_VALUE}
                                    max={maxFrequencyValue}
                                    value={selectedFrequency}
                                    onChange={value => setSelectedFrequency(Number(value))}
                                    allowMouseWheel
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Select value={selectedFrequencyUnit} onChange={handleSelectedFrequencyUnitChange}>
                                    <option value={SECOND_UNIT}>Seconds</option>
                                    <option value={MINUTE_UNIT}>Minutes</option>
                                    <option value={HOUR_UNIT}>Hours</option>
                                    <option value={DAY_UNIT}>Days</option>
                                    <option value={WEEK_UNIT}>Weeks</option>
                                    <option value={MONTH_UNIT}>Months</option> {/* Not natively supported by Solidity */}
                                </Select>
                            </HStack>
                        </VStack>
                        <FormControl alignItems='center' justifyContent="space-between" display='flex'>
                            <FormLabel htmlFor="initial-status" mb='0'>{selectedInitialStatus ? `Active` : `Inactive`} on creation</FormLabel>
                            <Switch
                                id="initial-status"
                                isChecked={selectedInitialStatus}
                                onChange={(e) => setSelectedInitialStatus(e.target.checked)}
                                />
                        </FormControl>
                    </VStack>
                </CardBody>

                <CardFooter>
                    <Button
                        isLoading={waitingBlochainSignatureConfirmation}
                        loadingText="Waiting confirmation"
                        onClick={() => createAveragingStrategy()}
                        width="100%"
                    >
                        Create strategy
                    </Button>
                </CardFooter>

            </FormControl>
        </Card>
    )
}