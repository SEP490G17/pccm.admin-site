import { observer } from 'mobx-react';
import { Box, Grid, GridItem, Heading, Skeleton } from '@chakra-ui/react';
import { useStore } from '@/app/stores/store.ts';
import { useEffect } from 'react';
import ServiceCardItemSellComponent from '../Service/ServiceCardItemSellComponent';
interface IProps {
  courtClusterId: number;
}
const BookingServicesTab = observer(({ courtClusterId }: IProps) => {
  const { courtClusterStore } = useStore();
  const { loadingServicesPage, loadServicesOfCourtCluster, serviceOfCourtClusterArray } =
    courtClusterStore;
  useEffect(() => {
    loadServicesOfCourtCluster(courtClusterId).then();
  }, [courtClusterId]);
  return (
    <Box>
      <Heading as={'h5'} size={'md'} className={'mb-5'}>
        Danh sách dịch vụ của cụm sân
      </Heading>
      {!loadingServicesPage && (
        <Grid templateColumns={'repeat(2,1fr)'} gap={4} maxHeight={'40rem'} overflowY={'auto'}>
          {serviceOfCourtClusterArray.map((service) => (
            <ServiceCardItemSellComponent service={service} />
          ))}
        </Grid>
      )}
      {loadingServicesPage && (
        <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
          {Array.from({ length: 6 }, (_, index) => (
            <GridItem key={index} colSpan={{ base: 2, xl: 1 }}>
              <Skeleton height="11rem" />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
});

export default BookingServicesTab;
