import React, { useEffect, useState } from 'react';
import { Flex, Box, Center, Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store.ts';
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CourtClusterTableComponent from '@/features/court-cluster/components/CourtClusterTableComponent.tsx';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';

const CourtClusterPage = observer(() => {
  const { courtClusterStore } = useStore();
  const { loadCourtsCluster } = courtClusterStore;

  useEffect(() => {
    if (courtClusterStore.courtClusterRegistry.size == 0) {
      loadCourtsCluster();
    }
  }, [courtClusterStore.courtClusterRegistry.size,loadCourtsCluster]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    courtClusterStore.setSearchTerm(e.target.value);
  };
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Cụm sân', to: '/cum-san' }]} />
      <Heading className="mb-4 mt-2">Danh sách cụm sân</Heading>

      <Flex width="100%" justifyContent="end" alignItems="flex-end" mb="1.5rem">
        <Box textAlign="right">
          <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
            <InputSearchBoxAtoms handleChange={handleSearch} isPending={isPending} />
            <ButtonPrimaryAtoms
              className="bg-primary-900"
              handleOnClick={() => router.navigate('/cum-san/tao')}
              children={
                <Center gap={1}>
                  <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                  Thêm mới
                </Center>
              }
            />
          </Flex>
        </Box>
      </Flex>
      <CourtClusterTableComponent />
    </>
  );
});

export default CourtClusterPage;
