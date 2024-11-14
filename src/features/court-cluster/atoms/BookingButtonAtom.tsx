import { BookingForList, BookingStatus } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import { Button, Flex, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { FC } from 'react';
import PaymentButtonAtom from './PaymentButtonAtom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface BookingButtonAtomProps {
  booking: BookingForList;
}

const BookingButtonAtom: FC<BookingButtonAtomProps> = ({ booking }) => {
  if (booking.status === BookingStatus.Confirmed) {
    return (
      <Flex gap={2}>
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Success && (
          <Button colorScheme="teal" className="w-28">
            Hoàn thành
          </Button>
        )}
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Pending && (
          <PaymentButtonAtom
            bookingId={booking.id}
            paymentUrl={booking.paymentUrl}
            amount={booking.totalPrice}
          />
        )}
        {!booking.isSuccess && (
          <Button colorScheme="red" className="w-28">
            Huỷ lịch
          </Button>
        )}
        {booking.isSuccess && (
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
      </Flex>
    );
  }
  if (booking.status === BookingStatus.Pending) {
    return (
      <Flex className="justify-start gap-2">
        <Button colorScheme="blue" className="w-28">
          Xác thực
        </Button>
        <Button colorScheme="red" className='w-28'>Từ chối</Button>
      </Flex>
    );
  }
  if (booking.status === BookingStatus.Cancelled) {
    return (
      <Tag
        size={'lg'}
        className="w-full h-10 items-center flex justify-center"
        variant="subtle"
        colorScheme="red"
        gap={2}
      >
        <TagLabel>Đã bị huỷ</TagLabel>
        <TagLeftIcon boxSize="12px" as={CloseIcon} color={'red.800'} />
      </Tag>
    );
  }
};

export default BookingButtonAtom;
