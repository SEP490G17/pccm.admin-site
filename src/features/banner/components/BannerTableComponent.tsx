import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  Box,
  Flex,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import UpdateBannerPage from '../UpdateBannerPage';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';
import { useEffect, useMemo, useState } from 'react';

const BannerTableComponent = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bannerStore } = useStore();
  const toast = useToast();
  const { loading, loadingInitial, bannerArray, bannerPageParams, deleteBanner } = bannerStore;
  const handleOpenEdit = async (id: number) => {
    onOpen();
    await bannerStore.detailBanner(id, toast);
  };
  const [localStatuses, setLocalStatuses] = useState<LocalStatuses>({});
  interface LocalStatuses {
    [key: number]: number;
  }

  useMemo(() => {
    return bannerArray.reduce((acc, banner) => {
      acc[banner.id] = banner.status;
      return acc;
    }, {} as LocalStatuses);
  }, [bannerArray]);

  useEffect(() => {
    setLocalStatuses((prevStatuses) => {
      const bannerStatuses = { ...prevStatuses };
      for (const banner of bannerArray) {
        if (!(banner.id in prevStatuses)) {
          bannerStatuses[banner.id] = banner.status;
        }
      }
      return bannerStatuses;
    });
  }, [bannerArray]);

  const handleChangeStatus = async (id: number, currentStatus: number) => {
    const bannerStatus = currentStatus === 1 ? 0 : 1;
    setLocalStatuses((prevStatuses) => ({ ...prevStatuses, [id]: bannerStatus }));
    await bannerStore.changeStatus(id, bannerStatus, toast).then((data) => {
      if (data.err) {
        setLocalStatuses((prevStatuses) => ({ ...prevStatuses, [id]: currentStatus }));
      }
    });
  };

  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'10rem'}>Ảnh</Th>
              <Th w={'10rem'}>Tên banner</Th>
              <Th w={'10rem'}>Mô tả</Th>
              <Th w={'15rem'}>Khoảng ngày</Th>
              <Th w={'8rem'}>Trạng thái</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={6} pageSize={bannerPageParams.pageSize} />
            )}
            {!loadingInitial &&
              bannerArray.map((banner, index) => (
                <Tr key={banner.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <LazyImageAtom
                      src={banner.imageUrl}
                      alt={banner.title}
                      width="10rem"
                      borderRadius={'8px'}
                    />
                  </Td>
                  <Td>
                    <Box whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                      {banner.title}
                    </Box>
                  </Td>
                  <Td>
                    <Box whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                      {banner.description}
                    </Box>
                  </Td>
                  <Td>
                    Từ ngày: {banner.startDate}
                    <br />
                    <br />
                    Đến ngày: {banner.endDate}
                  </Td>
                  <Td>
                    <Switch
                      isChecked={localStatuses[banner.id] === 1}
                      isDisabled={bannerStore.isLoading(banner.id)}
                      onChange={() => {
                        handleChangeStatus(banner.id, localStatuses[banner.id]);
                      }}
                    />
                  </Td>
                  <Td>
                    <Flex gap="3">
                      <EditButtonAtom onUpdate={async () => handleOpenEdit(banner.id)} />

                      <DeleteButtonAtom
                        buttonSize="sm"
                        name={banner.title}
                        loading={loading}
                        header="Xóa banner"
                        buttonClassName="gap-2"
                        onDelete={async () => {
                          await deleteBanner(banner.id, toast);
                        }}
                      />
                    </Flex>
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
      <UpdateBannerPage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default BannerTableComponent;
