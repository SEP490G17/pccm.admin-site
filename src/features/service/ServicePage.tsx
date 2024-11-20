import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import ServiceTableComponent from './components/ServiceTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import CreateServicePage from './CreateServicePage';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';
import Select from 'react-select';

const ServicePage = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { serviceStore, courtClusterStore } = useStore();

  const { loadServices, servicePageParams, serviceRegistry, setLoadingInitial, loading } =
    serviceStore;
  const [isPending, setIsPending] = useState(false);
  const { courtClusterListAllOptions, courtClusterListAllRegistry } = courtClusterStore;

  useEffect(() => {
    if (serviceRegistry.size <= 1) {
      setLoadingInitial(true);
      loadServices().finally(() => setLoadingInitial(false));
    }
  }, [setLoadingInitial, servicePageParams, loadServices,serviceRegistry]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      servicePageParams.skip = serviceRegistry.size;
      if (servicePageParams.totalElement > serviceRegistry.size) {
        loadServices();
      }
    }
  }, [loadServices, servicePageParams, serviceRegistry]);

  // Gắn sự kiện cuộn
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await serviceStore.setSearchTerm(e.target.value);
    }, 500);
  }, [setIsPending, serviceStore]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Dịch vụ', to: '/dich-vu' }]} />
      <Heading className="mb-4 mt-2">Danh sách dịch vụ</Heading>

      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex alignItems="center">
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
            placeholder="Cụm sân"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await serviceStore.setFilterTerm(e.value.toString());
              }
            }}
            defaultValue={{
              value: Number(servicePageParams.filter??0),
              label: courtClusterListAllRegistry.get(Number(servicePageParams.filter))?.courtClusterName??"Tất cả",
            }}
            isSearchable={true}
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms
            value={servicePageParams.searchTerm}
            isPending={isPending}
            handleChange={onSearchChange}
          />
          <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
            <Center gap={1}>
              <PlusIcon color="white" height="1.5rem" width="1.5rem" />
              Thêm mới
            </Center>
          </ButtonPrimaryAtoms>
        </Flex>
      </Flex>
      <ServiceTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          servicePageParams.skip = serviceRegistry.size;
          loadServices();
        }}
        hidden={serviceRegistry.size > servicePageParams.totalElement}
        loading={loading}
      />
      <CreateServicePage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ServicePage;
