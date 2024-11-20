import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import dayjs from 'dayjs';
import {
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    Tag,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';

const ProductLogTableComponent = observer(() => {
    const { productStore } = useStore();
    const { productLogPageParams, loading, productLogArray, loadingInitial } = productStore;

    const getLogTypeDisplayName = (logType: string) => {
        switch (logType) {
            case "Update":
                return <Tag colorScheme="blue">Cập nhật hàng</Tag>;
            case "Create":
                return <Tag colorScheme="green">Nhập hàng</Tag>;
            case "Order":
                return <Tag colorScheme="yellow">Đặt hàng</Tag>;
            case "Delete":
                return <Tag colorScheme="red">Xóa hàng</Tag>;
        }
    };

    return (
        <>
            <TableContainer
                bg={'white'}
                borderRadius={'md'}
                padding={0}
                mb="1.5rem"
            >
                <Table className='app-table' variant="simple" padding={0}>
                    <Thead>
                        <Tr>
                            <Th w={'5rem'} py={'1rem'}>STT</Th>
                            <Th w={'10rem'}>Ảnh hàng hoá</Th>
                            <Th w={'15rem'}>Tên hàng hoá</Th>
                            <Th w={'15rem'}>Cụm sân</Th>
                            <Th w={'5rem'}>Số lượng</Th>
                            <Th w={'15rem'}>Giá</Th>
                            <Th w={'20rem'}>Loại log</Th>
                            <Th w={'40rem'}>Mô tả</Th>
                            <Th w={'13rem'}>Ngày log</Th>
                            <Th w={'13rem'}>Người log</Th>
                            {/* <Th >
                Mô tả
              </Th> */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loadingInitial && (
                            <SkeletonTableAtoms numOfColumn={9} pageSize={productLogPageParams.pageSize} />
                        )}

                        {!loadingInitial &&
                            productLogArray.map((product, index) => (
                                <Tr key={product.id}>
                                    <Td>{index + 1}</Td>
                                    <Td>
                                        <LazyImageAtom
                                            src={product.thumbnailUrl}
                                            alt={product.productName}
                                            width="10rem"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                    </Td>
                                    <Td>{product.productName}</Td>
                                    <Td>{product.courtClusterName}</Td>
                                    <Td>{product.quantity}</Td>
                                    <Td>
                                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </Td>
                                    <Td>
                                        {getLogTypeDisplayName(product.logType)}
                                    </Td>
                                    <Td>
                                        <Box whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                                            {product.description}
                                        </Box>
                                    </Td>
                                    <Td>
                                        {dayjs(product.createAt).format('DD/MM/YYYY')}
                                    </Td>
                                    <Td>
                                        <Box whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                                            {product.createBy}
                                        </Box>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {productLogArray.length === 0 && !loading && (
                <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
                    Danh sách rỗng
                </Box>
            )}
        </>
    );
});

export default ProductLogTableComponent;
