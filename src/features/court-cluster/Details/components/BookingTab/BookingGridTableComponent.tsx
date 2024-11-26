import { BookingForList } from '@/app/models/booking.model';
import { Box, Button, Center, Flex, Grid, GridItem, Link } from '@chakra-ui/react';
import { FC } from 'react';
import BookingGridItemAtom from '../../../atoms/BookingGridItemAtom';

interface BookingGridTableComponentProps {
  bookingArray: BookingForList[];
  totalElement?: number;
  loadMore?: () => Promise<void>;
}

const BookingGridTableComponent: FC<BookingGridTableComponentProps> = ({
  bookingArray,
  totalElement,
  loadMore,
}) => {
  return (
    <>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className="px-4 py-2 bg-teal-400  rounded-t-lg cursor-pointer mb-2"
        style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
      >
        <GridItem colSpan={20}>
          <Center className="h-full">
            <Grid templateColumns={'repeat(23,1fr)'} className="w-full">
              <GridItem colSpan={1}>STT</GridItem>
              <GridItem colSpan={2}>Sân</GridItem>
              <GridItem colSpan={3}>Họ và tên</GridItem>
              <GridItem colSpan={3}>Số điện thoại</GridItem>
              <GridItem colSpan={3}>Giờ chơi</GridItem>
              <GridItem colSpan={3}>Ngày bắt đầu</GridItem>
              <GridItem colSpan={3}>Ngày kết thúc</GridItem>
              <GridItem colSpan={2}>Thể loại</GridItem>
              <GridItem colSpan={3}>Giá đơn</GridItem>
            </Grid>
          </Center>
        </GridItem>
        <GridItem colSpan={4}>Hành động</GridItem>
      </Grid>
      <Box height={'50rem'} className="overflow-y-auto">
        {bookingArray?.map((bookingToday, index) => {
          return (
            <BookingGridItemAtom
              bookingToday={bookingToday}
              index={index}
              key={`${bookingToday.id}`}
            />
          );
        })}
        {totalElement && totalElement > bookingArray.length && (
          <Flex className="float-end mt-4">
            <Link
              onClick={async () => {
                if (loadMore) {
                  await loadMore();
                }
              }}
            >
              Xem thêm...
            </Link>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default BookingGridTableComponent;
