import {
  getPaymentStatusColor,
  getPaymentStatusText,
} from '@/app/models/payment.model';
import { useStore } from '@/app/stores/store';
import {
  Badge,
  Button,
  Checkbox,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { isNumber } from '@/app/helper/utils';

interface BillProps {
  bookingId: string | undefined
}

const ExportBillModal = observer(({ bookingId }: BillProps) => {
  const { bookingStore } = useStore();
  const { exportBill } = bookingStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const handleSelectAll = (isChecked: any) => {
    if (isChecked) {
      setSelectedOrders(bookingStore.orderOfBooking.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number, isChecked: any) => {
    if (isChecked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  useEffect(() => {
    setSelectedOrders([])
  }, [isOpen])

  return (
    <>
      <Button colorScheme="gray" onClick={onOpen}>
        Hóa đơn
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Danh sách hóa đơn</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" className="p-4 border-b-2">
              <GridItem colSpan={1}>
                <Checkbox
                  isChecked={selectedOrders.length === bookingStore.orderOfBooking.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </GridItem>
              <GridItem colSpan={2}>STT</GridItem>
              <GridItem colSpan={3}>Ngày tạo</GridItem>
              <GridItem colSpan={3}>Trạng thái</GridItem>
              <GridItem colSpan={3}>Tổng giá</GridItem>
            </Grid>
            {bookingStore.orderOfBooking.map((order, index) => (
              <Grid
                key={order.id}
                templateColumns="repeat(12, 1fr)"
                className="p-4 border-b-[1px]"
              >
                <GridItem colSpan={1}>
                  <Checkbox
                    isChecked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                  />
                </GridItem>
                <GridItem colSpan={2}>{index + 1}</GridItem>
                <GridItem colSpan={3}>
                  Ngày {dayjs(order.createdAt).format('DD/MM/YYYY')}
                </GridItem>
                <GridItem colSpan={3}>
                  <Badge colorScheme={`${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </GridItem>
                <GridItem colSpan={3}>
                  {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
                </GridItem>
              </Grid>
            ))}
            <UnorderedList className="px-2 mt-2">
              <ListItem color={'red'}>
                Chọn các order ở trên để xuất hóa đơn (nếu cần).
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={() => {
                if (bookingId && isNumber(parseInt(bookingId))) {
                  exportBill(Number(bookingId), selectedOrders);
                }
              }}
            >
              Xuất hóa đơn
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ExportBillModal;
