import { BookingForList } from '@/app/models/booking.model';
import { Badge, Center, Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import BookingButtonAtom from './BookingButtonAtom';

interface BookingGridItemAtomProps {
  bookingToday: BookingForList;
  index: number;
}

const BookingGridItemAtom: FC<BookingGridItemAtomProps> = ({ bookingToday, index }) => {
  return (
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="p-4 rounded-lg cursor-pointer"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <GridItem colSpan={20} as={Link} to={`/booking/chi-tiet/${bookingToday.id}`}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(23,1fr)'} className="w-full">
              <GridItem colSpan={1}>{index + 1}</GridItem>
              <GridItem colSpan={2}>{bookingToday.courtName}</GridItem>
              <GridItem colSpan={3}>{bookingToday.fullName}</GridItem>
              <GridItem colSpan={3}>{bookingToday.phoneNumber}</GridItem>
              <GridItem colSpan={3}>{bookingToday.playTime}</GridItem>
              <GridItem colSpan={3}>Ngày {bookingToday.startDay}</GridItem>
              <GridItem colSpan={3}>Ngày {bookingToday.endDay}</GridItem>
              <GridItem colSpan={2}>
                {
                  <Badge
                    fontSize="0.8em"
                    colorScheme={bookingToday.recurrenceRule ? 'pink' : 'blue'}
                  >
                    {bookingToday.recurrenceRule  ? 'Đơn combo' : 'Đơn ngày'}
                  </Badge>
                }
              </GridItem>

              <GridItem colSpan={3} >
                {new Intl.NumberFormat('vi-VN').format(bookingToday.totalPrice)} VND
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4}>
          <BookingButtonAtom booking={bookingToday} />
        </GridItem>
      </Grid>
  );
};

export default BookingGridItemAtom;
