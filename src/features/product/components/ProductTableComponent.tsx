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
  Box,
  useDisclosure,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import EditProductPage from '../EditProductPage';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';
import ImportButtonAtom from '@/app/common/form/ImportButtonAtom';
import ImportProductPage from '../ImportProductPage';
import { useState } from 'react';

const ProductTableComponent = observer(() => {
  const { productStore } = useStore();
  const { productPageParams, loading, productArray, loadingInitial, deleteProduct, detailProduct } =
    productStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [modalType, setModalType] = useState<'edit' | 'import' | null>(null);

  const handleOpenEdit = async (id: number) => {
    setModalType('edit');
    await detailProduct(id, toast);
    onOpen();
  };

  const handleOpenImport = async (id: number) => {
    setModalType('import');
    await detailProduct(id, toast);
    onOpen();
  };
  const handleDelete = async (id: number) => {
    deleteProduct(id, toast);
  };

  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'15rem'}>Ảnh hàng hoá</Th>
              <Th w={'15rem'}>Tên hàng hoá</Th>
              <Th w={'15rem'}>Thể loại</Th>
              <Th w={'15rem'}>Cụm sân</Th>
              <Th w={'10rem'}>Số lượng</Th>
              <Th w={'15rem'}>Giá bán</Th>
              <Th w={'15rem'}>Giá nhập</Th>
              {/* <Th >
                Mô tả
              </Th> */}
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial ||
              (loading && (
                <SkeletonTableAtoms numOfColumn={8} pageSize={productPageParams.pageSize} />
              ))}

            {!loadingInitial &&
              productArray.map((product, index) => (
                <Tr key={product.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <LazyImageAtom
                      src={product.thumbnailUrl}
                      alt={product.productName}
                      width="10rem"
                      height={"6rem"}
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
                    {product.importFee.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Td>
                  <Td>
                    <Flex gap="3">
                      <ImportButtonAtom
                        onImport={async () => {
                          await handleOpenImport(product.id);
                        }}
                      />
                      <EditButtonAtom
                        onUpdate={async () => {
                          await handleOpenEdit(product.id);
                        }}
                      />
                      <DeleteButtonAtom
                        buttonSize={'sm'}
                        name={product.productName}
                        header="Xóa sản phẩm"
                        loading={loading}
                        buttonClassName={'gap-2'}
                        onDelete={async () => {
                          await handleDelete(product.id);
                        }}
                      />
                    </Flex>
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
      {modalType === 'edit' && (
        <EditProductPage isOpen={isOpen} onClose={onClose} />
      )}
      {modalType === 'import' && (
        <ImportProductPage isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
});

export default ProductTableComponent;
