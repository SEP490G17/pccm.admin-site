import { calculateTimeDifferenceInHours } from '@/app/helper/utils';
import { BookingDetails } from '@/app/models/booking.model';
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
interface IProps {
  booking: BookingDetails;
}
const ServiceOrderUpdateTableComponent = observer(({ booking }: IProps) => {
  const { bookingStore } = useStore();
  const { ServiceUpdateArray, removeServiceFromOrderUpdate, selectedOrder } = bookingStore;
  const [startTime, endTime] = booking.bookingDetails.playTime.split('-');
  const playHours = calculateTimeDifferenceInHours(startTime, endTime);
  return (
    <TableContainer className="mt-8">
      <Heading size={'sm'}>Danh sách dịch vụ</Heading>
      <Table className="mt-4">
        <Thead>
          <Tr>
            <Th>Tên sản phẩm</Th>
            <Th>Số giờ thuê</Th>
            <Th>Giá</Th>
            <Th>Thành tiền</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ServiceUpdateArray.map((service) => {
            const total =
              selectedOrder?.paymentStatus == PaymentStatus.Pending
                ? service.currPrice * playHours
                : service.price * playHours;
            return (
              <Tr key={service.serviceId}>
                <Td>{service.serviceName}</Td>
                <Td>{playHours}</Td>
                <Td>
                  {new Intl.NumberFormat('vi-VN').format(
                    selectedOrder?.paymentStatus == PaymentStatus.Pending
                      ? service.currPrice
                      : service.price,
                  )}{' '}
                  VND
                </Td>
                <Td>{new Intl.NumberFormat('vi-VN').format(total)} VND</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        removeServiceFromOrderUpdate(service.serviceId);
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

export default ServiceOrderUpdateTableComponent;
