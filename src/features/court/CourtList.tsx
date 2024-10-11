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

const sampleCourtData = [
  {
    id: 1,
    name: 'Sân A',
    image: 'https://file.hstatic.net/1000341630/file/1_1799610e954e47d8a0aa43d0a70fe4fa.jpg',
    manager: 'Nguyễn Văn A',
    location: '123 Đường ABC',
    status: 'Hoạt động',
    createdAt: '2024-10-08',
  },
  {
    id: 2,
    name: 'Sân B',
    image: 'https://thethaokhoinguyen.com/wp-content/uploads/2024/07/san-Pickleball-tieu-chuan-thi-dau-quoc-te.jpg',
    manager: 'Trần Văn B',
    location: '456 Đường DEF',
    status: 'Tạm dừng',
    createdAt: '2024-10-08',
  },
  {
    id: 3,
    name: 'Sân C',
    image: 'https://www.thethaothientruong.vn/uploads/he-thong-anh-sang-san-Pickleball.jpg',
    manager: 'Lê Văn C',
    location: '789 Đường GHI',
    status: 'Hoạt động',
    createdAt: '2024-10-08',
  },
];

const PAGE_SIZE = 3;

const CourtList = observer(() => {
  const { courtStore } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sampleCourtData.length / PAGE_SIZE);
  const [filterOption, setFilterOption] = useState('name'); 

  useEffect(() => {
    courtStore.loadCourts = () => {
      courtStore.courts = sampleCourtData;
    };
    courtStore.loadCourts();
  }, [courtStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    courtStore.setSearchTerm(e.target.value, filterOption);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
    courtStore.setSearchTerm(courtStore.searchTerm, e.target.value); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedCourts = courtStore.filteredCourts.slice(
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
              href="Courts"
              className="prevPage"
              style={{
                color: window.location.pathname === '/Courts' ? '#0A3351' : 'inherit',
              }}
            >
              Danh sách cụm sân
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
        Danh sách cụm sân
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
            <option value="name">Tìm kiếm theo</option>
            <option value="manager">Người quản lý</option>
            <option value="location">Địa chỉ</option>
            <option value="status">Trạng thái</option>
          </Select>
        </Flex>

        <Button
          colorScheme="teal"
          size="md"
          onClick={courtStore.addCourt}
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
          Thêm cụm sân
        </Button>
      </Flex>

      <Table variant="simple" className="table-layout">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Ảnh đại diện</Th>
            <Th>Tên cụm sân</Th>
            <Th>Địa chỉ</Th>
            <Th>Người quản lý</Th>
            <Th>Trạng thái</Th>
            <Th>Ngày tạo</Th>
            <Th>Tùy chọn</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedCourts.map((court, index) => (
            <Tr key={court.id}>
              <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
              <Td>
                <Image src={court.image} alt={court.name} width='120px' objectFit="cover" borderRadius="8px" />
              </Td>
              <Td>{court.name}</Td>
              <Td>{court.location}</Td>
              <Td>{court.manager}</Td>
              <Td>{court.status}</Td>
              <Td>{court.createdAt}</Td>
              <Td>
                <IconButton icon={<FaEdit />} aria-label="Edit" colorScheme="teal" size="sm" mr={2} />
                <IconButton icon={<FaTrash />} aria-label="Delete" colorScheme="red" size="sm" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {paginatedCourts.length === 0 && courtStore.searchTerm && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Không tìm thấy cụm sân cần tìm
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

export default CourtList;
