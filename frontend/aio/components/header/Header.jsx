import { Button, Flex, Heading } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';


export const Header = () => {
    return (
        <Flex h="15vh" p="2rem" justifyContent="space-between" alignItems="center">
            <Heading>AIO</Heading>
            <ConnectButton/>
        </Flex>
    )
};