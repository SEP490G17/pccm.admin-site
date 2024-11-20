import { useStore } from '@/app/stores/store';
import { Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import BookingGridTableComponent from './BookingGridTableComponent';

const BookingCancelComponent = observer(() => {
  const { bookingClusterStore } = useStore();
  const { bookingCancelArray, loadBookingCancel, loadingBookingCancel } = bookingClusterStore;
  const toast = useToast();
  useEffect(() => {
    loadBookingCancel(toast);
  }, []);
  return (
    <Skeleton isLoaded={!loadingBookingCancel} h={'30rem'}>
      <BookingGridTableComponent bookingArray={bookingCancelArray} />
    </Skeleton>
  );
});

export default BookingCancelComponent;
