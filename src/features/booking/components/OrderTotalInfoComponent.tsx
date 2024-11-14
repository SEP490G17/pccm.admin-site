import { Flex, Heading, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import ProductOrderTableComponent from './ProductOrderTableComponent';
import ServiceOrderTableComponent from './ServiceOrderTableComponent';
import { BookingDetails } from '@/app/models/booking.model';
import { useState } from 'react';
interface IProps {
  booking: BookingDetails;
}
const OrderTotalInfoComponent = observer(({ booking }: IProps) => {
  const [totalProductAmount, setTotalProductAmount] = useState(0);
  const [totalServiceAmount, setTotalServiceAmount] = useState(0);

  return (
    <Flex direction={'column'} w={'100%'} h={'100%'}>
      <Heading size={'lg'}>Order Total</Heading>
      <Flex direction={'column'} gap={8}>
        <ProductOrderTableComponent
          totalProductAmount={totalProductAmount}
          setTotalProductAmount={setTotalProductAmount}
        />
        <ServiceOrderTableComponent
          totalServiceAmount={totalServiceAmount}
          setTotalServiceAmount={setTotalServiceAmount}
          booking={booking}
        />
      </Flex>

      <Spacer />

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tiền sản phẩm: </Heading>
        <Heading size={'sm'}>
          {new Intl.NumberFormat('vi-VN').format(totalProductAmount)} VND
        </Heading>
      </Flex>

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tiền dịch vụ: </Heading>
        <Heading size={'sm'}>
          {new Intl.NumberFormat('vi-VN').format(totalServiceAmount)} VND
        </Heading>
      </Flex>

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tất cả: </Heading>
        <Heading size={'sm'}>
          {new Intl.NumberFormat('vi-VN').format(totalProductAmount + totalServiceAmount)} VND
        </Heading>
      </Flex>
    </Flex>
  );
});

export default OrderTotalInfoComponent;
