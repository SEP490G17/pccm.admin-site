import { observer } from 'mobx-react-lite';
import {
    Box,
    Spinner,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { useStore } from '@/app/stores/store';
import dayjs from 'dayjs';

const ServiceLogTableComponent = observer(() => {
    const { serviceStore } = useStore();
    const { serviceLogArray, serviceLogPageParams, loading, loadingInitial } = serviceStore;
    const getLogTypeDisplayName = (logType: string) => {
        switch (logType) {
            case "Update":
                return <Tag colorScheme="blue">Cập nhật dịch vụ</Tag>;
            case "Create":
                return <Tag colorScheme="green">Thêm dịch vụ</Tag>;
            case "Order":
                return <Tag colorScheme="yellow">Đặt dịch vụ</Tag>;
            case "Delete":
                return <Tag colorScheme="red">Xóa dịch vụ</Tag>;
        }
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
                            <Th w={'15rem'}>Cụm sân</Th>
                            <Th w={'10rem'}>Giá</Th>
                            <Th w={'15rem'}>Mô tả</Th>
                            <Th w={'10rem'}>Loại log</Th>
                            <Th w={'10rem'}>Ngày log</Th>
                            <Th w={'10rem'}>Người log</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loadingInitial && (
                            <SkeletonTableAtoms numOfColumn={7} pageSize={serviceLogPageParams.pageSize} />
                        )}
                        {!loadingInitial &&
                            serviceLogArray.map((service, index) => (
                                <Tr key={service.id}>
                                    <Td>{index + 1}</Td>
                                    <Td>{service.serviceName}</Td>
                                    <Td>{service.courtClusterName}</Td>
                                    <Td>
                                        {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </Td>
                                    <Td>{service.description}</Td>
                                    <Td>{getLogTypeDisplayName(service.logType)}</Td>
                                    <Td>{dayjs(service.createAt).format('DD/MM/YYYY')}</Td>
                                    <Td>{service.createBy}</Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {serviceLogArray.length === 0 && !loading && !loadingInitial && (
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
        </>
    );
});

export default ServiceLogTableComponent;
