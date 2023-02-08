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


export function AverageTasksTable() {
    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Defined dollar cost averaging strategies</TableCaption>
                <Thead>
                    <Tr key="tokenAddress">
                        <Th>Status</Th>{/* <Th>isActive</Th> */}
                        <Th>Token</Th>{/* <Th>tokenName</Th> */}
                        <Th isNumeric>DCA amount</Th>{/* <Th>amount</Th> */}
                        <Th isNumeric>DCA interval</Th>{/* <Th>frequency</Th> */}
                        <Th isNumeric>Current price</Th>
                        <Th isNumeric>Avg. price</Th>
                        <Th isNumeric>Diff</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr key="tokenAddress">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                    <Tr key="tokenAddress">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                    <Tr key="tokenAddress">
                        <Td>Active</Td>
                        <Td>ETH</Td>
                        <Td isNumeric>10 $</Td>
                        <Td isNumeric>1 week</Td>
                        <Td isNumeric>1600 $</Td>
                        <Td isNumeric>1300 $</Td>
                        <Td isNumeric>10 %</Td>
                    </Tr>
                </Tbody>
            </Table>
            </TableContainer>
    )
}