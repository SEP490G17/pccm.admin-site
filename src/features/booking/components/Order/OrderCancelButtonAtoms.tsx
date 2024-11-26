import { useStore } from '@/app/stores/store';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react';
import React from 'react';

interface OrderCancelButtonProps {
  id: number;
}

const OrderCancelButtonComponent = observer(({ id }: OrderCancelButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();
  const { bookingStore } = useStore();
  const toast = useToast();
  const handelCancel = async () => {
    onClose();
    await bookingStore.cancelOrder(id, toast);
  };
  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Hủy đơn
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hủy Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc muốn hủy đơn Order này, các dữ liệu liên quan sẽ được trả lại
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Thoát
              </Button>
              <Button colorScheme="red" onClick={async () => await handelCancel()} ml={3}>
                Xác nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
});

export default OrderCancelButtonComponent;
