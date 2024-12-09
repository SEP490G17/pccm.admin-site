import { observer } from 'mobx-react-lite';
import { Box, Flex, Grid, GridItem, Heading, Skeleton, useToast } from '@chakra-ui/react';
import { useStore } from '@/app/stores/store.ts';
import ServiceCardItemSellComponent from '../Service/ServiceCardItemSellComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';
interface IProps {
  courtClusterId: number;
  isEdit?:boolean;
}
const BookingServicesTab = observer(({ courtClusterId, isEdit = false }: IProps) => {
  const { courtClusterStore } = useStore();
  const {
    loadingServicesPage,
    loadServicesOfCourtCluster,
    serviceOfCourtClusterArray,
    servicesOfClusterRegistry,
    serviceCourtClusterPageParams,
  } = courtClusterStore;
  const toast = useToast();

  return (
    <Box>
      <Heading as={'h5'} size={'md'} className={'mb-5'}>
        Danh sách dịch vụ của cụm sân
      </Heading>
      <Box className='h-[40rem] overflow-auto'>
        {!loadingServicesPage && (
          <Grid templateColumns={'repeat(2,1fr)'} gap={4} >
            {serviceOfCourtClusterArray.map((service) => (
              <ServiceCardItemSellComponent key={service.id} service={service} isEdit={isEdit} />
            ))}
            <Flex className="justify-end">
              <LoadMoreButtonAtoms
                loading={loadingServicesPage}
                hidden={
                  servicesOfClusterRegistry.size >= serviceCourtClusterPageParams.totalElement
                }
                handleOnClick={() => loadServicesOfCourtCluster(courtClusterId, toast)}
              />
            </Flex>
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
    </Box>
  );
});

export default BookingServicesTab;
