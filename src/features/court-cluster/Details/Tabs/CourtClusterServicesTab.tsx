import { observer } from 'mobx-react-lite';
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useStore } from '@/app/stores/store.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceCardItemComponent from '@/features/court-cluster/Details/components/ServiceTab/ServiceCardItemComponent';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import CreateServicePage from '@/features/service/CreateServicePage';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

const CourtClusterServicesTab = observer(() => {
  const { courtClusterStore, commonStore } = useStore();
  const toast = useToast();
  const {
    loadingServicesPage,
    loadServicesOfCourtCluster,
    serviceOfCourtClusterArray,
    selectedCourtCluster,
    serviceCourtClusterPageParams,
    setServiceSearchTemp,
    servicesOfClusterRegistry,
    loadingIntitialServicePage,
    setLoadingInitialServicePage,
  } = courtClusterStore;
  if (!selectedCourtCluster) return;
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setLoadingInitialServicePage(true);
    loadServicesOfCourtCluster(selectedCourtCluster.id, toast).then(() =>
      setLoadingInitialServicePage(false),
    );
  }, [selectedCourtCluster, loadServicesOfCourtCluster, toast, setLoadingInitialServicePage]);

  const [isPending, setIsPending] = useState(false);

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setServiceSearchTemp(e.target.value, selectedCourtCluster.id, toast);
    }, 500);
  }, [setIsPending, toast, setServiceSearchTemp, selectedCourtCluster]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  return (
    <Box>
      <Heading as={'h5'} size={'md'} className={'mb-5'}>
        Danh sách dịch vụ của cụm sân
      </Heading>
      <Flex className="w-full justify-end mb-10">
        <Flex flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms
            value={serviceCourtClusterPageParams.searchTerm}
            isPending={isPending}
            handleChange={onSearchChange}
          />
          {commonStore.isEditSuppliesAble() && (
            <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
              <Center gap={1}>
                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                Thêm mới
              </Center>
            </ButtonPrimaryAtoms>
          )}
        </Flex>
      </Flex>

      {!loadingIntitialServicePage && (
        <>
          <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
            {serviceOfCourtClusterArray.map((service) => (
              <ServiceCardItemComponent key={service.id} service={service} />
            ))}
          </Grid>
          <Flex className="float-end">
            <LoadMoreButtonAtoms
              hidden={servicesOfClusterRegistry.size >= serviceCourtClusterPageParams.totalElement}
              loading={loadingServicesPage}
              handleOnClick={() => {
                loadServicesOfCourtCluster(selectedCourtCluster.id, toast);
              }}
            />
          </Flex>
        </>
      )}
      {loadingServicesPage && (
        <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
          {Array.from({ length: 6 }, (_, index) => (
            <GridItem key={index}>
              <Skeleton height="11rem" />
            </GridItem>
          ))}
        </Grid>
      )}
      <CreateServicePage
        isOpen={isOpen}
        onClose={onClose}
        selectedCourtClusterId={selectedCourtCluster.id}
      />
    </Box>
  );
});

export default CourtClusterServicesTab;
