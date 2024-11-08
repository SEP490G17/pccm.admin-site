import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import BookingAcceptedComponent from './BookingAcceptComponent';

const BookingListComponent = () => {
  return (
    <>
      <Tabs isFitted variant={'line'} mt={4} colorScheme={'green'} bg={'white'} borderRadius={'md'}>
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopLeftRadius={'md'}>
            Đơn ngày
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }}>Đơn theo tháng</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }}>Chờ duyệt</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopRightRadius={'md'}>
            Đơn huỷ
          </Tab>
        </TabList>

        <TabPanels minHeight={'50rem'} className="">
          <TabPanel>
            <BookingAcceptedComponent />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default BookingListComponent;
