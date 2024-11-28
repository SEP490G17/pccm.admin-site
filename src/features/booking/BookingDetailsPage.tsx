import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import BookingInfoComponent from './components/Booking/BookingInfoComponent';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';

const BookingDetailsPage = observer(() => {
  const { id } = useParams();
  const { bookingStore } = useStore();
  const toast = useToast();
  const { loadingInitial, getDetailsBooking, exportBill, clearDetailsBooking } = bookingStore;
  window.scrollTo(0, 0);
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      getDetailsBooking(Number(id), toast);
    }
    return () => {
      clearDetailsBooking();
    };
  }, [getDetailsBooking, id, toast, clearDetailsBooking]);
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
          <Flex justifyContent={'space-between'}>
            <Heading size={'xl'}>Chi tiết booking {id}</Heading>
            <Button
              onClick={() => {
                if (id && !isNaN(Number(id))) {
                  exportBill(Number(id));
                }
              }}
            >
              Xuất hóa đơn
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <BookingInfoComponent />
        </CardBody>
      </Card>
    </Skeleton>
  );
});

export default BookingDetailsPage;
