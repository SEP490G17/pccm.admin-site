import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Box, Center, Heading, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store.ts';
import '../style.scss';
import { router } from '@/app/router/Routes';
import CourtClusterTableComponent from '@/features/court-cluster/List/components/CourtClusterTableComponent';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import { debounce } from 'lodash';

const CourtClusterPage = observer(() => {
  const { courtClusterStore, commonStore } = useStore();
  const { loadCourtsCluster, courtPageParams } = courtClusterStore;
  const toast = useToast();

  useEffect(() => {
    if (courtClusterStore.courtClusterRegistry.size == 0) {
      loadCourtsCluster(toast);
    }
  }, [courtClusterStore.courtClusterRegistry.size, loadCourtsCluster, toast]);
  const [isPending, setIsPending] = useState(false);
  const handleSearchDebounced = useMemo(() => {
    return debounce((e) => {
      setIsPending(false); // Tắt loading
      courtClusterStore.setSearchTerm(e.target.value, toast);
    }, 500);
  }, [setIsPending, courtClusterStore, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Cụm sân', to: '/cum-san' }]} />
      <Heading className="mb-4 mt-2">Danh sách cụm sân</Heading>

      <Flex width="100%" justifyContent="end" alignItems="flex-end" mb="1.5rem">
        <Box textAlign="right">
          <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
            <InputSearchBoxAtoms
              value={courtPageParams.searchTerm}
              handleChange={onSearchChange}
              isPending={isPending}
            />

            {commonStore.isEditClusterAble() && (
              <ButtonPrimaryAtoms
                className="bg-primary-900"
                handleOnClick={() => router.navigate('/cum-san/tao')}
              >
                <Center gap={1}>
                  <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                  Thêm mới
                </Center>
              </ButtonPrimaryAtoms>
            )}
          </Flex>
        </Box>
      </Flex>
      <CourtClusterTableComponent />
    </>
  );
});

export default CourtClusterPage;
