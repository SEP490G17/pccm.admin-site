import { observer } from 'mobx-react-lite';
import {
  Box,
  Flex,
  Spinner,
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
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { useStore } from '@/app/stores/store';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import UpdateServicePage from '../UpdateServicePage';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';

const ServiceTableComponent = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { serviceStore } = useStore();
  const { serviceArray, servicePageParams, loading, loadingInitial, deleteService, detailService } =
    serviceStore;
  const toast = useToast();
  const handleOpenEdit = async (id: number) => {
    onOpen();
    await detailService(id, toast);
  };
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
              <Th w={'10rem'}>Cụm sân</Th>
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
                    <Flex gap="3">
                      <EditButtonAtom
                        onUpdate={async () => {
                          handleOpenEdit(service.id);
                        }}
                      />

                      <DeleteButtonAtom
                        buttonSize="sm"
                        name={service.serviceName}
                        loading={loading}
                        header="Xóa dịch vụ"
                        buttonClassName="gap-2"
                        onDelete={async () => {
                          await deleteService(service.id, toast);
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {serviceArray.length === 0 && !loading && !loadingInitial && (
        <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
          Danh sách service rỗng
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
