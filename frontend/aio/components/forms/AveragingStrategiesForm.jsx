// React
import { useState, useEffect } from 'react'
// Next
// Ethers
// WagmiConfig
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

export function AveragingStrategiesForm() {
    const [input, setInput] = useState("")
    const handleInputChange = (e) => setInput(e.target.value)
    const isError = input === ""

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
                                <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                                <Text>DAI</Text>
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