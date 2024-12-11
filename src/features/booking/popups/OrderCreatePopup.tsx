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
  const { loadProductsOfCourtCluster, setLoadingInitialProductPage, loadServicesOfCourtCluster } =
    courtClusterStore;
  const { createOrder } = bookingStore;
  const toast = useToast();
  const handleCreateOrder = async () => {
    await createOrder(booking.bookingDetails.id, toast);
    onClose();
  };
  useEffect(() => {
    categoryStore.loadCategories(toast);
    return () => {
      courtClusterStore.clearDetailsCourtCluster();
    };
    // Remove dependencies if stable references are guaranteed
  }, [categoryStore,toast,courtClusterStore]);

  const handleCreateOrderOpen = async () => {
    if (!booking.bookingDetails?.courtClusterId) return;
    bookingStore.resetOnClose();
    courtClusterStore.productOfClusterRegistry.clear();
    courtClusterStore.productCourtClusterPageParams.reset();
    courtClusterStore.productCourtClusterPageParams.clearLazyPage();
    courtClusterStore.servicesOfClusterRegistry.clear();
    courtClusterStore.serviceCourtClusterPageParams.reset();
    courtClusterStore.serviceCourtClusterPageParams.clearLazyPage();
    onOpen();
    bookingStore.clearOrderList();
    setLoadingInitialProductPage(true);
    loadServicesOfCourtCluster(booking.bookingDetails.courtClusterId, toast);
    loadProductsOfCourtCluster(booking.bookingDetails.courtClusterId, toast).then(() =>
      setLoadingInitialProductPage(false),
    );
  };

  return (
    <>
      <Flex className="float-end">
        <Button onClick={handleCreateOrderOpen} colorScheme="teal">
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
                onClose();
                bookingStore.resetOnClose();
                courtClusterStore.productOfClusterRegistry.clear();
                courtClusterStore.productCourtClusterPageParams.reset();
                courtClusterStore.productCourtClusterPageParams.clearLazyPage();
                courtClusterStore.servicesOfClusterRegistry.clear();
                courtClusterStore.serviceCourtClusterPageParams.reset();
                courtClusterStore.serviceCourtClusterPageParams.clearLazyPage();
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
