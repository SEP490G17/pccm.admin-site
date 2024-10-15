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
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';

const CourtsPage = observer(() => {
  const { courtStore } = useStore();
  const { courtArray, mockLoadCourts, pageParams, setSearchTerm, setPageNumber, loading } =
    courtStore;

  useEffect(() => {
    mockLoadCourts();
  }, [mockLoadCourts]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
  return (
    <Flex direction="column" p={8} bg="#F4F4F4" borderRadius="12px" mx="30px">
      <PageHeadingAtoms title="Danh sách cụm sân" />

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

      <TableContainer bg={'white'} borderRadius={'8px'} padding={0} border={'1px solid #000'}>
        <Table variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Ảnh đại diện
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Tên cụm sân
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Địa chỉ
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Người quản lý
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Trạng thái
              </Th>
              <Th borderRight={'0.923px solid #FFF'} color={'white'}>
                Ngày tạo
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={pageParams.pageSize} />
            ) : (
              courtArray.map((court, index) => (
                <Tr key={court.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {(pageParams.pageIndex - 1) * pageParams.pageSize + index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    <Image
                      src={court.image}
                      alt={court.name}
                      width="120px"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.name}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.location}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.manager}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.status}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.createdAt}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'}>
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
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {courtArray.length === 0 && !loading && (
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
