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

const BannerPage = observer(() => {
  const { bannerStore } = useStore();
  const { mockLoadBanners, bannerPageParams, setPageIndex, bannerArray, loading } = bannerStore;
  useEffect(() => {
    mockLoadBanners();
  }, [mockLoadBanners]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    bannerStore.setSearchTerm(e.target.value);
  };
  if (loading) return <>Loading ...</>;
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
          // onClick={bannerStore.addBanner}
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
          {bannerArray.map((banner, index) => (
            <Tr key={banner.id}>
              <Td>{(bannerPageParams.pageIndex - 1) * bannerPageParams.pageSize + index + 1}</Td>
              <Td>
                <Image src={banner.imageUrl} alt={banner.title} width="120px" />
              </Td>
              <Td>{banner.title}</Td>
              <Td>{banner.description}</Td>
              <Td>
                Từ ngày:{' '}
                {new Date(banner.startDate).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                <br />
                Đến ngày:{' '}
                {new Date(banner.endDate).toLocaleString('vi-VN', {
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
                <IconButton
                  key={`edit-banner${banner.id}`}
                  icon={<FaEdit />}
                  aria-label="Edit"
                  colorScheme="teal"
                  size="sm"
                  mr={2}
                />
                <IconButton
                  key={`delete-banner${banner.id}`}
                  icon={<FaTrash />}
                  aria-label="Delete"
                  colorScheme="red"
                  size="sm"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {bannerArray.length === 0 && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách banner rỗng
        </Box>
      )}

      <Flex mt={6} justify="center" align="center">
        {Array.from({ length: bannerPageParams.totalPages ?? 1 }, (_, index) => (
          <Button
            key={`paginatrion-button-${index + 1}`}
            className={`pagination-button ${bannerPageParams.pageIndex === index + 1 ? 'active' : ''}`}
            onClick={() => setPageIndex(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
});

export default BannerPage;
