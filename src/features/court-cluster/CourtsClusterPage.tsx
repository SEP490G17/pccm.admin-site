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
import { useStore } from '@/app/stores/store.ts';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';

const CourtClusterPage = observer(() => {
  const { courtStore } = useStore();
  const {
    mockLoadCourts,
    courtArray,
    courtPageParams,
    loading,
  } = courtStore;

  useEffect(() => {
    mockLoadCourts();
  }, [mockLoadCourts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    courtStore.setSearchTerm(e.target.value);
  };



  return (
    <>
      <PageHeadingAtoms breadCrumb={[{title:'Danh sách cụm sân',to:'/cum-san'}]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select width="149px" height="35px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF" color="#03301F">
            <option value="all">Tất cả</option>
          </Select>

          <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" className='bg-white' color="black" border="1px solid #ADADAD" onClick={() => router.navigate('/cum-san/tao')}>
            Thêm mới
          </Button>
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

      <TableContainer bg={'white'} borderRadius={'8px'} padding={0} border={'1px solid #000'} mb="1.5rem">
        <Table variant="simple" cellPadding={'1rem'} padding={0}>
          <Thead backgroundColor={'#03301F'}>
            <Tr>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                STT
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Ảnh
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Tên sân
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Địa chỉ
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Giờ mở cửa
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Số sân
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Dịch vụ
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonTableAtoms numOfColumn={7} pageSize={courtPageParams.pageSize} />
            ) : (
              courtArray.map((court, index) => (
                <Tr key={court.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {index + 1}
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
                    {court.address}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.openHours}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.courts}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {court.services.join(', ')}
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
          Danh sách rỗng
        </Box>
      )}
    </>
  );
});

export default CourtClusterPage;
