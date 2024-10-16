import React, { useEffect } from 'react';
import {
  Button,
  Flex,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Box,
  IconButton,
  Select,
  TableContainer,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';
import CreateServicePage from '../service/CreateServicePage';

const NewsPage = observer(() => {
  const { newsStore } = useStore();
  const {
    loadMockNews,
    newsArray,
    setCurrentPage: setPage,
    newsPageParams: pageParams,
    loading,
  } = newsStore;
  useEffect(() => {
    loadMockNews();
  }, [loadMockNews]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    newsStore.setSearchTerm(e.target.value);
  };

  // const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setFilterOption(e.target.value);
  //   newsStore.setSearchTerm(newsStore.searchTerm, e.target.value);
  // };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <Flex direction="column" p={8} bg="#F4F4F4" borderRadius="12px" mx="30px">
      <PageHeadingAtoms title={'Danh sách tin tức'} />
      <Flex justifyContent="space-between" alignItems="center" mb="50px">
        <Flex gap="16px">
          <Input
            placeholder="Nhập từ khóa tìm kiếm"
            onChange={handleSearch}
            width="380px"
            height="40px"
            borderRadius="12px"
            padding="4px 16px"
            bg="white"
            sx={{
              color: '#333',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: 'normal',
              marginRight: '10px',
              border: '0.5px solid rgba(51, 51, 51, 0.30)',
            }}
          />

          <Select
            width="201px"
            height="40px"
            borderRadius="12px"
            padding=""
            bg="white"
            border="0.5px solid rgba(51, 51, 51, 0.30)"
            sx={{
              color: '#333',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: 'normal',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <option value="title">Tìm kiếm theo</option>
            <option value="author">Người đăng</option>
            <option value="category">Danh mục</option>
            <option value="status">Trạng thái</option>
            <option value="date">Ngày đăng</option>
          </Select>
        </Flex>

        <CreateServicePage/>
      </Flex>

      <TableContainer bg={'white'} borderRadius={'8px'} padding={0} border={'1px solid #000'}>
        <Table variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ảnh đại diện
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tiêu đề bài viết
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Danh mục
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Người đăng
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Trạng thái
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ngày đăng bài
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={pageParams.pageSize} />
            ) : (
              newsArray.map((news, index) => (
                <Tr key={news.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {(pageParams.pageIndex - 1) * pageParams.pageSize + index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      width="120px"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.title}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.category}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.author}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.status}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.date}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit"
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      colorScheme="red"
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {newsArray.length === 0 && !loading &&  (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}
      <Flex mt={6} justify="center" align="center">
        {Array.from({ length: pageParams.totalPages! }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${pageParams.pageIndex === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
});

export default NewsPage;
