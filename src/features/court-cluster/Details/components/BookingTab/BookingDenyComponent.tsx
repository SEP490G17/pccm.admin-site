import { useStore } from '@/app/stores/store';
import { Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import BookingGridTableComponent from './BookingGridTableComponent';

const BookingDenyComponent = observer(() => {
  const { bookingClusterStore } = useStore();
  const { bookingCancelArray, loadBookingDeny, loadingBookingCancel } = bookingClusterStore;
  const toast = useToast();
  useEffect(() => {
    loadBookingDeny(toast);
  }, []);
  return (
    <Skeleton isLoaded={!loadingBookingCancel} h={'30rem'}>
      <BookingGridTableComponent bookingArray={bookingCancelArray} />
    </Skeleton>
  );
});

export default BookingDenyComponent;
