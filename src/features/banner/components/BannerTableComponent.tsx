import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  Box,
  Center,
  IconButton,
  Image,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getBannerStatus } from '@/app/models/banner.model';

const BannerTableComponent = () => {
  const { bannerStore } = useStore();
  const { loading, loadingInitial, bannerArray, bannerPageParams } = bannerStore;
  return (
    <>
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
                Link
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Trạng thái
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={7} pageSize={bannerPageParams.pageSize} />
            )}
            {!loadingInitial && bannerArray.map((banner, index) => (
              <Tr key={banner.id}>
                <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                  {index + 1}
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
                  {banner.linkUrl}
                </Td>
                <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                  <Center>
                    <Switch isChecked={getBannerStatus(banner.status)} />
                  </Center>
                </Td>
                <Td borderBottom={'0.923px solid #BDBDBD'}>
                  <Center>
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
                  </Center>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {bannerArray.length === 0 && !loading && !loadingInitial && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách banner rỗng
        </Box>
      )}
      {loading && !loadingInitial && (
        <Spinner
          thickness="0.2rem"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.800"
          size="lg"
        />
      )}
    </>
  );
};

export default observer(BannerTableComponent);
