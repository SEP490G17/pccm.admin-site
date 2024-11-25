import { convertBookingStartAndEndUTCToG7 } from '@/app/helper/utils';
import { BookingForList } from '@/app/models/booking.model';
import { useStore } from '@/app/stores/store';
import { Badge, Button, Center, Grid, GridItem, useToast } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';


interface BookingGridItemProps {
  bookingToday: BookingForList;
  index: number;
}

const BookingConflictGridItem: FC<BookingGridItemProps> = ({ bookingToday, index }) => {
  const { bookingClusterStore, bookingStore } = useStore();
  const { denyBooking } = bookingClusterStore;
  const toast = useToast();
  const handleDenyBooking = async (id: number) => {
    await denyBooking(id, toast).then((data) => {
      if (data.res) {
        bookingStore.bookingRegistry.set(data.res.id, convertBookingStartAndEndUTCToG7(data.res));
      }
    });
  };
  return (
    <Grid
        templateColumns={'repeat(24, 1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={22} as={Link} to={`/booking/chi-tiet/${bookingToday.id}`}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(23, 1fr)'} className="w-full">
              <GridItem colSpan={1}>{index + 1}</GridItem>
              <GridItem colSpan={2}>{bookingToday.courtName}</GridItem>
              <GridItem colSpan={3}>{bookingToday.fullName}</GridItem>
              <GridItem colSpan={3}>{bookingToday.phoneNumber}</GridItem>
              <GridItem colSpan={3}>{bookingToday.playTime}</GridItem>
              <GridItem colSpan={3}>{dayjs(bookingToday.startDay).format('DD/MM/YYYY')}</GridItem>
              <GridItem colSpan={3}>{dayjs(bookingToday.endDay).format('DD/MM/YYYY')}</GridItem>
              <GridItem colSpan={2}>
                <Badge fontSize="0.8em" colorScheme={bookingToday.recurrenceRule ? 'pink' : 'blue'}>
                  {bookingToday.recurrenceRule ? 'Đơn combo' : 'Đơn ngày'}
                </Badge>
              </GridItem>
              <GridItem colSpan={3}>
                {new Intl.NumberFormat('vi-VN').format(bookingToday.totalPrice)} VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={2}>
          <Button colorScheme="red" className="w-24" onClick={() => handleDenyBooking(bookingToday.id)}>
            Từ chối
          </Button>
        </GridItem>
      </Grid>
  );
};

export default BookingConflictGridItem;
