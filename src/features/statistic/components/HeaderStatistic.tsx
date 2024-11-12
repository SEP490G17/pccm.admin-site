import { DataTotal } from '@/app/models/statistic.model'
import { Box, Flex, FormControl, Text } from '@chakra-ui/react'
import ContentSidebar from './ContentSideBar'
import './style.scss'
import { HiMiniShoppingCart } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";

interface IProps {
    data: DataTotal | undefined
}

const HeaderStatistic = ({ data }: IProps) => {
    return (
        <FormControl>
            <Flex alignItems="center" margin='20px 0'>
                <Flex width="100%" justifyContent="space-between">
                    <Box
                        width="23rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius={'10px'}
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={'#1acd81'}
                    >
                        <Flex alignItems="center" justifyContent="space-between" width="90%">
                            <Box width={'30%'}>
                                <FaUser className='icon-card' />
                            </Box>
                            <Box width={'60%'}>
                                <Text fontSize="50px" color="white" textAlign={'right'}>{data?.newUser}</Text>
                                <Text fontSize="18px" color="white" marginTop={'-15px'} textAlign={'right'}>Người dùng mới</Text>
                            </Box>
                        </Flex>

                    </Box>

                    <Box
                        width="23rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius={'10px'}
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={'#119fe6'}
                    >
                        <Flex alignItems="center" justifyContent="space-between" width="90%">
                            <Box width={'30%'}>
                                <HiMiniShoppingCart className='icon-card' />
                            </Box>
                            <Box width={'60%'}>
                                <Text fontSize="50px" color="white" textAlign={'right'}>{data?.productInMonth}</Text>
                                <Text fontSize="18px" color="white" marginTop={'-15px'} textAlign={'right'}>Hàng hóa đã bán</Text>
                            </Box>
                        </Flex>

                    </Box>

                    <Box
                        width="23rem"
                        border="1px solid #e2e8f0"
                        boxShadow="sm"
                        borderRadius={'10px'}
                        padding={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={'yellow.500'}
                    >
                        <Flex alignItems="center" justifyContent="space-between" width="90%">
                            <Box width={'30%'}>
                                <AiFillProduct className='icon-card' />
                            </Box>
                            <Box width={'60%'}>
                                <Text fontSize="50px" color="white" textAlign={'right'}>{data?.serviceInMonth}</Text>
                                <Text fontSize="18px" color="white" marginTop={'-15px'} textAlign={'right'}>Dịch vụ đã bán</Text>
                            </Box>
                        </Flex>
                    </Box>
                    <ContentSidebar data={data}></ContentSidebar>
                </Flex>
            </Flex>
        </FormControl>
    )
}

export default HeaderStatistic