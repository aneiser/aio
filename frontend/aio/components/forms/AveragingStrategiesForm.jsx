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


export function AveragingStrategiesForm() {
    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const MOCK_DAI_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


    // // States for...
    // // -----------------------------------------------------------------------------------------------------------------
    // // ...the mockDAI balance
    const [mockDaiBalance, setMockDaiBalance] = useState("?")


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


    // Variables
    // -----------------------------------------------------------------------------------------------------------------


    // `useEffect`s
    // -------------------------------------------------------------------------------------------------------------------
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