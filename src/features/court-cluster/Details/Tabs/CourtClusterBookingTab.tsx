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
  const { loadCourtOfCluster, loadingInitialBookingPage, setLoadingInitialBookingPage } =
    courtClusterStore;
  const { clearBookingForSchedule } = bookingStore;
  useEffect(() => {
    setLoadingInitialBookingPage(true);
    bookingStore.clearBookingForSchedule();
    Promise.all([
      bookingStore.loadCourtPrice(courtClusterId),
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

  return (
    <Skeleton isLoaded={!loadingInitialBookingPage} minHeight={'300rem'}>
      <Heading size={'lg'} className="my-4">
        Lịch đặt
      </Heading>
      <Grid templateColumns={'repeat(24,1fr)'} gap={4}>
        <GridItem colSpan={7}>
          <ComboBookingComponent />
        </GridItem>
        <GridItem colSpan={17}>
          <ScheduleCustomComponent />
        </GridItem>
      </Grid>
      <BookingListComponent />
    </Skeleton>
  );
});

export default CourtClusterBookingTab;
