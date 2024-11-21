import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Flex, useDisclosure, Center, Heading } from '@chakra-ui/react';
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
import Select from 'react-select';

const BannerPage = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bannerStore } = useStore();
  const { loadBanners, bannerPageParams, bannerRegistry, loading, setLoadingInitial } = bannerStore;

  const [isPending, setIsPending] = useState(false);
  const optionStatus = [
    { value: -1, label: 'Tất cả' },
    { value: 1, label: 'Hiển thị' },
    { value: 0, label: 'Không hiển thị' },
  ]
  const optionType = [
    { value: -1, label: 'Tất cả' },
    { value: 0, label: 'Banner' },
    { value: 1, label: 'Sự kiện' },
  ]
  useEffect(() => {
    if (bannerRegistry.size <= 1) {
      setLoadingInitial(true);
      loadBanners().finally(() => setLoadingInitial(false));
    }
  }, [bannerRegistry, setLoadingInitial, loadBanners]);

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
  }, [loadBanners, bannerPageParams, bannerRegistry]);

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
      await bannerStore.setSearchTerm(e.target.value);
    }, 500);
  }, [setIsPending, bannerStore]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Banner', to: '/banner' }]} />

      <Heading className="mb-4 mt-2">Danh sách banner</Heading>

      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex alignItems="center" gap={30}>
          <Select
            options={optionType}
            placeholder="Thể loại"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await bannerStore.setCategoryTerm(e.value.toString());
              }
            }}
            defaultValue={{
              value: bannerPageParams.category ?? -1,
              label:
                optionType.find(option => option.value.toString() === bannerPageParams.status)?.label ?? 'Tất cả',
            }}
          ></Select>
          <Select
            options={optionStatus}
            placeholder="Trạng thái"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await bannerStore.setStatusTerm(e.value.toString());
              }
            }}
            defaultValue={{
              value: bannerPageParams.status ?? -1,
              label:
                optionStatus.find(option => option.value.toString() === bannerPageParams.status)?.label ?? 'Tất cả',
            }}
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms
            value={bannerPageParams.searchTerm}
            handleChange={onSearchChange}
            isPending={isPending}
          />
          <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
            <Center gap={1}>
              <PlusIcon color="white" height="1.5rem" width="1.5rem" />
              Thêm mới
            </Center>
          </ButtonPrimaryAtoms>
        </Flex>
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
