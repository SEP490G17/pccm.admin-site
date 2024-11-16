import { useCallback, useEffect, useState } from 'react';
import { Flex, useDisclosure, Center, Heading } from '@chakra-ui/react';
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

const NewsPage = () => {
  const { newsStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loadNews, newsPageParams, setLoadingInitial, newsRegistry, loading, setSearchTerm } =
    newsStore;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLoadingInitial(true);
    newsPageParams.clearLazyPage();
    newsPageParams.searchTerm = '';
    loadNews().finally(() => setLoadingInitial(false));
  }, []);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      newsPageParams.skip = newsRegistry.size;
      if (newsPageParams.totalElement > newsRegistry.size) {
        loadNews();
      }
    }
  }, []);
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
            options={[
              { value: 0, label: 'Tất cả' },
              { value: 1, label: 'Hiển thị' },
              { value: 2, label: 'Không hiển thị' },
            ]}
            placeholder="Trạng thái"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
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
      </Flex>
      <NewsTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          newsPageParams.skip = newsRegistry.size;
          loadNews();
        }}
        hidden={newsRegistry.size >= newsPageParams.totalElement}
        loading={loading}
      />
      {/* <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Box display="flex" alignItems="center">
          Hiển thị
          <Select
            width="70px"
            height="35px"
            value={newsPageParams.pageSize}
            marginLeft="10px"
            marginRight="10px"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Select>
          tài liệu
        </Box>
      </Flex> */}
      <CreateNewsPage isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default observer(NewsPage);
