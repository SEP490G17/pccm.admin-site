import { Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useStore } from '@/app/stores/store';
import BookingGridTableComponent from './BookingGridTableComponent';

const BookingPendingComponent = observer(() => {
  const { bookingClusterStore } = useStore();
  const { bookingPendingArray, loadBookingPending, loadingBookingPending } = bookingClusterStore;
  const toast = useToast();
  useEffect(() => {
    loadBookingPending(toast);
  }, []);
  return (
    <Skeleton isLoaded={!loadingBookingPending} h={'30rem'}>
      <BookingGridTableComponent bookingArray={bookingPendingArray} />
    </Skeleton>
  );
});

export default BookingPendingComponent;
