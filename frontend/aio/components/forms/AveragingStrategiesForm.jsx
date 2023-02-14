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
// Component & Dapp
import MockDaiTokenContract from 'public/MockDaiToken.json'
// Openocean API/SDK integation
// Must be done dynamically with useEffect after Next.js pre-renders


export function AveragingStrategiesForm() {
    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const MOCK_DAI_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const SUPPORTED_TOKENS = ["1INCH", "AAVE", "AXS", "CRV", , , , , , , , , , ,];


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the mockDAI balance
    const [mockDaiBalance, setMockDaiBalance] = useState("?")
    const [availableTokens, setAvailableTokens] = useState(null)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // // ...accessing Client's ethers Provider.
    const provider = useProvider()


    // RainbowKit
    // -----------------------------------------------------------------------------------------------------------------
    // ...RainbowKit A
    // ...RainbowKit B


    // ChakraProvider
    // -----------------------------------------------------------------------------------------------------------------
    const [input, setInput] = useState("")
    const handleInputChange = (e) => setInput(e.target.value)
    const isError = input === ""


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

            // Gets all the available tokens we have on Goerli
            const getAvailableTokens = async () => {
                api.getTokenList({
                    chain: 'eth',
                }).then((data) => {
                    const filteredArray = data.data.filter(token => SUPPORTED_TOKENS.includes(token.symbol));
                    console.log(filteredArray)
                    setAvailableTokens(filteredArray)
                }).catch((error) => {
                    console.error(error)
                    return
                });
            }

            getAvailableTokens()
        }

        initOpenocean()
    }, [])

    // Calls 'getEvents()' whenever the users:
    // - connect their wallet to the Dapp (isConnected)
    // - change the account in their wallet (address)
    useEffect(() => {
        if (isConnected) {
            getMockDaiBalance()
        }
    }, [isConnected, address])

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
        <Card maxW="xs">
            <FormControl>

                <CardHeader align="center" pb="0">
                    <Heading as="h4" size="md">Averaging strategy</Heading>
                </CardHeader>

                <CardBody>
                    <VStack spacing="1.5rem" align="stretch">
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Source token</FormLabel>
                            <HStack spacing="24px">
                                <Avatar name="mock DAI" bg='yellow.500'/>
                                <Text>mock DAI {mockDaiBalance}</Text>
                            </HStack>
                        </VStack>
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Token to average</FormLabel>
                            <HStack spacing="24px">
                                <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                                <Input type="email" value={input} onChange={handleInputChange} />
                            </HStack>
                            {!isError ? (
                                <FormHelperText>Enter the token you would like to average.</FormHelperText>
                            ) : (
                                <FormErrorMessage>Token is required.</FormErrorMessage>
                            )}
                        </VStack>
                        <VStack spacing="0rem" align="stretch">
                            <FormLabel>Averaging amount</FormLabel>
                            <NumberInput min={1} max={1000000}>
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
                        <HStack spacing="1rem" align="stretch">
                            <Switch id="initial-status" />
                            <FormLabel htmlFor="initial-status">Initialy {true ? `active` : `inactive`}</FormLabel>
                        </HStack>
                    </VStack>
                </CardBody>

                <CardFooter>
                    <Button width="100%" isLoading loadingText="Waiting confirmation" colorScheme="teal" variant="outline">Create strategy</Button>
                </CardFooter>

            </FormControl>
        </Card>
    )
}