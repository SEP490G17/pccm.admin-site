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
import { router } from '@/app/router/Routes';

const CourtsPage = observer(() => {
  const { courtStore } = useStore();
  const { courtArray, mockLoadCourts, pageParams, setSearchTerm, setPageNumber } = courtStore;

  useEffect(() => {
    mockLoadCourts();
  }, [mockLoadCourts]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
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
            // onChange={handleFilterChange}
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
          onClick={() => router.navigate('/cum-san/tao')}
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
          {courtArray.map((court, index) => (
            <Tr key={court.id}>
              <Td>{(pageParams.pageIndex - 1) * pageParams.pageSize + index + 1}</Td>
              <Td>
                <Image
                  src={court.image}
                  alt={court.name}
                  width="120px"
                  objectFit="cover"
                  borderRadius="8px"
                />
              </Td>
              <Td>{court.name}</Td>
              <Td>{court.location}</Td>
              <Td>{court.manager}</Td>
              <Td>{court.status}</Td>
              <Td>{court.createdAt}</Td>
              <Td>
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit"
                  colorScheme="teal"
                  size="sm"
                  mr={2}
                />
                <IconButton icon={<FaTrash />} aria-label="Delete" colorScheme="red" size="sm" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {courtArray.length === 0 && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Không tìm thấy cụm sân cần tìm
        </Box>
      )}

      <Flex mt={6} justify="center" align="center">
        {Array.from({ length: pageParams.totalPages! }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => setPageNumber(index + 1)}
            className={`pagination-button ${pageParams.pageIndex === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
});

export default CourtsPage;
