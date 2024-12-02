import { Flex, Heading, Spacer } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/stores/store';
import ProductOrderTableComponent from '../Product/ProductOrderTableComponent';
import ServiceOrderTableComponent from '../Service/ServiceOrderTableComponent';
import ProductOrderUpdateTableComponent from '../Product/ProductOrderUpdateTableComponent';
import ServiceOrderUpdateTableComponent from '../Service/ServiceOrderUpdateTableComponent';
interface OrderTotalInfoProps {
  isEdit?: boolean;
}
const OrderTotalInfoComponent = observer(({ isEdit }: OrderTotalInfoProps) => {
  const { bookingStore, courtClusterStore } = useStore();
  const { selectedBooking } = bookingStore;
  const { productOfClusterRegistry, servicesOfClusterRegistry } = courtClusterStore;
  if (!selectedBooking || !productOfClusterRegistry) return null; // kiểm tra null

  return (
    <Flex direction={'column'} w={'100%'} h={'100%'}>
      <Heading size={'lg'}>Order Total</Heading>
      <Flex direction={'column'} gap={8}>
        {isEdit && (
          <>
            <ProductOrderUpdateTableComponent />
            <ServiceOrderUpdateTableComponent booking={selectedBooking} />
          </>
        )}
        {!isEdit && (
          <>
            <ProductOrderTableComponent />
            <ServiceOrderTableComponent booking={selectedBooking} />
          </>
        )}
      </Flex>

      <Spacer />

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tiền sản phẩm: </Heading>
        <Heading size={'sm'}>
          {
          new Intl.NumberFormat('vi-VN').format(
            isEdit ? 
            bookingStore.getTotalProductAmountForUpdate(productOfClusterRegistry):
            bookingStore.getTotalProductAmount(productOfClusterRegistry)
          )}{' '}
          VND
        </Heading>
      </Flex>

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tiền dịch vụ: </Heading>
        <Heading size={'sm'}>
          {new Intl.NumberFormat('vi-VN').format(
            isEdit ?
            bookingStore.getTotalServiceAmountForUpdate(servicesOfClusterRegistry) :
            bookingStore.getTotalServiceAmount(servicesOfClusterRegistry),
          )}{' '}
          VND
        </Heading>
      </Flex>

      <Flex className="w-full justify-between mt-8 pr-2">
        <Heading size={'sm'}>Tổng tất cả: </Heading>
        <Heading size={'sm'}>
          {new Intl.NumberFormat('vi-VN').format(
            bookingStore.totalProductAmount + bookingStore.totalServiceAmount,
          )}{' '}
          VND
        </Heading>
      </Flex>
    </Flex>
  );
});

export default OrderTotalInfoComponent;
