import { Flex } from '@chakra-ui/react'
import { Header } from '@/components/header/Header.jsx'
import { Footer } from '@/components/footer/Footer.jsx'


export function Layout({ children }) {
    return (
        <Flex direction="column" minH="100vh">
            <Header />
            <Flex grow="1">
                {children}
            </Flex>
            <Footer />
        </Flex>
    )
}