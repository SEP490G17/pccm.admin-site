import {
  getPaymentStatusColor,
  getPaymentStatusText,
  PaymentStatus,
  PaymentType,
} from '@/app/models/payment.model';
import { useStore } from '@/app/stores/store';
import {
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
import OrderDetailsPopUp from '../../popups/OrderDetailsPopup';

import dayjs from 'dayjs';
import OrderCancelButtonComponent from './OrderCancelButtonAtoms';
import { CloseIcon } from '@chakra-ui/icons';
import OrderPaymentButtonAtoms from './OrderPaymentButtonAtoms';

const OrdersOfBookingComponent = observer(() => {
  const { paymentStore, bookingStore } = useStore();
  const toast = useToast();
  const { selectedBooking } = bookingStore;
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
      {bookingStore.orderOfBooking.map((order, index) => (
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
              {order.paymentStatus == PaymentStatus.Pending && (
                <>
                  <OrderPaymentButtonAtoms orderId={order.id}/>
                  <OrderCancelButtonComponent id={order.id} />
                </>
              )}
              {order.paymentStatus == PaymentStatus.Success && (
                <>
                  <Button
                    colorScheme="blue"
                    className="w-28"
                    onClick={async () => {
                      await handleOpenDetaisOrder(order.id);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    colorScheme="red"
                    className="w-28"
                    onClick={() => {
                      bookingStore.exportBillOrder(order.id);
                    }}
                  >
                    In hoá đơn
                  </Button>
                </>
              )}
              {order.paymentStatus === PaymentStatus.Cancel && (
                <Tag
                  size={'lg'}
                  className="w-1/2 h-10 items-center flex justify-center"
                  variant="subtle"
                  colorScheme="red"
                  gap={2}
                >
                  <TagLabel>Đã bị huỷ</TagLabel>
                  <TagLeftIcon boxSize="12px" as={CloseIcon} color={'red.800'} />
                </Tag>
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