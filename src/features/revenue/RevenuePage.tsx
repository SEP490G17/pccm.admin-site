import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import TimeInputAtom from '@/app/common/form/TimeInputAtom';
import { observer } from 'mobx-react';
import { FilterCourtClusterStatisticDetailsDTO } from '@/app/models/details.models';

const RevenuePage = observer(() => {
    const { courtStore, revenueStore } = useStore();
    const { courtListAllOptions, loadingInitial } = courtStore;
    const { dataDetail,loadingStatistic } = revenueStore;
    const [selectedCourt, setSelectedCourt] = useState('');
    useEffect(() => {
        const loadData = async () => {
            await courtStore.loadCourtClusterListAll();
        };

        loadData();
    }, [courtStore]);

    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];

    useEffect(() => {
        if (courtListAllOptions.length > 0) {
            setSelectedCourt(courtListAllOptions[0].value.toString());
            const data = new FilterCourtClusterStatisticDetailsDTO({
                courtClusterId: courtListAllOptions[0].value,
                date: isoDate
            });
            revenueStore.loadCourtClusterStatisticDetail(data);
        }
    }, [courtListAllOptions, isoDate, revenueStore]);

    const totalPriceBooking = dataDetail?.bookingDetails.reduce((total, booking) => total + booking.totalPrice, 0);
    const totalPriceOrder = dataDetail?.orderDetails.reduce((total, order) => total + order.totalPrice, 0);
    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Doanh thu', to: '/doanh-thu' }]} />
            <Formik
                initialValues={{
                    timeSelected: isoDate,
                    selectedCourt: selectedCourt
                }}
                enableReinitialize
                onSubmit={async (values) => {
                    const data = new FilterCourtClusterStatisticDetailsDTO({
                        courtClusterId: Number.parseInt(values.selectedCourt),
                        date: values.timeSelected
                    });
                    await revenueStore.loadCourtClusterStatisticDetail(data);
                }}
            >
                {({ handleSubmit }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Box p={5}>
                                <Skeleton isLoaded={!loadingInitial}>
                                    <Flex justify="space-between" mb={4} alignItems={'flex-end'} justifyItems={'flex-end'}>
                                        <SelectFieldAtoms
                                            label='Cụm sân'
                                            width={'25%'}
                                            name="selectedCourt"
                                            options={courtListAllOptions}
                                        />
                                        <Flex alignItems={'flex-end'} justifyItems={'flex-end'} gap={5}>
                                            <TimeInputAtom type='date' name='timeSelected' />
                                            <Button type="submit" width={40} backgroundColor={"rgba(198,251,228,255)"}>
                                                Lọc
                                            </Button>
                                        </Flex>

                                    </Flex>
                                </Skeleton>

                                <Skeleton isLoaded={!loadingStatistic}>
                                    <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
                                        <Table variant="simple">
                                            <Thead bg="green.500">
                                                <Tr>
                                                    <Th color="white" width={'33%'}>Sân</Th>
                                                    <Th color="white" width={'33%'}>Số giờ chơi</Th>
                                                    <Th color="white" width={'33%'}>Thành tiền</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {dataDetail?.bookingDetails.map((booking) => (
                                                    <Tr>
                                                        <Td>{booking.courtName}</Td>
                                                        <Td>{booking.hoursBooked}</Td>
                                                        <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}</Td>
                                                    </Tr>
                                                ))}

                                                <Tr bg="yellow.100">
                                                    <Td>Tổng</Td>
                                                    <Td></Td>
                                                    <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPriceBooking ? totalPriceBooking : 0)}</Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
                                        <Table variant="simple">
                                            <Thead bg="green.600">
                                                <Tr>
                                                    <Th color="white" width={'33%'}>Dịch vụ</Th>
                                                    <Th color="white" width={'33%'}>Số lượng</Th>
                                                    <Th color="white" width={'33%'}>Thành tiền</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {dataDetail?.orderDetails.map((order) => (
                                                    <Tr>
                                                        <Td>{order.productName}</Td>
                                                        <Td>{order.quantity}</Td>
                                                        <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</Td>
                                                    </Tr>
                                                ))}
                                                <Tr bg="yellow.100">
                                                    <Td>Tổng</Td>
                                                    <Td></Td>
                                                    <Td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPriceOrder ? totalPriceOrder : 0)}</Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    <Box textAlign="right" mt={10} mr={5} fontSize="xl" fontWeight="bold">
                                        Doanh thu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPriceOrder && totalPriceBooking ? totalPriceOrder + totalPriceBooking : 0)}
                                    </Box>
                                </Skeleton>

                            </Box>
                        </Form>
                    )
                }
                }
            </Formik>
        </>

    );
});

export default RevenuePage;
