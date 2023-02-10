import { Flex, Text } from '@chakra-ui/react'

export const Footer = () => {
    return (
        <Flex p="1rem" justifyContent="center">
            <Text fontSize='xs'>Made by Adrian Neila Serrano &copy; in Paris {new Date().getFullYear()}</Text>
        </Flex>
    )
};