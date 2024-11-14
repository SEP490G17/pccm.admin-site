import { OrderOfBooking } from '@/app/models/order.model';
import { getPaymentStatusColor, getPaymentStatusText } from '@/app/models/payment.model';
import {
  Badge,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { FC } from 'react';

interface OrdersOfBookingComponentProps {
  orders: OrderOfBooking[];
}

const OrdersOfBookingComponent: FC<OrdersOfBookingComponentProps> = observer(({ orders }) => {
  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Ngày tạo</Th>
              <Th>Trạng thái</Th>
              <Th>Tổng giá</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order, index) => (
              <Tr key={order.id}>
                <Td>{index + 1}</Td>
                <Td>{order.createdAt}</Td>
                <Td>
                  <Badge colorScheme={`${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </Td>
                <Td>{order.totalAmount} VND</Td>
                <Td>
                  <Flex gap={4}>
                    <Button colorScheme="blue">Chi tiết</Button>
                    <Button colorScheme="red">Hủy đơn</Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
});

export default OrdersOfBookingComponent;
