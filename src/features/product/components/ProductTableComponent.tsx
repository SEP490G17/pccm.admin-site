import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Box,
  Image,
  Center,
} from '@chakra-ui/react';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';

const ProductTableComponent = () => {
  const { productStore } = useStore();
  const { productPageParams, loading, productArray, loadingInitial } = productStore;

  return (
    <>
      <TableContainer
        bg={'white'}
        borderRadius={'8px'}
        padding={0}
        border={'1px solid #000'}
        mb="1.5rem"
      >
        <Table variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ảnh sản phẩm
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tên sản phẩm
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Thể loại
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Cụm sân
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Số lượng
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Giá cả
              </Th>
              {/* <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Mô tả
              </Th> */}
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={7} pageSize={productPageParams.pageSize} />
            )}

            {!loadingInitial &&
              productArray.map((product, index) => (
                <Tr key={product.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Image
                      src={product.thumbnailUrl}
                      alt={product.productName}
                      width="120px"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {product.productName}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {product.categoryName}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {product.courtClusterName}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {product.quantity}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>

                  <Td borderBottom={'0.923px solid #BDBDBD'}>
                    <Center>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        colorScheme="teal"
                        size="sm"
                        mr={2}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete"
                        colorScheme="red"
                        size="sm"
                      />
                    </Center>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {productArray.length === 0 && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}
    </>
  );
};

export default observer(ProductTableComponent);
