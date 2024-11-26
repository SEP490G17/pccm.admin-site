import {
  Button,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import BookingServicesTab from '../components/Booking/BookingServicesTab';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import { PaymentStatus } from '@/app/models/payment.model';
import BookingProductTab from '../components/Booking/BookingProductsTab';
import OrderTotalInfoComponent from '../components/Order/OrderTotalInfoComponent';

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsPopUp: FC<OrderDetailsProps> = observer(({ isOpen, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { bookingStore } = useStore();
  const { selectedBooking: booking, loadingOrder, updateOrder, selectedOrder } = bookingStore;

  if (!booking) return;
  const toast = useToast();
  const handleUpdateOrder = async () => {
    await updateOrder(toast);
  };
  if(!selectedOrder) return;
  console.log(selectedOrder);
  return (
    <>
      <Modal id="order-details" isOpen={isOpen} onClose={onClose} size={'full'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={'md'}>Chi tiết Order</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={'repeat(24,1fr)'} gap={2}>
              <GridItem colSpan={14}>
                <Tabs
                  mt={4}
                  colorScheme={'green'}
                  index={tabIndex}
                  onChange={(index) => setTabIndex(index)}
                >
                  <TabList border={'none'}>
                    <Tab>Sản phẩm</Tab>
                    <Tab>Dịch vụ</Tab>
                  </TabList>

                  <TabPanels minHeight={'50rem'}>
                    <TabPanel key={12}>
                      {booking.bookingDetails.courtClusterId && (
                        <BookingProductTab courtClusterId={booking.bookingDetails.courtClusterId} />
                      )}
                    </TabPanel>
                    <TabPanel key={13}>
                      {booking.bookingDetails.courtClusterId && (
                        <BookingServicesTab
                          courtClusterId={booking.bookingDetails.courtClusterId}
                        />
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </GridItem>
              <GridItem colSpan={10}>
                {loadingOrder && <Skeleton height={'100%'} />}
                {!loadingOrder && <OrderTotalInfoComponent />}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
            {
            selectedOrder.paymentStatus && selectedOrder.paymentStatus !== PaymentStatus.Success && 
            (
              <Button variant="ghost" onClick={handleUpdateOrder}>
                Lưu
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default OrderDetailsPopUp;
