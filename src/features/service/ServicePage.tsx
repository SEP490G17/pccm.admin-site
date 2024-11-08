import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Box, useDisclosure, Center } from '@chakra-ui/react';
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

  const {
    loadServices,
    servicePageParams,
    serviceRegistry,
    setSearchTerm,
    setLoadingInitial,
    loading,
  } = serviceStore;
  const [isPending, setIsPending] = useState(false);
  const { courtClusterListAllOptions } = courtClusterStore;

  useEffect(() => {
    setLoadingInitial(true);
    servicePageParams.clearLazyPage();
    servicePageParams.searchTerm = '';
    loadServices().finally(() => setLoadingInitial(false));
  }, []);

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
  }, []);

  // Gắn sự kiện cuộn
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleSearch = useCallback(
    debounce(async (e) => {
      setIsPending(false); // Bật loading khi người dùng bắt đầu nhập
      await serviceStore.setSearchTerm(e.target.value);
    }, 500), // Debounce với thời gian 1 giây
    [],
  );

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPending(true); // Bật loading khi người dùng bắt đầu nhập
    await handleSearch(e); // Gọi hàm debounce
  };

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách dịch vụ', to: '/dich-vu' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
            placeholder="Cụm sân"
            className="w-56 p-2 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await serviceStore.setFilterTerm(e.value.toString());
              }
            }}
            isSearchable={true}
          ></Select>

          <ButtonPrimaryAtoms
            className="bg-primary-900"
            handleOnClick={onOpen}
            children={
              <Center gap={1}>
                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                Thêm mới
              </Center>
            }
          />
        </Flex>

        <Box textAlign="right">
          <InputSearchBoxAtoms isPending={isPending} handleChange={onSearchChange} />
        </Box>
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
