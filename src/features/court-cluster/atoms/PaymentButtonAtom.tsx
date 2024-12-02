import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useStore } from '@/app/stores/store';
import { PaymentType } from '@/app/models/payment.model';

interface PaymentButtonAtomProps {
  paymentUrl?: string;
  bookingId: number;
  isDetail: boolean;
}

const PaymentButtonAtom: FC<PaymentButtonAtomProps> = ({
  paymentUrl,
  bookingId,
  isDetail = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const { paymentStore, bookingClusterStore } = useStore();
  const [includeOrder, setIncludeOrder] = useState(true);
  const toast = useToast();
  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" className="w-28">
        Thanh toán
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size={'2xl'}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size={'lg'}>Xác thực thanh toán</Heading>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Heading size={'md'}>Thanh toán bằng VNPay</Heading>
            <UnorderedList className="px-2 mt-2">
              <ListItem>
                Nhấn{' '}
                <Link
                  onClick={async () => {
                    if (paymentUrl) {
                      window.open(paymentUrl, '_blank');
                    } else {
                      await paymentStore.getPayment(PaymentType.Booking, bookingId, toast);
                      window.open(paymentStore.paymentUrl, '_blank');
                      bookingClusterStore.updateTodayUrlBooking(paymentStore.paymentUrl, bookingId);
                    }
                  }}
                >
                  vào đây
                </Link>{' '}
                để thanh toán bằng VNPay
              </ListItem>
              <ListItem>
                Nhấn{' '}
                <Link
                  onClick={async () => {
                    await paymentStore.getPayment(PaymentType.Booking, bookingId, toast);
                    if (isDetail) {
                      window.location.href = paymentStore.paymentUrl;
                    } else {
                      window.open(paymentStore.paymentUrl, '_blank');
                    }
                    bookingClusterStore.updateTodayUrlBooking(paymentStore.paymentUrl, bookingId);
                  }}
                >
                  vào đây
                </Link>{' '}
                để tạo lại thanh toán VNPay nếu thanh toán đã quá hạn
              </ListItem>
            </UnorderedList>
            <Heading size={'md'} className="mt-6">
              Xác thực đã thanh toán
            </Heading>
            <Text className="px-2 mt-2 text-red-500">
              Chọn xác thực đã thanh toán sẽ chuyển đổi trạng thái của booking sang đã thanh toán
              <br />
              Chỉ sử dụng khi:
            </Text>
            <UnorderedList className="px-2 mt-2">
              <ListItem>Khách hàng trả tiền mặt trực tiếp</ListItem>
              <ListItem>
                Khách hàng đã trả tiền qua VNPay, đã nhận được tiền, nhưng chưa chuyển trạng thái
              </ListItem>
            </UnorderedList>
            <Text className="mt-10 text-red-400 text-base">
              Bao gồm cả order bên trong:{' '}
              <Checkbox isChecked={includeOrder} onChange={() => setIncludeOrder(!includeOrder)} />{' '}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Thoát
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={async () => {
                onClose();
                await bookingClusterStore.paymentSuccessBooking(bookingId, includeOrder, toast);
              }}
            >
              Xác thực đã thanh toán
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentButtonAtom;
