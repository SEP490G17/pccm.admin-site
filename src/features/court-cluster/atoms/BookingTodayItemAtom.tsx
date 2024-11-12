import { BookingForList } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import { CheckIcon } from '@chakra-ui/icons';
import { Badge, Button, Center, Grid, GridItem, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import PaymentButtonAtom from './PaymentButtonAtom';

interface BookingTodayItemAtom {
  bookingToday: BookingForList;
  index: number;
}

const BookingTodayItemAtom: FC<BookingTodayItemAtom> = ({ bookingToday, index }) => {
  const paymentStatusToString = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return 'Chờ thanh toán';
      case PaymentStatus.Success:
        return 'Đã thanh toán';
    }
  };

  const paymentStatusColorScheme = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return 'blue';
      case PaymentStatus.Success:
        return 'green';
    }
  };
  return (
    <>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/booking/chi-tiet/1'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>{index + 1}</GridItem>
              <GridItem colSpan={4}>{bookingToday.fullName}</GridItem>
              <GridItem colSpan={3}>{bookingToday.phoneNumber}</GridItem>
              <GridItem colSpan={3}>{bookingToday.playTime}</GridItem>
              <GridItem colSpan={4}>Ngày {bookingToday.startDay}</GridItem>
              <GridItem colSpan={4}>Ngày {bookingToday.endDay}</GridItem>
              <GridItem colSpan={3}>
                <Badge
                  fontSize="0.8em"
                  colorScheme={paymentStatusColorScheme(bookingToday.paymentStatus)}
                >
                  {paymentStatusToString(bookingToday.paymentStatus)}
                </Badge>
              </GridItem>

              <GridItem colSpan={2} className="flex items-center ">
                {new Intl.NumberFormat('vi-VN').format(bookingToday.totalPrice)} VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="flex justify-end">
          <Center gap={2}>
            {!bookingToday.isSuccess && bookingToday.paymentStatus == PaymentStatus.Success && (
              <Button colorScheme="teal">Hoàn thành</Button>
            )}
            {!bookingToday.isSuccess && bookingToday.paymentStatus == PaymentStatus.Pending && (
              <PaymentButtonAtom bookingId={bookingToday.id} paymentUrl={bookingToday.paymentUrl} />
            )}
            {!bookingToday.isSuccess && <Button colorScheme="red">Huỷ lịch</Button>}
            {bookingToday.isSuccess && (
              <Tag
                size={'lg'}
                className="w-full h-10 items-center flex justify-center"
                variant="subtle"
                colorScheme="green"
                gap={2}
              >
                <TagLabel>Đã hoàn thành</TagLabel>
                <TagLeftIcon boxSize="12px" as={CheckIcon} color={'green.800'} />
              </Tag>
            )}
          </Center>
        </GridItem>
      </Grid>
    </>
  );
};

export default BookingTodayItemAtom;
