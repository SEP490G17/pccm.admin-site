import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import BookingInfoComponent from './components/Booking/BookingInfoComponent';
import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';
import ExportBillModal from './popups/ExportBill/ExportBillComponent';
import dayjs from 'dayjs';

const BookingDetailsPage = observer(() => {
  const { id } = useParams();
  const { bookingStore } = useStore();
  const toast = useToast();
  const { loadingInitial, getDetailsBooking, clearDetailsBooking, selectedBooking } = bookingStore;
  window.scrollTo(0, 0);
  const { search } = useLocation();
  const query = new URLSearchParams(search); // Tạo đối tượng URLSearchParams
  const payment = query.get('payment');

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      getDetailsBooking(Number(id), toast);
    }
    if (payment === 'success') {
      onOpen();
    }

    return () => {
      clearDetailsBooking();
    };
  }, [getDetailsBooking, id, toast, clearDetailsBooking, onOpen, payment]);
  const cancelRef = React.useRef<any>();
  return (
    <>
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
              <div>
                <Heading size={'xl'}>Chi tiết booking {id}</Heading>
                <p className="font-thin text-xl mt-2">
                  Ngày đặt:{' '}
                  {selectedBooking?.bookingDetails.createdAt &&
                    dayjs(selectedBooking?.bookingDetails.createdAt)
                      .format('HH:mm DD/MM/YYYY')}
                </p>
              </div>
              <ExportBillModal bookingId={id}></ExportBillModal>
            </Flex>
          </CardHeader>
          <CardBody>
            <BookingInfoComponent />
          </CardBody>
        </Card>
      </Skeleton>

      <AlertDialog
        size={'2xl'}
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <div className="bg-gray-100 ">
              <div className="bg-white md:mx-auto">
                <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                  <path
                    fill="currentColor"
                    d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                  ></path>
                </svg>
                <div className="text-center">
                  <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-gray-600 my-2 py-2">
                    Đơn đặt lịch {bookingStore.selectedBooking?.bookingDetails.id} đã được thanh
                    toán thành công
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className=" text-center w-full pb-6 ">
              <button
                onClick={onClose}
                className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
              >
                Đóng
              </button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export default BookingDetailsPage;
