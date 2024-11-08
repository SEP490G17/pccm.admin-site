import React, { useCallback, useEffect, useState } from 'react';
import { Button, Flex, Box, useDisclosure, Center } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateBannerPage from './CreateBannerPage';
import { debounce } from 'lodash';
import BannerTableComponent from './components/BannerTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';

const BannerPage = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bannerStore } = useStore();
  const { loadBanners, bannerPageParams, bannerRegistry, loading, setLoadingInitial } = bannerStore;

  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLoadingInitial(true);
    bannerPageParams.clearLazyPage();
    bannerPageParams.searchTerm = '';
    loadBanners().finally(() => setLoadingInitial(false));
  }, []);
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      bannerPageParams.skip = bannerRegistry.size;
      if (bannerPageParams.totalElement > bannerRegistry.size) {
        loadBanners();
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
      await bannerStore.setSearchTerm(e.target.value);
    }, 500), // Debounce với thời gian 1 giây
    [],
  );

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPending(true); // Bật loading khi người dùng bắt đầu nhập
    await handleSearch(e); // Gọi hàm debounce
  };
  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách banner', to: '/banner' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
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
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
        </Box>
      </Flex>

      <BannerTableComponent />
      {bannerPageParams.totalElement > bannerRegistry.size && (
        <Flex justifyContent="end" alignItems="center" mb="1rem">
          <Button
            colorScheme="gray"
            isLoading={loading}
            onClick={() => {
              bannerPageParams.skip = bannerRegistry.size;
              loadBanners();
            }}
          >
            Xem thêm
          </Button>
        </Flex>
      )}
      <CreateBannerPage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default BannerPage;
