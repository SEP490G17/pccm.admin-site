import { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Select, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateNewsPage from './CreateNewsPage';
import NewsTableComponent from './components/NewsTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';

const NewsPage = () => {
  const { newsStore } = useStore();
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
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách tin tức', to: '/tin-tuc' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            width="149px"
            height="35px"
            borderRadius="4px"
            border="1px solid #ADADAD"
            bg="#FFF"
            color="#03301F"
            onChange={console.log}
          >
            <option value="all">Tất cả</option>
          </Select>
          <CreateNewsPage></CreateNewsPage>
        </Flex>

        <Box textAlign="right">
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
        </Box>
      </Flex>
      <NewsTableComponent />
      {newsPageParams.totalElement > newsRegistry.size && (
        <Flex justifyContent="end" alignItems="center" mb="1rem">
          <Button
            colorScheme="gray"
            isLoading={loading}
            onClick={() => {
              newsPageParams.skip = newsRegistry.size;
              loadNews();
            }}
          >
            Xem thêm
          </Button>
        </Flex>
      )}
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
    </Flex>
  );
};

export default observer(NewsPage);
