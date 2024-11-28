import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Heading, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateNewsPage from './CreateNewsPage';
import NewsTableComponent from './components/NewsTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';
import Select from 'react-select';

const NewsPage = observer(() => {
  const { newsStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loadNews, newsPageParams, setLoadingInitial, newsRegistry, loading, setSearchTerm } =
    newsStore;
  const [isPending, setIsPending] = useState(false);
  const optionType = [
    { value: -1, label: 'Tất cả' },
    { value: 1, label: 'Hiển thị' },
    { value: 0, label: 'Không hiển thị' },
  ]

  const toast = useToast();

  useEffect(() => {
    if (newsRegistry.size <= 1) {
      setLoadingInitial(true);
      loadNews(toast).finally(() => setLoadingInitial(false));
    }
  }, [loadNews, setLoadingInitial, newsRegistry, toast]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      newsPageParams.skip = newsRegistry.size;
      if (newsPageParams.totalElement > newsRegistry.size) {
        loadNews(toast);
      }
    }
  }, [loadNews, newsPageParams, newsRegistry,toast]);
  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setSearchTerm(e.target.value,toast);
    }, 500);
  }, [setIsPending, setSearchTerm]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );
  // Gắn sự kiện cuộn
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Tin tức', to: '/tin-tuc' }]} />

      <Heading className="mb-4 mt-2">Danh sách tin tức</Heading>

      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            options={optionType}
            placeholder="Trạng thái"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await newsStore.setFilterTerm(e.value.toString(),toast);
              }
            }}
            defaultValue={{
              value: newsPageParams.filter ?? -1,
              label:
              optionType.find(option => option.value.toString() === newsPageParams.filter)?.label ?? 'Tất cả',
          }}
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms
            value={newsPageParams.searchTerm}
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
      <NewsTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          newsPageParams.skip = newsRegistry.size;
          loadNews(toast);
        }}
        hidden={newsRegistry.size >= newsPageParams.totalElement}
        loading={loading}
      />

      <CreateNewsPage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default NewsPage;
