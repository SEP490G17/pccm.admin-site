import {
  Button,
  Flex,
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import BookingProductTab from '../components/BookingProductsTab';
import OrderTotalInfoComponent from '../components/OrderTotalInfoComponent';
import BookingServicesTab from '../components/BookingServicesTab';
import { BookingDetails } from '@/app/models/booking.model';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';

interface OrderCreatePopupProps {
  booking: BookingDetails;
}

const OrderCreatePopup: FC<OrderCreatePopupProps> = observer(({ booking }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const { bookingStore } = useStore();
  const { createOrder } = bookingStore;
  const toast = useToast();
  const handleCreateOrder = async () => {
    await createOrder(booking.bookingDetails.id, toast);
    onClose();
  };
  return (
    <>
      <Flex className="float-end">
        <Button
          onClick={() => {
            onOpen();
            bookingStore.clearOrderList();
          }}
          colorScheme="teal"
        >
          Tạo Order
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size={'full'} id='order-details' isCentered>
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
                    <TabPanel>
                      {tabIndex === 0 && booking.bookingDetails.courtClusterId && (
                        <BookingProductTab courtClusterId={booking.bookingDetails.courtClusterId} />
                      )}
                    </TabPanel>
                    <TabPanel>
                      {tabIndex === 1 && booking.bookingDetails.courtClusterId && (
                        <BookingServicesTab
                          courtClusterId={booking.bookingDetails.courtClusterId}
                        />
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </GridItem>
              <GridItem colSpan={10}>
                <OrderTotalInfoComponent />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
            <Button variant="ghost" onClick={handleCreateOrder}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default OrderCreatePopup;