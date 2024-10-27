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
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import EditProductPage from '../EditProductPage';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';

const ProductTableComponent =observer(() => {
  const { productStore } = useStore();
  const { productPageParams, loading, productArray, loadingInitial, deleteProduct, detailProduct } = productStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenEdit = async (id:number) =>{
     onOpen();
     await detailProduct(id);
  }
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
              <Th w={'15rem'}>Ảnh sản phẩm</Th>
              <Th w={'20rem'}>Tên sản phẩm</Th>
              <Th w={'15rem'}>Thể loại</Th>
              <Th w={'15rem'}>Cụm sân</Th>
              <Th w={'12rem'}>Số lượng</Th>
              <Th w={'10rem'}>Giá cả</Th>
              {/* <Th >
                Mô tả
              </Th> */}
              <Th w={'8rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={7} pageSize={productPageParams.pageSize} />
            )}

            {!loadingInitial &&
              productArray.map((product, index) => (
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
                  <Td>{product.categoryName}</Td>
                  <Td>{product.courtClusterName}</Td>
                  <Td>{product.quantity}</Td>
                  <Td>
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>

                  <Td>
                    <Center>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        colorScheme="teal"
                        size="sm"
                        mr={2}
                        onClick={async () => {
                          await handleOpenEdit(product.id);
                        }}
                      />
                      <DeleteButtonAtom name={product.productName} loading={loading} header='Xóa sản phẩm' onDelete={async () => {
                          await deleteProduct(product.id)
                      }} />
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
      <EditProductPage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ProductTableComponent;
