import { BookingForList, BookingStatus } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import { Button, Flex, Tag, TagLabel, TagLeftIcon, useToast } from '@chakra-ui/react';
import { FC } from 'react';
import PaymentButtonAtom from './PaymentButtonAtom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';

interface BookingButtonAtomProps {
  booking: BookingForList;
}

const BookingButtonAtom: FC<BookingButtonAtomProps> = observer(({ booking }) => {
  const { bookingClusterStore } = useStore();
  const { acceptedBooking, completeBooking, denyBooking, cancelBooking } = bookingClusterStore;
  const toast = useToast();
  const handleAccepted = async () => {
    await acceptedBooking(booking.id, toast);
  };

  const handleCompleted = async () => {
    await completeBooking(booking.id, toast);
  }

  const handleDenyBooking = async () => {
    await denyBooking(booking.id, toast);
  }

  const handleCancelBooking = async () => {
    await cancelBooking(booking.id, toast);
  }



  if (booking.status === BookingStatus.Confirmed) {
    return (
      <Flex gap={2}>
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Success && (
          <Button colorScheme="teal" className="w-28" onClick={handleCompleted}>
            Hoàn thành
          </Button>
        )}
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Pending && (
          <PaymentButtonAtom
            bookingId={booking.id}
            paymentUrl={booking.paymentUrl}
          />
        )}
        {!booking.isSuccess && (
          <Button colorScheme="red" className="w-28" onClick={handleCancelBooking}>
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
        <Button colorScheme="blue" className="w-28"
         onClick={handleAccepted}
        >
          Xác thực
        </Button>
        <Button colorScheme="red" className="w-28" onClick={handleDenyBooking}>
          Từ chối
        </Button>
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
});

export default BookingButtonAtom;
