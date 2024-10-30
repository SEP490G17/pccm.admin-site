import { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Button, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateNewsPage from './CreateNewsPage';
import NewsTableComponent from './components/NewsTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import { FaEdit } from 'react-icons/fa';

const NewsPage = () => {
  const { newsStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loadNews, newsPageParams, setLoadingInitial, newsRegistry, loading, setSearchTerm } =
    newsStore;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLoadingInitial(true);
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
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách tin tức', to: '/tin-tuc' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={onOpen}>
            Thêm mới
          </Button>
        </Flex>

        <Box textAlign="right">
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
        </Box>
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
