import { BookingForList, BookingStatus } from '@/app/models/booking.model';
import { PaymentStatus } from '@/app/models/payment.model';
import { Button, Flex, Tag, TagLabel, TagLeftIcon, useToast } from '@chakra-ui/react';
import { FC, useState } from 'react';
import PaymentButtonAtom from './PaymentButtonAtom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import { convertBookingStartAndEndUTCToG7 } from '@/app/helper/utils';
import ModalAcceptButton from '@/features/booking/popups/accept-booking-conflict/ModalAcceptButton';
import ModalDenyButton from '@/features/booking/popups/ModalDenyButton';

interface BookingButtonAtomProps {
  booking: BookingForList;
}

const BookingButtonAtom: FC<BookingButtonAtomProps> = observer(({ booking }) => {
  const { bookingClusterStore, bookingStore } = useStore();
  const { acceptedBooking, completeBooking, cancelBooking } = bookingClusterStore;
  const toast = useToast();
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);

  const onAcceptOpen = () => setIsAcceptModalOpen(true);
  const onAcceptClose = () => setIsAcceptModalOpen(false);

  const onDenyOpen = () => setIsDenyModalOpen(true);
  const onDenyClose = () => setIsDenyModalOpen(false);

  const handleAccepted = async () => {
    await acceptedBooking(booking.id, toast).then((data) => {
      if (data.res) {
        bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
      }
    });
  };

  const handleCompleted = async () => {
    await completeBooking(booking.id, toast).then((data) => {
      if (data.res) {
        bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
      }
    });
  };

  const handleCancelBooking = async () => {
    await cancelBooking(booking.id, toast).then((data) => {
      if (data.res) {
        bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
      }
    });
  };

  if (booking.status === BookingStatus.Confirmed) {
    return (
      <Flex gap={2}>
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Success && (
          <Button colorScheme="teal" className="w-28" onClick={handleCompleted}>
            Hoàn thành
          </Button>
        )}
        {!booking.isSuccess && booking.paymentStatus == PaymentStatus.Pending && (
          <PaymentButtonAtom bookingId={booking.id} paymentUrl={booking.paymentUrl} />
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
        <Button colorScheme="blue" className="w-28" onClick={onAcceptOpen}>
          Xác thực
        </Button>
        <ModalAcceptButton booking={booking} isOpen={isAcceptModalOpen} onClose={onAcceptClose} />

        <Button colorScheme="red" className="w-28" onClick={onDenyOpen}>
          Từ chối
        </Button>
        <ModalDenyButton booking={booking} isOpen={isDenyModalOpen} onClose={onDenyClose} />
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
  if (booking.status === BookingStatus.Declined) {
    return (
      <>
        <Button colorScheme="blue" className="w-28" onClick={handleAccepted}>
          Xác thực lại
        </Button>
        <Tag
          size={'lg'}
          className="w-28 h-10 items-center flex justify-center"
          variant="subtle"
          colorScheme="red"
          gap={2}
        >
          <TagLabel>Đã từ chối</TagLabel>
          <TagLeftIcon boxSize="12px" as={CloseIcon} color={'red.800'} />
        </Tag>
      </>
    );
  }
});

export default BookingButtonAtom;
