import React, { useCallback, useEffect, useState } from 'react';
import { Button, Flex, Box, Select, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit } from 'react-icons/fa';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import ServiceTableComponent from './components/ServiceTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import CreateServicePage from './CreateServicePage';

const ServicePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { serviceStore } = useStore();
  const { loadServices, servicePageParams, serviceRegistry, setSearchTerm, setLoadingInitial, loading } =
    serviceStore;
  const [isPending, setIsPending] = useState(false);


  useEffect(() => {
    setLoadingInitial(true);
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
      await setSearchTerm(e.target.value);
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
            width="9rem"
            height="2.1rem"
            borderRadius="4px"
            borderColor={'teal'}
            bg="#FFF"
            color="#03301F"
          >
            <option value="all">Tất cả</option>
          </Select>

          <Button
            colorScheme="teal"
            size="md"
            variant={'outline'}
            leftIcon={<FaEdit />}
            width="9rem"
            height="2.1rem"
            background="#FFF"
            onClick={onOpen}
          >
            Thêm mới
          </Button>
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
};

export default observer(ServicePage);
