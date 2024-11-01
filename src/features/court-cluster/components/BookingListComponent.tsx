import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

const BookingListComponent = () => {
  return (
    <>
      <Tabs isFitted variant={'line'} mt={4} colorScheme={'green'} bg={'white'} borderRadius={'md'}>
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopLeftRadius={'md'}>Đã duyệt</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.600' }} borderTopRightRadius={'md'}>Chờ duyệt</Tab>
      
        </TabList>

        <TabPanels minHeight={'50rem'} className=''>
          <TabPanel>

          </TabPanel>
          <TabPanel>

          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default BookingListComponent;
