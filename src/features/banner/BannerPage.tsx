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
import CreateBannerPage from './CreateBannerPage';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';

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
  // if (loading) return <>Loading ...</>;
  return (
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms title={'Danh sách banner'} />
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
        <CreateBannerPage />
      </Flex>

      <TableContainer bg={'white'} borderRadius={'8px'} border={'1px solid #000'}>
        <Table variant="simple" cellPadding={'1rem'}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ảnh
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tên banner
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Mô tả
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Khoảng ngày
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Trạng thái
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Link
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={bannerPageParams.pageSize} />
            ) : (
              bannerArray.map((banner, index) => (
                <Tr key={banner.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {(bannerPageParams.pageIndex - 1) * bannerPageParams.pageSize + index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Image src={banner.imageUrl} alt={banner.title} width="120px" />
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {banner.title}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {banner.description}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
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
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {banner.status}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {banner.link}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'}>
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
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {bannerArray.length === 0 && !loading &&  (
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
