import {
  getPaymentStatusColor,
  getPaymentStatusText,
  PaymentStatus,
  PaymentType,
} from '@/app/models/payment.model';
import { useStore } from '@/app/stores/store';
import { Badge, Button, Flex, Grid, GridItem, useDisclosure, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import OrderDetailsPopUp from '../popups/OrderDetailsPopup';

import dayjs from 'dayjs';

const OrdersOfBookingComponent = observer(() => {
  const { paymentStore, bookingStore } = useStore();
  const toast = useToast();
  const { selectedBooking, orderOfBooking } = bookingStore;
  if (!selectedBooking) return;
  const handlePayment = async (orderId: number) => {
    await paymentStore.getPayment(PaymentType.Order, orderId, toast).then((data) => {
      if (data.res) {
        window.open(data.res, '_blank');
      }
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenDetaisOrder = async (id: number) => {
    onOpen();
    await bookingStore.getDetailsOrder(id, toast);
  };
  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" className="p-4 border-b-2">
        <GridItem colSpan={2}>STT</GridItem>
        <GridItem colSpan={3}>Ngày tạo</GridItem>
        <GridItem colSpan={2}>Trạng thái</GridItem>
        <GridItem colSpan={2}>Tổng giá</GridItem>
        <GridItem colSpan={3}>Hành động</GridItem>
      </Grid>
      {orderOfBooking.map((order, index) => (
        <Grid key={order.id} templateColumns="repeat(12, 1fr)" className="p-4 border-b-[1px] ">
          <GridItem
            colSpan={9}
            className="cursor-pointer"
            onClick={async () => {
              await handleOpenDetaisOrder(order.id);
            }}
          >
            <Grid templateColumns={'repeat(9,1fr)'}>
              <GridItem colSpan={2}>{index + 1}</GridItem>
              <GridItem colSpan={3}>Ngày {dayjs(order.createdAt).format('DD/MM/YYYY')}</GridItem>
              <GridItem colSpan={2}>
                <Badge colorScheme={`${getPaymentStatusColor(order.paymentStatus)}`}>
                  {getPaymentStatusText(order.paymentStatus)}
                </Badge>
              </GridItem>
              <GridItem colSpan={2}>
                {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={3}>
            <Flex gap={4}>
              {(order.paymentStatus == PaymentStatus.Pending ||
                order.paymentStatus == PaymentStatus.Cancel ||
                order.paymentStatus == PaymentStatus.Failed) && (
                <>
                  <Button colorScheme="blue" className='w-28' onClick={async () => await handlePayment(order.id)}>
                    Thanh toán
                  </Button>
                  <Button colorScheme="red" className='w-28'>Hủy đơn</Button>
                </>
              )}
              {order.paymentStatus == PaymentStatus.Success && (
                <>
                  <Button colorScheme="blue" className='w-28' onClick={async()=>{await handleOpenDetaisOrder(order.id)}}>Xem chi tiết</Button>
                  <Button colorScheme="red" className='w-28'>In hoá đơn</Button>
                </>
              )}
            </Flex>
          </GridItem>
        </Grid>
      ))}
      <OrderDetailsPopUp isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default OrdersOfBookingComponent;
