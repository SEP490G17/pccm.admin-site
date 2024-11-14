import { Card, CardBody, CardHeader, Heading, Skeleton, useToast } from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import BookingInfoComponent from './components/BookingInfoComponent';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';

const BookingDetailsPage = observer(() => {
  const { id } = useParams();
  const { bookingStore } = useStore();
  const toast = useToast();
  const { loadingInitial, getDetailsBooking, selectedBooking } = bookingStore;
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      getDetailsBooking(Number(id), toast);
    }
  }, []);
  return (
    <Skeleton isLoaded={!loadingInitial} height={'100rem'}>
      <PageHeadingAtoms
        breadCrumb={[
          { title: '/booking', to: 'Danh sách booking' },
          { title: 'Chi tiết booking 1', to: '/booking/chi-tiet/1' },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <Heading size={'xl'}>Chi tiết booking {id}</Heading>
        </CardHeader>
        <CardBody>{selectedBooking && <BookingInfoComponent booking={selectedBooking} />}</CardBody>
      </Card>
    </Skeleton>
  );
});

export default BookingDetailsPage;
