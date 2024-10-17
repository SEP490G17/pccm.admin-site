import { useStore } from '@/app/stores/store';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import {
  Badge,
  Box,
  Center,
  Flex,
  IconButton,
  Image,
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
import { FaEdit, FaTrash } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';

const NewsTableComponent = () => {
  const { newsStore } = useStore();
  const { newsPageParams, newsArray, loading, loadingInitial } = newsStore;

  return (
    <>
      <TableContainer
        bg={'white'}
        borderRadius={'8px'}
        padding={0}
        border={'1px solid #000'}
        mb="1.5rem"
      >
        <Table variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ảnh đại diện
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tiêu đề bài viết
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Danh mục
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Trạng thái
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ngày đăng bài
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={6} pageSize={newsPageParams.pageSize} />
            )}
            {!loadingInitial &&
              newsArray.map((news, index) => (
                <Tr key={news.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Image
                      src={news.thumbnail}
                      alt={news.title}
                      width="120px"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.title}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Flex gap={2}>
                      {news.tags.map((tag, index) => (
                        <Badge key={`tag-${index}`} p={1} colorScheme="green">
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  </Td>

                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Center>
                      <Switch isChecked={news.status == 1} />
                    </Center>
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {news.createdAt}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'}>
                    <Center>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        colorScheme="teal"
                        size="sm"
                        mr={2}
                      />
                      <IconButton
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

      {newsArray.length === 0 && !loading && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách rỗng
        </Box>
      )}
    </>
  );
};

export default observer(NewsTableComponent);
