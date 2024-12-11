import { useEffect } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import BookingListComponent from '../components/BookingTab/BookingListComponent';
import ScheduleCustomComponent from '../components/ScheduleCustomComponent';
import ComboBookingComponent from '../components/ComboBookingComponent';

const CourtClusterBookingTab = observer(() => {
  const toast = useToast();

  const { courtClusterStore, bookingClusterStore: bookingStore } = useStore();
  const { loadingInitialBookingPage, setLoadingInitialBookingPage, selectedCourtCluster } =
    courtClusterStore;
  const { clearBookingForSchedule } = bookingStore;
  useEffect(() => {
    setLoadingInitialBookingPage(true);
    bookingStore.clearBookingForSchedule();
    bookingStore.loadBookingForSchedule(toast).then(() => setLoadingInitialBookingPage(false));
  }, [bookingStore, setLoadingInitialBookingPage, toast, clearBookingForSchedule]);
  if (!selectedCourtCluster) return;
  return (
    <Skeleton isLoaded={!loadingInitialBookingPage}>
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem>
          <AccordionButton>
            <Heading size={'lg'} className="my-4">
              Lịch đặt
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Grid templateColumns={'repeat(24,1fr)'} gap={4}>
              <GridItem colSpan={{ base: 24, xl: 17 }}>
                <ScheduleCustomComponent
                  selectedCourtCluster={selectedCourtCluster}
                  courtClusterId={selectedCourtCluster.id}
                />
              </GridItem>
              <GridItem colSpan={{ base: 24, xl: 7 }}>
                <ComboBookingComponent
                  openTime={selectedCourtCluster.openTime}
                  closeTime={selectedCourtCluster.closeTime}
                  selectedCourtCluster={selectedCourtCluster}
                />
              </GridItem>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <BookingListComponent />
    </Skeleton>
  );
});

export default CourtClusterBookingTab;
