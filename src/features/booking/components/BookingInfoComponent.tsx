import {
  BookingDetails,
  BookingStatus,
  getBookingStatusColor,
  getBookingStatusText,
} from '@/app/models/booking.model';
import {
  Badge,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import dayjs from 'dayjs';
import { getPaymentStatusColor, getPaymentStatusText } from '@/app/models/payment.model';
import OrdersOfBookingComponent from './OrdersOfBookingComponent';
import BookingButtonAtom from '@/features/court-cluster/atoms/BookingButtonAtom';
import OrderDetailsPopup from '../popups/OrderDetailsPopup';
import { observer } from 'mobx-react';
interface BookingInfoComponentProps {
  booking: BookingDetails;
}

const BookingInfoComponent: FC<BookingInfoComponentProps> = observer(({ booking }) => {
  const { bookingDetails, ordersOfBooking } = booking;

  return (
    <>
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
            <Badge
              colorScheme={`${getBookingStatusColor(bookingDetails.status)}`}
              fontSize={'1rem'}
            >
              {getBookingStatusText(bookingDetails.status)}
            </Badge>
          </Text>
        </GridItem>
        <GridItem colSpan={3}>
          <Text fontSize={'xl'}>Thuê tại:</Text>
        </GridItem>

        <GridItem colSpan={21} className="text-start">
          <Text fontSize={'xl'} fontWeight={'thin'}>
            Ngày {dayjs(bookingDetails.endDay).add(7, 'hour').format('DD/MM/YYYY')}
          </Text>
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
          <Text fontSize={'xl'}>Danh sách Order: </Text>
        </GridItem>
       
        <GridItem colSpan={24}>
          <OrdersOfBookingComponent orders={ordersOfBooking} />
        </GridItem>
        <GridItem colSpan={24} className='mt-10'>
          <OrderDetailsPopup booking={booking} />
        </GridItem>
        <GridItem colSpan={24} className="mt-10">
          <Flex className="float-end">
            <BookingButtonAtom booking={bookingDetails} />
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
});

export default BookingInfoComponent;
