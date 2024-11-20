import { useStore } from '@/app/stores/store';
import { Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import BookingGridTableComponent from './BookingGridTableComponent';

const BookingAllComponent = observer(() => {
  const { bookingClusterStore } = useStore();
  const toast = useToast();
  const { bookingAllArray, loadBookingAll, loadingBookingAll } = bookingClusterStore;
  useEffect(() => {
    loadBookingAll(toast);
  }, []);
  return (
    <Skeleton isLoaded={!loadingBookingAll} h={'30rem'}>
      <BookingGridTableComponent bookingArray={bookingAllArray} />
    </Skeleton>
  );
});

export default BookingAllComponent;
