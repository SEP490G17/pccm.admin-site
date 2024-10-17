import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useStore } from '@/app/stores/store';

const ServiceTableComponent = () => {
  const { serviceStore } = useStore();
  const { serviceArray, servicePageParams, loading, loadingInitial } = serviceStore;

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
                Tên dịch vụ
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Mô tả
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Giá
              </Th>
              <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                Lĩnh vực
              </Th>
              <Th color={'white'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={5} pageSize={servicePageParams.pageSize} />
            )}
            {!loadingInitial &&
              serviceArray.map((service, index) => (
                <Tr key={service.id}>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {index + 1}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {service.serviceName}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {service.description}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>
                  <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                    {service.courtClusterName}
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
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {serviceArray.length === 0 && !loading && !loadingInitial && (
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

export default observer(ServiceTableComponent);
