import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import BookingTodayComponent from './BookingTodayComponent';

const BookingListComponent = () => {
  return (
    <>
      <Tabs isFitted variant={'line'} mt={4} colorScheme={'green'} bg={'white'} borderRadius={'md'}>
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopLeftRadius={'md'}>
            Đơn hôm nay
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }}>Chờ duyệt</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }}>Đơn đã huỷ</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopRightRadius={'md'}>
            Tất cả
          </Tab>
        </TabList>

        <TabPanels minHeight={'50rem'} className="">
          <TabPanel>
            <BookingTodayComponent />
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
