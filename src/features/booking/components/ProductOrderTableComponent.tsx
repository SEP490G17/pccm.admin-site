import { useStore } from '@/app/stores/store';
import {
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
interface IProps{
  totalProductAmount: number;
  setTotalProductAmount: (amount: number) => any;
}
const ProductOrderTableComponent = observer(({setTotalProductAmount}:IProps) => {
  const { orderStore, courtClusterStore } = useStore();
  const { productOfClusterRegistry } = courtClusterStore;
  const { ProductItemIdArray, selectedProductItems, minusProductToOrder, removeProductFromOrder } =
    orderStore;
  let sum = 0;
  return (
    <>
      <TableContainer className="mt-8">
        <Heading size={'sm'}>Danh sách hàng hoá</Heading>
        <Table className="mt-4">
          <Thead>
            <Tr>
              <Th>Tên sản phẩm</Th>
              <Th>Số lượng</Th>
              <Th>Giá</Th>
              <Th>Thành tiền</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ProductItemIdArray.map((productItemId) => {
              const product = productOfClusterRegistry.get(productItemId);

              if (product) {
                const total = product.price * (selectedProductItems.get(productItemId) ?? 0);
                sum += total;
                setTotalProductAmount(sum);
                return (
                  <Tr key={product.id}>
                    <Td>{product.productName}</Td>
                    <Td>{selectedProductItems.get(productItemId)}</Td>
                    <Td>{new Intl.NumberFormat('vi-VN').format(product.price)} VND</Td>
                    <Td>{new Intl.NumberFormat('vi-VN').format(total)} VND</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          colorScheme="red"
                          onClick={() => minusProductToOrder(productItemId)}
                        >
                          Giảm
                        </Button>
                        <Button
                          colorScheme="gray"
                          onClick={() => {
                            removeProductFromOrder(productItemId);
                          }}
                        >
                          Huỷ
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              }
            })}
          </Tbody>
        </Table>
      </TableContainer>
    
    </>
  );
});

export default ProductOrderTableComponent;
