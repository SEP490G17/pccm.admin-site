import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react';
import BookingGridTableComponent from './BookingGridTableComponent';

const BookingTodayComponent = observer(() => {
  const { bookingClusterStore: bookingStore } = useStore();
  const { bookingTodayArray } = bookingStore;
  return (
    <>
      <BookingGridTableComponent bookingArray={bookingTodayArray} />
    </>
  );
});

export default BookingTodayComponent;
