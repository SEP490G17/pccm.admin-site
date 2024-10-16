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
import { FaEdit, FaTrash, FaSearch, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';
import CreateBannerPage from './CreateBannerPage';

const BannerPage = observer(() => {
  const { bannerStore } = useStore();
  const {
    mockLoadBanners,
    bannerPageParams,
    setCurrentPage: setPage,
    bannerArray,
    setPageSize,
    loading
  } = bannerStore;
  useEffect(() => {
    mockLoadBanners();
  }, [mockLoadBanners]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    bannerStore.setSearchTerm(e.target.value);
  };
  // if (loading) return <>Loading ...</>;
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    mockLoadBanners();
  };

  const renderPaginationButtons = () => {
    const { pageIndex, totalPages } = bannerPageParams;
    const buttons = [];

    if (!totalPages || totalPages === 0) {
      return null;
    }

    // Nút về trang đầu tiên
    buttons.push(
      <IconButton
        key="first"
        aria-label="First Page"
        icon={<FaAngleDoubleLeft />}
        onClick={() => handlePageChange(1)}
        isDisabled={pageIndex === 1}
        mr={2}
      />
    );

    // Nút lùi 1 trang
    buttons.push(
      <IconButton
        key="previous"
        aria-label="Previous Page"
        icon={<FaAngleLeft />}
        onClick={() => handlePageChange(pageIndex - 1)}
        isDisabled={pageIndex === 1}
        mr={2}
      />
    );

    if (totalPages <= 3) {
      // Nếu tổng số trang ít hơn hoặc bằng 3, hiển thị tất cả các trang
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-button ${pageIndex === i ? 'active' : ''}`}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Nếu có nhiều hơn 3 trang, hiển thị trang đầu, trang hiện tại và trang cuối cùng với dấu "..."
      buttons.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`pagination-button ${pageIndex === 1 ? 'active' : ''}`}
        >
          1
        </Button>
      );
      if (pageIndex > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }

      if (pageIndex > 1 && pageIndex < totalPages) {
        buttons.push(
          <Button
            key={pageIndex}
            onClick={() => handlePageChange(pageIndex)}
            className="pagination-button active"
          >
            {pageIndex}
          </Button>
        );
      }

      if (pageIndex < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }

      buttons.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`pagination-button ${pageIndex === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </Button>
      );
    }

    buttons.push(
      <IconButton
        key="next"
        aria-label="Next Page"
        icon={<FaAngleRight />}
        onClick={() => handlePageChange(pageIndex + 1)}
        isDisabled={pageIndex === totalPages}
        ml={2}
      />
    );

    buttons.push(
      <IconButton
        key="last"
        aria-label="Last Page"
        icon={<FaAngleDoubleRight />}
        onClick={() => handlePageChange(totalPages)}
        isDisabled={pageIndex === totalPages}
        ml={2}
      />
    );

    return buttons;
  };
  return (
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms title={'Danh sách banner'} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select width="149px" height="35px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF" color="#03301F">
            <option value="all">Tất cả</option>
          </Select>

          <CreateBannerPage />

        </Flex>

        <Box textAlign="right">
          <Box color="#00423D" fontFamily="Roboto" fontSize="12px" mb="0.5rem">
            Tìm kiếm nâng cao
          </Box>

          <Flex padding="3px 10px" alignItems="center" gap="16px" borderRadius="4px" border="0.5px solid #ADADAD" background="#FFF">
            <Input placeholder="Nhập từ khóa tìm kiếm" onChange={handleSearch} border="none" height="30px" outline="none" />
            <Button>
              <FaSearch />
            </Button>
          </Flex>
        </Box>
      </Flex>

      <TableContainer bg={'white'} borderRadius={'8px'} border={'1px solid #000'} mb="1.5rem">
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

      {bannerArray.length === 0 && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách banner rỗng
        </Box>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb="1rem">

        <Box display="flex" alignItems="center">
          Hiển thị
          <Select
            width="70px"
            height="35px"
            value={bannerPageParams.pageSize}
            onChange={handlePageSizeChange}
            marginLeft="10px"
            marginRight="10px"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Select>
          tài liệu
        </Box>

        <Flex justifyContent={'flex-end'}>
          {renderPaginationButtons()}
        </Flex>
      </Flex>
    </Flex>
  );
});

export default BannerPage;
