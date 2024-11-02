import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  Badge,
  Box,
  Flex,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import UpdateNewsPage from '../UpdateNewsPage';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import { toast } from "react-toastify";
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';

const NewsTableComponent = observer(() => {
  const { newsStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { newsPageParams, newsArray, loading, loadingInitial, deleteNews, detailNews } = newsStore;

  const handleChangeStatus = async (id: number, currentStatus: number) => {
    await newsStore.changeStatus(id, currentStatus == 1 ? 0 : 1);
  };

  const handleOpenEdit = async (id: number) => {
    onOpen();
    await detailNews(id);
  }

  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'10rem'}>Ảnh bài viết</Th>
              <Th w="20rem">Tiêu đề bài viết</Th>
              <Th w="15rem">Danh mục</Th>
              <Th w={'10rem'}>Trạng thái</Th>
              <Th w={'10rem'}>Ngày đăng bài</Th>
              <Th w={'10rem'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={6} pageSize={newsPageParams.pageSize} />
            )}
            {!loadingInitial &&
              newsArray.map((news, index) => (
                <Tr key={news.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <LazyImageAtom
                      src={news.thumbnail}
                      alt={news.title}
                      width="10rem"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                  </Td>
                  <Td>
                    <Box whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                      {news.title}
                    </Box>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      {news.tags.map((tag, index) => (
                        <Badge key={`tag-${index}`} p={1} colorScheme="green">
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  </Td>
                  <Td>
                    <Switch
                      isChecked={news.status === 1}
                      isDisabled={newsStore.isLoading(news.id)}
                      onChange={() => handleChangeStatus(news.id, news.status)} />
                  </Td>
                  <Td>{new Date(news.createdAt).toLocaleDateString("vi-VN")}</Td>
                  <Td>
                    <Flex gap="3">
                      <EditButtonAtom
                        onDelete={async () => {
                          handleOpenEdit(news.id);
                        }}
                      />
                      <DeleteButtonAtom
                        buttonSize="sm"
                        name={news.title}
                        loading={loading}
                        header='Xóa tin tức'
                        buttonClassName="gap-2"
                        onDelete={async () => {
                          try {
                            await deleteNews(news.id);
                          } catch {
                            toast.error("Xóa thất bại");
                          }
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {newsArray.length === 0 && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}

      <UpdateNewsPage isOpen={isOpen} onClose={onClose} ></UpdateNewsPage>
    </>
  );
});

export default NewsTableComponent;
