import { observer } from 'mobx-react';
import BookingTableComponent from './components/BookingTableComponent';
import { useStore } from '@/app/stores/store';
import { useEffect } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import Select from 'react-select';

const BookingsPage = observer(() => {
  const { bookingStore, courtClusterStore } = useStore();
  const toast = useToast();
  const { courtClusterListAllOptions, loadCourtClusterListAll } = courtClusterStore;

  const { loadBookingAll, filterByCourtCluster, bookingPageParams, bookingRegistry } = bookingStore;
  useEffect(() => {
    if (bookingRegistry.size <= 1) {
      loadBookingAll(toast);
    }
    if (courtClusterListAllOptions.length <= 1) {
      loadCourtClusterListAll();
    }
  });
  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách booking', to: '/booking' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
            placeholder="Cụm sân"
            defaultValue={{
              value: bookingPageParams.courtClusterId ?? 0,
              label: courtClusterListAllOptions.find(x=>x.value == bookingPageParams.courtClusterId)?.label ?? 'Tất cả',
            }}
            className="w-56 p-2 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await filterByCourtCluster(e.value, toast);
              }
            }}
            isSearchable={true}
          ></Select>
        </Flex>
      </Flex>
      <BookingTableComponent />
    </>
  );
});

export default BookingsPage;
