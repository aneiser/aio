import { Flex, Text } from '@chakra-ui/react'

export const Footer = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="center">
            <Text>Made by Adrián Neila Serrano &copy; in Paris {new Date().getFullYear()}</Text>
        </Flex>
    )
};