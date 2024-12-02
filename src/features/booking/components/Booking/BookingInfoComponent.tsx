import {
  BookingStatus,
  getBookingStatusColor,
  getBookingStatusText,
} from '@/app/models/booking.model';
import { Badge, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import {
  getPaymentStatusColor,
  getPaymentStatusText,
  PaymentStatus,
} from '@/app/models/payment.model';
import OrdersOfBookingComponent from '../Order/OrdersOfBookingComponent';
import BookingButtonAtom from '@/features/court-cluster/atoms/BookingButtonAtom';
import OrderCreatePopup from '../../popups/OrderCreatePopup';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import _ from 'lodash';
import { Link } from 'react-router-dom';
const BookingInfoComponent = observer(() => {
  const { bookingStore } = useStore();
  const { selectedBooking: booking, orderOfBooking } = bookingStore;
  if (!booking) {
    return;
  }
  const { bookingDetails } = booking;
  const lastPayment =
    bookingDetails.totalPrice +
    (_.sumBy(
      orderOfBooking.filter((o) => o.paymentStatus == PaymentStatus.Pending),
      'totalAmount',
    ) ?? 0);
  const alreadyPay =
    bookingDetails.paymentStatus == PaymentStatus.Success
      ? bookingDetails.totalPrice
      : 0 +
        _.sumBy(
          booking.ordersOfBooking.filter((c) => c.paymentStatus == PaymentStatus.Success),
          'totalAmount',
        );
  return (
    <Grid templateColumns={'repeat(24, 1fr)'} className="min-h-[30rem]" gap={2}>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Họ và tên:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {bookingDetails.fullName}
        </Text>
      </GridItem>

      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Số điện thoại:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {bookingDetails.phoneNumber}
        </Text>
      </GridItem>

      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Giờ thuê:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {bookingDetails.playTime}
        </Text>
      </GridItem>

      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Ngày bắt đầu:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          Ngày {dayjs(bookingDetails.startDay).add(7, 'hour').format('DD/MM/YYYY')}
        </Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Ngày kết thúc:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          Ngày {dayjs(bookingDetails.endDay).add(7, 'hour').format('DD/MM/YYYY')}
        </Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Trạng thái:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Text fontSize={'xl'} fontWeight={'thin'}>
          <Badge colorScheme={`${getBookingStatusColor(bookingDetails.status)}`} fontSize={'1rem'}>
            {getBookingStatusText(bookingDetails.status)}
          </Badge>
        </Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Thuê tại:</Text>
      </GridItem>

      <GridItem colSpan={21} className="text-start">
        <Link className="cursor-pointer" to={`/cum-san/${bookingDetails.courtClusterId}/chi-tiet`}>
          <Text fontSize={'xl'} fontWeight={'thin'}>
            {bookingDetails.address}
          </Text>
        </Link>
      </GridItem>
      {bookingDetails.status === BookingStatus.Confirmed && (
        <>
          <GridItem colSpan={3}>
            <Text fontSize={'xl'}>Thanh toán:</Text>
          </GridItem>

          <GridItem colSpan={21} className="text-start">
            <Text fontSize={'xl'} fontWeight={'thin'}>
              <Badge
                colorScheme={`${getPaymentStatusColor(bookingDetails.paymentStatus)}`}
                fontSize={'1rem'}
              >
                {getPaymentStatusText(bookingDetails.paymentStatus)}
              </Badge>
            </Text>
          </GridItem>
        </>
      )}
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Giá tiền:</Text>
      </GridItem>
      <GridItem colSpan={21}>
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {bookingDetails.totalPrice.toLocaleString('vn')} VND
        </Text>
      </GridItem>

      <GridItem colSpan={3} className="mt-5">
        <Text fontSize={'xl'}>Danh sách Order: </Text>
      </GridItem>
      <GridItem colSpan={21} className="mt-5">
        {!booking.bookingDetails.isSuccess &&
          booking.bookingDetails.status === BookingStatus.Confirmed && (
            <OrderCreatePopup booking={booking} />
          )}
      </GridItem>
      <GridItem colSpan={24}>
        <OrdersOfBookingComponent />
      </GridItem>
      <GridItem colSpan={24} className="mt-10">
        <Text fontSize={'xl'}>Tổng kết </Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Tổng phải trả: </Text>
      </GridItem>

      <GridItem colSpan={21}>
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {lastPayment.toLocaleString('vn')} VND
        </Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Đã trả: </Text>
      </GridItem>

      <GridItem colSpan={21}>
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {alreadyPay.toLocaleString('vn')} VND
        </Text>
      </GridItem>
      <GridItem colSpan={24}>
        <hr />
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={'xl'}>Còn lại: </Text>
      </GridItem>

      <GridItem colSpan={21}>
        <Text fontSize={'xl'} fontWeight={'thin'}>
          {(lastPayment - alreadyPay).toLocaleString('vn')} VND
        </Text>
      </GridItem>

      <GridItem colSpan={24} className="mt-10">
        <Flex className="float-end">
          <BookingButtonAtom isDetails={true} booking={bookingDetails} />
        </Flex>
      </GridItem>
    </Grid>
  );
});

export default BookingInfoComponent;
