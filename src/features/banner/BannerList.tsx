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
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './style.scss';

const sampleBannerData = [
  {
    id: 1,
    title: 'Banner 1',
    imageUrl: 'https://img.freepik.com/free-psd/flat-design-paddle-tennis-lessons-banner-template_23-2149274132.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1727827200&semt=ais_hybrid',
    description: 'Mô tả banner 1',
    startDate: '2024-10-10T20:00:00',
    endDate: '2024-10-11T20:00:00',
    status: 'Hiển thị',
    link: 'https://example.com',
  },
  {
    id: 2,
    title: 'Banner 2',
    imageUrl: 'https://img.freepik.com/free-psd/flat-design-paddle-tennis-lessons-banner-template_23-2149274130.jpg',
    description: 'Mô tả banner 2',
    startDate: '2024-10-11T08:00:00',
    endDate: '2024-10-12T08:00:00',
    status: 'Ẩn',
    link: 'https://example.com',
  },
];

const PAGE_SIZE = 3;

const BannerList = observer(() => {
  const { bannerStore } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sampleBannerData.length / PAGE_SIZE);
  const [filterOption, setFilterOption] = useState('title');

  useEffect(() => {
    bannerStore.loadBanners = () => {
      bannerStore.banners = sampleBannerData;
    };
    bannerStore.loadBanners();
  }, [bannerStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    bannerStore.setSearchTerm(e.target.value, filterOption);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
    bannerStore.setSearchTerm(bannerStore.searchTerm, e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedBanners = bannerStore.filteredBanners.slice(
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
              href="banner"
              className="prevPage"
              style={{
                color: window.location.pathname === '/banner' ? '#0A3351' : 'inherit',
              }}
            >
              Danh sách banner
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
        Danh sách banner
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
            <option value="description">Mô tả</option>
            <option value="status">Trạng thái</option>
            <option value="startDate">Ngày bắt đầu</option>
          </Select>
        </Flex>

        <Button
          colorScheme="teal"
          size="md"
          onClick={bannerStore.addBanner}
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
          Thêm banner
        </Button>
      </Flex>

      <Table variant="simple" className="table-layout">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Ảnh</Th>
            <Th>Tên banner</Th>
            <Th>Mô tả</Th>
            <Th>Khoảng ngày</Th>
            <Th>Trạng thái</Th>
            <Th>Link</Th>
            <Th>Tùy chọn</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedBanners.map((banner, index) => (
            <Tr key={banner.id}>
              <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
              <Td>
                <Image src={banner.imageUrl} alt={banner.title} width='120px' />
              </Td>
              <Td>{banner.title}</Td>
              <Td>{banner.description}</Td>
              <Td>
          Từ ngày: {new Date(banner.startDate).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
          <br />
          Đến ngày: {new Date(banner.endDate).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Td>
              <Td>{banner.status}</Td>
              <Td>{banner.link}</Td>
              <Td>
                <IconButton icon={<FaEdit />} aria-label="Edit" colorScheme="teal" size="sm" mr={2} />
                <IconButton icon={<FaTrash />} aria-label="Delete" colorScheme="red" size="sm" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {paginatedBanners.length === 0 && bannerStore.searchTerm && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Không tìm thấy banner cần tìm
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

export default BannerList;
