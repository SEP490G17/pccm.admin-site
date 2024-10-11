import React, { useEffect, useState } from 'react';
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
  Heading,
  Image,
  Box,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  Center,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './style.scss';

const sampleNewsData = [
  {
    id: 1,
    title: 'BuiQuocTruong',
    image: 'https://pickleball.vn/uploads/images/86/thumbs/vot-pickleball-joola-1_500x330xcrop.webp',
    author: 'Admin',
    category: 'Pickerball',
    status: 'Hiển thị',
    date: '2024-10-08',
  },
  {
    id: 2,
    title: 'BuiQuocTruong2',
    image: 'https://pickleball.vn/uploads/images/1333/thumbs/agassi-x-joola_500x330xcrop.webp',
    author: 'Admin',
    category: 'Pickerball',
    status: 'Hiển thị',
    date: '2024-10-08',
  },
  {
    id: 3,
    title: 'BuiQuocTruong3',
    image: 'https://static-images.vnncdn.net/vps_images_publish/000001/000003/2024/8/20/vi-sao-mon-the-thao-moi-la-pickleball-gay-sot-o-viet-nam-1446.jpg?width=0&s=dNftsakz0pqo_apdJxiUoA',
    author: 'Admin',
    category: 'Pickerball',
    status: 'Hiển thị',
    date: '2024-10-08',
  },
  {
    id: 4,
    title: 'BuiQuocTruong4',
    image: 'https://via.placeholder.com/100',
    author: 'Admin',
    category: 'Pickerball',
    status: 'Hiển thị',
    date: '2024-10-08',
  },
];

const PAGE_SIZE = 3;

const NewsList = observer(() => {
  const { newsStore } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sampleNewsData.length / PAGE_SIZE);
  const [filterOption, setFilterOption] = useState('title'); 

  useEffect(() => {
    newsStore.loadNews = () => {
      newsStore.news = sampleNewsData;
    };
    newsStore.loadNews();
  }, [newsStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    newsStore.setSearchTerm(e.target.value, filterOption);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
    newsStore.setSearchTerm(newsStore.searchTerm, e.target.value); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedNews = newsStore.filteredNews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );


  return (
    <Flex direction="column" p={8} bg="#F4F4F4" borderRadius="12px" mx="30px">
 <div className="linkPage" style={{ marginBottom: '16px' }}>
        <Breadcrumb separator="/">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="prevPage">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href="News"
              className="prevPage"
              style={{
                color: window.location.pathname === '/News' ? '#0A3351' : 'inherit',
              }}
            >
              Danh sách tin tức
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <Heading
        as="h2"
        size="md"
        mb="16px" 
        sx={{
          display: 'inline-flex',
          padding: '10px 0px',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--Prussian-Blue-950, #0A3351)',
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: 'normal',
        }}
      >
        Danh sách tin tức
      </Heading>

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
            onChange={handleFilterChange}
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

        <Button
          colorScheme="teal"
          size="md"
          onClick={newsStore.addNews}
          sx={{
            display: 'flex',
            width: '182px',
            height: '40px',
            padding: '10.078px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10.078px',
            borderRadius: '8.063px',
            background: '#00423D',
            color: '#FFF',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: 'normal',
          }}
        >
          Thêm bài viết
        </Button>
      </Flex>

      <Table variant="simple" className="table-layout">
  <Thead>
    <Tr>
      <Th>STT</Th>
      <Th>Ảnh đại diện</Th>
      <Th>Tiêu đề bài viết</Th>
      <Th>Danh mục</Th>
      <Th>Người đăng</Th>
      <Th>Trạng thái</Th>
      <Th>Ngày đăng bài</Th>
      <Th>Tùy chọn</Th>
    </Tr>
  </Thead>
  <Tbody>
    {paginatedNews.map((news, index) => (
      <Tr key={news.id}>
        <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
        <Td>
          <Image src={news.image} alt={news.title} width="120px" objectFit="cover" borderRadius="8px" />
        </Td>
        <Td>{news.title}</Td>
        <Td>{news.category}</Td>
        <Td>{news.author}</Td>
        <Td>{news.status}</Td>
        <Td>{news.date}</Td>
        <Td>
          <IconButton icon={<FaEdit />} aria-label="Edit" colorScheme="teal" size="sm" mr={2} />
          <IconButton icon={<FaTrash />} aria-label="Delete" colorScheme="red" size="sm" />
        </Td>
      </Tr>
    ))}
  </Tbody>
</Table>
{paginatedNews.length === 0 && newsStore.searchTerm && (
      <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
        Không tìm thấy tin tức cần tìm
      </Box>
    )}
      <Flex mt={6} justify="center" align="center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
});

export default NewsList;
