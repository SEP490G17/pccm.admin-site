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
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import PaymentVNPButtonAtom from './PaymentVNPButtonAtom';

interface PaymentButtonAtomProps {
  paymentUrl?: string;
  bookingId: number;
}

const PaymentButtonAtom: FC<PaymentButtonAtomProps> = ({ paymentUrl, bookingId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
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
              <ListItem>Nhấn <PaymentVNPButtonAtom paymentUrl={paymentUrl} /> để thanh toán bằng VNPay</ListItem>
              <ListItem>
                Nhấn vào đây để tạo lại thanh toán VNPay nếu thanh toán đã quá hạn
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
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Thoát
            </Button>
            <Button colorScheme="red" ml={3}>
              Xác thực đã thanh toán
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentButtonAtom;
