// React
import { useState, useEffect } from 'react'
// Next
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount } from 'wagmi'
import { useProvider } from 'wagmi'
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
// Component & Dapp
import MockDaiTokenContract from 'public/MockDaiToken.json'
// Openocean API/SDK integation
// Must be done dynamically with useEffect after Next.js pre-renders


export function AveragingStrategiesForm() {
    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const MOCK_DAI_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const SUPPORTED_TOKENS = ["DAI", "1INCH", "AAVE", "AXS", "CRV", "LINK", "MANA", "MATIC", "MKR", "SHIB", "SUSHI", "UNI", "YFI", "WETH", "WBTC", "SAND"];
    const MIN_SOURCE_UNIT_VALUE = 1
    const MAX_SOURCE_UNIT_VALUE = 1000


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the mockDAI balance
    const [mockDaiBalance, setMockDaiBalance] = useState("?")
    // ...the tokens supported by AIO
    const [supportedTokens, setSupportedTokens] = useState([])
    // ...the selected averaging source token and its loading
    const [selectedSourceToken, setSelectedSourceToken] = useState(null)
    const [isLoadingSelectedSourceToken, setIsLoadingSelectedSourceToken] = useState(true)
    // ...the selected token to average and its loading
    const [selectedTokenToAverage, setSelectedTokenToAverage] = useState(null)
    const [isLoadingSelectedTokenToAverage, setIsLoadingSelectedTokenToAverage] = useState(true)
    // ...the selected amount, in dollar pegged stablecoin, to buy each time
    const [selectedAmount, setSelectedAmount] = useState(MIN_SOURCE_UNIT_VALUE)
    // ...the selected initial status
    const [selectedInitialStatus, setSelectedInitialStatus] = useState(true)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // ...accessing Client's ethers Provider.
    const provider = useProvider()


    // RainbowKit
    // -----------------------------------------------------------------------------------------------------------------
    // ...RainbowKit A
    // ...RainbowKit B


    // ChakraProvider
    // -----------------------------------------------------------------------------------------------------------------
    const handleSelectedTokenToAverageChange = (event) => {
        setIsLoadingSelectedTokenToAverage(true)
        setSelectedTokenToAverage(
            supportedTokens.find(token => token.address === event.target.value)
        )
    }


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

            // Gets all the available tokens OpenOcean has on `eth`...
            const getAvailableTokens = async () => {
                api.getTokenList({
                    chain: 'eth',
                }).then((data) => {
                    // ...but saves only the surpported by AIO ones
                    const filteredArray = data.data.filter(token => SUPPORTED_TOKENS.includes(token.symbol));
                    setSupportedTokens(filteredArray)
                }).catch((error) => {
                    console.error(error)
                    return
                });
            }
            getAvailableTokens()
        }
        initOpenocean()
    }, [])

    // Gets the mock DAI balance whenever the users:
    // - connect their wallet to the Dapp (isConnected)
    // - change the account in their wallet (address)
    useEffect(() => {if (isConnected) {getMockDaiBalance()}}, [isConnected, address])
    // Sets the selected source token whenever its information (supportedTokens) is fully set
    useEffect(() => {if (isConnected) {setSelectedSourceToken   (supportedTokens.find(token => token.symbol === "DAI" ))}}, [supportedTokens])
    // Sets the selected token to average whenever its information (supportedTokens) is fully set
    useEffect(() => {if (isConnected) {setSelectedTokenToAverage(supportedTokens.find(token => token.symbol === "WBTC"))}}, [supportedTokens])
    // Sets to false the corresponding loading status of the selected source token whenever it (selectedSourceToken) is fully set
    useEffect(() => {if (isConnected && selectedSourceToken   ) {setIsLoadingSelectedSourceToken   (false)}}, [selectedSourceToken])
    // Sets to false the corresponding loading status of the selected token to average whenever it (selectedTokenToAverage) is fully set
    useEffect(() => {if (isConnected && selectedTokenToAverage) {setIsLoadingSelectedTokenToAverage(false)}}, [selectedTokenToAverage])


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Gets mock DAI balance
    const getMockDaiBalance = async () => {
        const contract = new ethers.Contract(MOCK_DAI_CONTRACT_ADDRESS, MockDaiTokenContract.abi, provider)
        let transaction = await contract.balanceOf(address)
        setMockDaiBalance(ethers.utils.formatEther(transaction.toString()))
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
                                <NumberInput min={1} max={1000000}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Select defaultValue="Weeks">
                                    <option value="Hours">Hours</option>
                                    <option value="Days">Days</option>
                                    <option value="Weeks">Weeks</option>
                                    <option value="Months">Months</option>
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
                    <Button width="100%" isLoading loadingText="Waiting confirmation" colorScheme="teal" variant="outline">Create strategy</Button>
                </CardFooter>

            </FormControl>
        </Card>
    )
}