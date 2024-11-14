import { calculateTimeDifferenceInHours } from '@/app/helper/utils';
import { BookingDetails } from '@/app/models/booking.model';
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
    booking:BookingDetails;
    totalServiceAmount:number;
    setTotalServiceAmount: (amount: number) => any;
}
const ServiceOrderTableComponent = observer(({booking, setTotalServiceAmount}:IProps) => {
  const { orderStore, courtClusterStore } = useStore();
  const { servicesOfClusterRegistry } = courtClusterStore;
  const { ServiceItemIdArray, removeServiceFromOrder } = orderStore;
  const [startTime, endTime] = booking.bookingDetails.playTime.split('-');
  const playHours = calculateTimeDifferenceInHours(startTime, endTime);
  let sum = 0;
  return (
    <>
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
            {ServiceItemIdArray.map((serviceItemId) => {
              const service = servicesOfClusterRegistry.get(serviceItemId);

              if (service) {
                const total = service.price * playHours;
                sum += total;
                setTotalServiceAmount(sum);
                return (
                  <Tr key={service.id}>
                    <Td>{service.serviceName}</Td>
                    <Td>{playHours}</Td>
                    <Td>{new Intl.NumberFormat('vi-VN').format(service.price)} VND</Td>
                    <Td>{new Intl.NumberFormat('vi-VN').format(total)} VND</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            removeServiceFromOrder(serviceItemId);
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

export default ServiceOrderTableComponent;
