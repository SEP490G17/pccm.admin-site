import { PaymentType } from '@/app/models/payment.model';
import { useStore } from '@/app/stores/store';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
import React from 'react';

interface OrderPaymentProps {
  orderId: number;
}

const OrderPaymentButtonAtoms = observer(({ orderId }: OrderPaymentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const { paymentStore, bookingStore } = useStore();
  const toast = useToast();
  const handlePaymentSuccessOrder = async () => {
    await bookingStore.orderPaymentSuccess(orderId, toast);
  };

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
                    await paymentStore.getPayment(PaymentType.Order, orderId, toast);
                    window.open(paymentStore.paymentUrl, '_blank');
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
                    await paymentStore.getPayment(PaymentType.Order, orderId, toast);
                    window.open(paymentStore.paymentUrl, '_blank');
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
              Chọn xác thực đã thanh toán sẽ chuyển đổi trạng thái của order sang đã thanh toán
              <br />
              Chỉ sử dụng khi:
            </Text>
            <UnorderedList className="px-2 mt-2">
              <ListItem>Khách hàng trả tiền mặt trực tiếp</ListItem>
              <ListItem>
                Khách hàng đã trả tiền qua VNPay, đã nhận được tiền, nhưng chưa chuyển trạng thái
              </ListItem>
            </UnorderedList>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Thoát
            </Button>
            <Button colorScheme="red" ml={3} onClick={handlePaymentSuccessOrder}>
              Xác thực đã thanh toán
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export default OrderPaymentButtonAtoms;
