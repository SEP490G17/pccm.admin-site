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
  useDisclosure,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { FaEdit } from 'react-icons/fa';
import { useStore } from '@/app/stores/store';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import UpdateServicePage from '../UpdateServicePage';

const ServiceTableComponent = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { serviceStore } = useStore();
  const { serviceArray, servicePageParams, loading, loadingInitial, deleteService, detailService } = serviceStore;
  const handleOpenEdit = async (id: number) => {
    onOpen();
    await detailService(id);
  }
  return (
    <>
      <TableContainer bg={'white'} borderRadius={'md'} padding={0} mb="1.5rem">
        <Table className="app-table" variant="simple" padding={0}>
          <Thead>
            <Tr>
              <Th w={'5rem'} py={'1rem'}>
                STT
              </Th>
              <Th w={'15rem'}>Tên dịch vụ</Th>
              <Th w={'15rem'}>Mô tả</Th>
              <Th w={'10rem'}>Giá</Th>
              <Th w={'10rem'}>Khu vực</Th>
              <Th w={'10'}>Tùy chọn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInitial && (
              <SkeletonTableAtoms numOfColumn={5} pageSize={servicePageParams.pageSize} />
            )}
            {!loadingInitial &&
              serviceArray.map((service, index) => (
                <Tr key={service.id}>
                  <Td>{index + 1}</Td>
                  <Td>{service.serviceName}</Td>
                  <Td>{service.description}</Td>
                  <Td>
                    {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Td>
                  <Td>{service.courtClusterName}</Td>
                  <Td>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit"
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      onClick={async () => {
                        handleOpenEdit(service.id)
                      }}
                    />
                    <DeleteButtonAtom
                      name={service.serviceName}
                      loading={loading}
                      header="Xóa dịch vụ"
                      onDelete={async () => {
                        await deleteService(service.id);
                      }}
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
      <UpdateServicePage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ServiceTableComponent;
