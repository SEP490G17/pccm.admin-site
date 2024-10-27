import { Box, Flex, FormControl, Text } from '@chakra-ui/react'

const HeaderStatistic = () => {
    return (
        <FormControl>
            <Flex alignItems="center" gap={5} padding={4} borderRadius="md">
                <Flex gap={4} width="100%" justifyContent="space-around">
                    <Box
                        width="15rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius="md"
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="white"
                    >
                        <Text fontWeight="bold" fontSize="larger" color="gray.700">SỐ CỤM SÂN</Text>
                        <Text fontSize="xl" fontWeight="bold" color="blue.500">5</Text>
                    </Box>

                    <Box
                        width="15rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius="md"
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="white"
                    >
                        <Text fontWeight="bold" fontSize="larger" color="gray.700">SỐ SÂN</Text>
                        <Text fontSize="xl" fontWeight="bold" color="red.500">50</Text>
                    </Box>

                    <Box
                        width="15rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius="md"
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="white"
                    >
                        <Text fontWeight="bold" fontSize="larger" color="gray.700">SỐ NGƯỜI DÙNG</Text>
                        <Text fontSize="xl" fontWeight="bold" color="green.500">20</Text>
                    </Box>

                    <Box
                        width="15rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius="md"
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="white"
                    >
                        <Text fontWeight="bold" fontSize="larger" color="gray.700">SỐ STAFF</Text>
                        <Text fontSize="xl" fontWeight="bold" color="purple.500">5</Text>
                    </Box>
                </Flex>
            </Flex>
        </FormControl>
    )
}

export default HeaderStatistic