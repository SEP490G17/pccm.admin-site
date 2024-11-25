import { useEffect } from 'react';
import { Grid, GridItem, Heading, Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
import BookingListComponent from '../components/BookingTab/BookingListComponent';
import ScheduleCustomComponent from '../components/ScheduleCustomComponent';
import ComboBookingComponent from '../components/ComboBookingComponent';
interface IProps {
  courtClusterId: number;
}
const CourtClusterBookingTab = observer(({ courtClusterId }: IProps) => {
  const toast = useToast();

  const { courtClusterStore, bookingClusterStore: bookingStore } = useStore();
  const {
    loadCourtOfCluster,
    loadingInitialBookingPage,
    setLoadingInitialBookingPage,
    selectedCourtCluster,
  } = courtClusterStore;
  const { clearBookingForSchedule } = bookingStore;
  useEffect(() => {
    setLoadingInitialBookingPage(true);
    bookingStore.clearBookingForSchedule();
    Promise.all([
      loadCourtOfCluster(courtClusterId, toast),
      bookingStore.loadBookingForSchedule(toast),
    ]).then(() => setLoadingInitialBookingPage(false));
  }, [
    courtClusterId,
    bookingStore,
    loadCourtOfCluster,
    setLoadingInitialBookingPage,
    toast,
    clearBookingForSchedule,
  ]);
  if (!selectedCourtCluster) return;
  return (
    <Skeleton isLoaded={!loadingInitialBookingPage} minHeight={'300rem'}>
      <Heading size={'lg'} className="my-4">
        Lịch đặt
      </Heading>
      <Grid templateColumns={'repeat(24,1fr)'} gap={4}>
        <GridItem colSpan={{base:24, xl:17}}>
          <ScheduleCustomComponent />
        </GridItem>
        <GridItem colSpan={{base:24, xl:7}}>
          <ComboBookingComponent
            openTime={selectedCourtCluster.openTime}
            closeTime={selectedCourtCluster.closeTime}
          />
        </GridItem>
      </Grid>
      <BookingListComponent />
    </Skeleton>
  );
});

export default CourtClusterBookingTab;
