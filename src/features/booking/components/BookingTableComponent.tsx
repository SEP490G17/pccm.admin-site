import { router } from '@/app/router/Routes';
import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import BookingButtonAtom from '@/features/court-cluster/atoms/BookingButtonAtom';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { observer } from 'mobx-react';

const BookingTableComponent = observer(() => {
  const { bookingStore } = useStore();
  const { bookingArray, loadingInitial, bookingPageParams } = bookingStore;
  return (
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'15rem'}>Sân</Th>
              <Th w={'15rem'}>Họ và tên</Th>
              <Th w={'15rem'}>Số điện thoại</Th>
              <Th w={'15rem'}>Giờ chơi</Th>
              <Th w={'10rem'}>Ngày bắt đầu</Th>
              <Th w={'10rem'}>Ngày kết thúc</Th>
              <Th w={'10rem'}>Giá đơn</Th>
              <Th w={'15rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={8} pageSize={bookingPageParams.pageSize} />
            )}

            {!loadingInitial &&
              bookingArray.map((booking, index) => (
                <Tr key={booking.id}>
                  <Td
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      router.navigate(`/booking/chi-tiet/${booking.id}`);
                    }}
                  >
                    {index + 1}
                  </Td>
                  <Td>{booking.courtClusterName}</Td>
                  <Td>{booking.fullName}</Td>
                  <Td>{booking.phoneNumber}</Td>
                  <Td>{booking.playTime}</Td>
                  <Td>{booking.startDay}</Td>
                  <Td>{booking.endDay}</Td>
                  <Td>
                    {booking.totalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Td>
                  <Td className="z-50">
                    <BookingButtonAtom booking={booking} />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
  );
});

export default BookingTableComponent;
