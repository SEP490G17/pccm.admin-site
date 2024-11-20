import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import BookingTodayComponent from './BookingTodayComponent';
import BookingPendingComponent from './BookingPendingComponent';
import { useState } from 'react';
import BookingCancelComponent from './BookingCancelComponent';
import BookingAllComponent from './BookingAllComponent';

const BookingListComponent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
      <Tabs
        isFitted
        variant={'line'}
        mt={4}
        colorScheme={'green'}
        bg={'white'}
        borderRadius={'md'}
        onChange={(index) => setTabIndex(index)}
      >
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
          <TabPanel>{tabIndex === 0 && <BookingTodayComponent />}</TabPanel>
          <TabPanel>{tabIndex === 1 && <BookingPendingComponent />}</TabPanel>
          <TabPanel>{tabIndex === 2 && <BookingCancelComponent />}</TabPanel>
          <TabPanel>{tabIndex === 3 && <BookingAllComponent />}</TabPanel>
        </TabPanels>
      </Tabs>
  );
};

export default BookingListComponent;
