import { useStore } from '@/app/stores/store';
import { Center, Grid, GridItem } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import BookingTodayItemAtom from '../atoms/BookingTodayItemAtom';

const BookingTodayComponent = observer(() => {
  const { bookingStore } = useStore();
  const { bookingTodayArray } = bookingStore;
  return (
    <>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="px-4 py-2 bg-teal-400  rounded-t-lg cursor-pointer mb-2"
        style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
      >
        <GridItem colSpan={20} as={Link} to={'/booking/chi-tiet/1'}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(24,1fr)'} className="w-full">
              <GridItem colSpan={1}>STT</GridItem>
              <GridItem colSpan={4}>Họ và tên</GridItem>
              <GridItem colSpan={3}>Số điện thoại</GridItem>
              <GridItem colSpan={3}>Giờ chơi</GridItem>
              <GridItem colSpan={4}>Ngày chơi</GridItem>
              <GridItem colSpan={4}>Ngày tạo đơn</GridItem>
              <GridItem colSpan={3}>Thanh toán</GridItem>
              <GridItem colSpan={2} className="flex items-center ">
                Giá đơn
              </GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4} className="pl-12">
          Hành động
        </GridItem>
      </Grid>
      {bookingTodayArray &&
        bookingTodayArray.map((bookingToday, index) => {
          return (
            <BookingTodayItemAtom
              bookingToday={bookingToday}
              index={index}
              key={`${bookingToday.id}`}
            />
          );
        })}
    </>
  );
});

export default BookingTodayComponent;
