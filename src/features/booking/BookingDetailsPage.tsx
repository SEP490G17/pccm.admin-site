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
  const { loadingInitial, getDetailsBooking } = bookingStore;
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      getDetailsBooking(Number(id), toast);
    }
  }, []);
  return (
    <Skeleton isLoaded={!loadingInitial} height={'100rem'}>
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Danh sách Booking', to: '/booking' },
          { title: `Chi tiết booking ${id}`, to: `/booking/chi-tiet/${id}` },
        ]}
      />

      <Card className="mt-5">
        <CardHeader>
          <Heading size={'xl'}>Chi tiết booking {id}</Heading>
        </CardHeader>
        <CardBody>
          <BookingInfoComponent />
        </CardBody>
      </Card>
    </Skeleton>
  );
});

export default BookingDetailsPage;
