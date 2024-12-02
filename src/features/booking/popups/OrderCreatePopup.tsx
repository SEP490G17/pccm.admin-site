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
import { FC, useEffect, useState } from 'react';
import BookingServicesTab from '../components/Booking/BookingServicesTab';
import { BookingDetails } from '@/app/models/booking.model';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import OrderTotalInfoComponent from '../components/Order/OrderTotalInfoComponent';
import BookingProductTab from '../components/Booking/BookingProductsTab';

interface OrderCreatePopupProps {
  booking: BookingDetails;
}

const OrderCreatePopup: FC<OrderCreatePopupProps> = observer(({ booking }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const { courtClusterStore, bookingStore, categoryStore } = useStore();
  const {
    loadProductsOfCourtCluster,
    productOfClusterRegistry,
    setLoadingInitialProductPage,
    loadServicesOfCourtCluster,
  } = courtClusterStore;
  const { createOrder } = bookingStore;
  const toast = useToast();
  const handleCreateOrder = async () => {
    await createOrder(booking.bookingDetails.id, toast);
    onClose();
  };
  useEffect(() => {
    if (productOfClusterRegistry.size <= 1) {
      setLoadingInitialProductPage(true);
      loadProductsOfCourtCluster(booking.bookingDetails.courtClusterId, toast).then(() => {
        setLoadingInitialProductPage(false);
      });
    }
    categoryStore.loadCategories(toast);
    loadServicesOfCourtCluster(booking.bookingDetails.courtClusterId, toast).then();
    return () => {
      courtClusterStore.clearDetailsCourtCluster();
    };
  }, [
    loadProductsOfCourtCluster,
    productOfClusterRegistry,
    booking.bookingDetails,
    toast,
    setLoadingInitialProductPage,
    loadServicesOfCourtCluster,
    courtClusterStore,
    categoryStore,
  ]);

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

      <Modal isOpen={isOpen} onClose={onClose} size={'full'} id="order-details" isCentered>
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
                      {tabIndex === 0 && booking.bookingDetails && (
                        <BookingProductTab courtClusterId={booking.bookingDetails.courtClusterId} />
                      )}
                    </TabPanel>
                    <TabPanel>
                      {tabIndex === 1 && booking.bookingDetails && (
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                bookingStore.resetOnClose();
                onClose();
              }}
            >
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
