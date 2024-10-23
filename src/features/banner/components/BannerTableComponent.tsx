import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  Box,
  Center,
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
import { observer } from 'mobx-react-lite';
import { getBannerStatus } from '@/app/models/banner.model';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import { toast } from 'react-toastify';
import UpdateBannerPage from '../UpdateBannerPage';

const BannerTableComponent = () => {
  const { bannerStore } = useStore();
  const { loading, loadingInitial, bannerArray, bannerPageParams, deleteBanner } = bannerStore;
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className='app-table' variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'10rem'}>Ảnh</Th>
              <Th w={'10rem'}>Tên banner</Th>
              <Th w={'10rem'}>Mô tả</Th>
              <Th w={'15rem'}>Khoảng ngày</Th>
              <Th w={'10rem'}>Link</Th>
              <Th w={'8rem'}>Trạng thái</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={7} pageSize={bannerPageParams.pageSize} />
            )}
            {!loadingInitial &&
              bannerArray.map((banner, index) => (
                <Tr key={banner.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      width="10rem"
                      borderRadius={'8px'}
                    />
                  </Td>
                  <Td>{banner.title}</Td>
                  <Td>{banner.description}</Td>
                  <Td>
                    Từ ngày: {banner.startDate}
                    <br />
                    Đến ngày: {banner.endDate}
                  </Td>
                  <Td>{banner.linkUrl}</Td>
                  <Td>
                    <Center>
                      <Switch isChecked={getBannerStatus(banner.status)} />
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      <UpdateBannerPage/>
                      <DeleteButtonAtom name={banner.title} loading={loading} header='Xóa banner' onDelete={async () => {
                        try {
                          await deleteBanner(banner.id).then(
                            () => {
                              toast.success("Xóa thành công")
                            }
                          );
                        } catch (error) {
                          console.error("Error deleting news:", error);
                          toast.error("Xóa thất bại")
                        }
                      }} />
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
