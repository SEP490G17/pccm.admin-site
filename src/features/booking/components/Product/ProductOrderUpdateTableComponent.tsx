import { PaymentStatus } from '@/app/models/payment.model';
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
import { observer } from 'mobx-react-lite';
const ProductOrderUpdateTableComponent = observer(() => {
  const { bookingStore } = useStore();
  const {
    minusProductToOrderUpdate,
    removeProductFromOrderUpdate,
    selectedOrder,
    orderOfBooking,
    ProductUpdateArray,
  } = bookingStore;
  const checkIsPaymentSuccess = () => {
    return (
      selectedOrder?.id &&
      orderOfBooking.find((o) => o.id == selectedOrder.id)?.paymentStatus === PaymentStatus.Success
    );
  };

  const handleMinusProductToOrder = (id: number) => {
    if (!checkIsPaymentSuccess()) {
      minusProductToOrderUpdate(id);
    }
  };

  const handleremoveProductFromOrder = (id: number) => {
    if (!checkIsPaymentSuccess()) {
      removeProductFromOrderUpdate(id);
    }
  };

  return (
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
          {ProductUpdateArray.map((product) => {
            return (
              <Tr key={product.productId}>
                <Td>{product.productName}</Td>
                <Td>{product.quantity}</Td>
                <Td>
                  {new Intl.NumberFormat('vi-VN').format(
                    selectedOrder?.paymentStatus == PaymentStatus.Pending
                      ? product.currPrice
                      : product.price,
                  )}{' '}
                  VND
                </Td>
                <Td>
                  {new Intl.NumberFormat('vi-VN').format(
                    selectedOrder?.paymentStatus == PaymentStatus.Pending
                      ? product.currPrice * product.quantity
                      : product.price * product.quantity,
                  )}{' '}
                  VND
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      colorScheme="red"
                      onClick={() => handleMinusProductToOrder(product.productId)}
                    >
                      Giảm
                    </Button>
                    <Button
                      colorScheme="gray"
                      onClick={() => {
                        handleremoveProductFromOrder(product.productId);
                      }}
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

export default ProductOrderUpdateTableComponent;
