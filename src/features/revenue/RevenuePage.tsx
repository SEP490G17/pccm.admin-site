import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { Formik, Form, FieldProps, Field } from 'formik';
import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import { observer } from 'mobx-react';
import { ExpenseDetails, ExpenseDetailsDTO, FilterCourtClusterStatisticDetailsDTO } from '@/app/models/revenue.models';
import { DatePicker } from 'antd';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import { FaRegFileExcel } from "react-icons/fa6";

const RevenuePage = observer(() => {
    const { courtClusterStore, revenueStore } = useStore();
    const { courtClusterListAllOptions, loadingInitial } = courtClusterStore;
    const { dataDetail, loadingStatistic } = revenueStore;
    const [selectedCourt, setSelectedCourt] = useState('');
    const [selectedTime, setSelectedTime] = useState<Dayjs>();
    const [expenses, setExpenses] = useState<ExpenseDetails[]>([]);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [isEditing, setIsEditing] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            await courtClusterStore.loadCourtClusterListAll();
        };

        loadData();
    }, [courtClusterStore]);

    const isoDate = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        if (dataDetail?.expenseDetails) {
            setExpenses([...dataDetail.expenseDetails]);
        }
    }, [dataDetail]);

    useEffect(() => {
        if (courtClusterListAllOptions.length > 0) {
            setSelectedCourt(courtClusterListAllOptions[0].value.toString());
            const data = new FilterCourtClusterStatisticDetailsDTO({
                courtClusterId: courtClusterListAllOptions[0].value,
                date: isoDate
            });
            revenueStore.loadCourtClusterStatisticDetail(data);
        }
        setExpenses([]);
    }, [courtClusterListAllOptions, isoDate, revenueStore]);

    const formatPrice = (data: number | undefined) => {
        if (data)
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data)
        else
            return 0
    };

    const totalPriceBooking = dataDetail?.bookingDetails.reduce((total, booking) => total + booking.totalPrice, 0);
    const totalPriceProduct = dataDetail?.orderProductDetails.reduce((total, order) => total + order.totalPrice, 0);
    const totalPriceService = dataDetail?.orderServiceDetails.reduce((total, order) => total + order.totalPrice, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.totalPrice, 0);
    const totalProfit = (totalPriceBooking || 0) + (totalPriceProduct || 0) + (totalPriceService || 0) - totalExpenses;

    const handleUpdateExpense = () => {
        if (isEditing !== null) {
            const updatedExpenses = expenses.map((expense, index) =>
                index === isEditing ? { id: expense.id, expenseName: expenseName, totalPrice: expenseAmount } : expense
            );
            setExpenses(updatedExpenses);
            setIsEditing(null);
        } else {
            setExpenses([...expenses, { id: 0, expenseName: expenseName, totalPrice: expenseAmount }]);
        }
        setExpenseName('');
        setExpenseAmount(0);
    };

    const handleEditExpense = (index: number) => {
        setExpenseName(expenses[index].expenseName);
        setExpenseAmount(expenses[index].totalPrice);
        setIsEditing(index);
    };

    const handleSaveExpense = async () => {
        const data = new ExpenseDetailsDTO({
            expenseAt: isoDate,
            courtClusterId: selectedCourt,
            expenseInputDto: expenses
        })

        await agent.Revenue.saveExpense(data)
            .then(() => (toast.success("Lưu thành công")))
            .catch(() => (toast.error("Lưu thất bại")))
    };

    const handleDeleteExpense = (index: number | ExpenseDetails) => {
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(updatedExpenses);
    };

    const handleExportExcel = () => {
        const data = new FilterCourtClusterStatisticDetailsDTO({
            courtClusterId: courtClusterListAllOptions[0].value,
            date: dayjs(selectedTime).format('YYYY-MM')
        });
        revenueStore.exportExcel(data);
    };

    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Doanh thu', to: '/doanh-thu' }]} />
            <Formik
                initialValues={{
                    timeSelected: isoDate ? dayjs(isoDate) : null,
                    selectedCourt: selectedCourt
                }}
                enableReinitialize
                onSubmit={async (values) => {
                    const data = new FilterCourtClusterStatisticDetailsDTO({
                        courtClusterId: Number.parseInt(values.selectedCourt),
                        date: values.timeSelected ? values.timeSelected.format('MM/YYYY') : ''
                    });
                    await revenueStore.loadCourtClusterStatisticDetail(data);
                }}
            >
                {({ handleSubmit, setFieldValue }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Box p={5}>
                                <Skeleton isLoaded={!loadingInitial}>
                                    <Flex justify="space-between" mb={4} alignItems={'flex-end'}>
                                        <SelectFieldAtoms
                                            label='Cụm sân'
                                            width={'25%'}
                                            name="selectedCourt"
                                            options={courtClusterListAllOptions}
                                            backgroundColor={'white'}
                                        />
                                        <Flex alignItems={'flex-end'} gap={5}>
                                            <Field name="timeSelected" width='50px'>
                                                {({ field }: FieldProps) => (
                                                    <DatePicker
                                                        {...field}
                                                        picker="month"
                                                        format={'MM-YYYY'}
                                                        placeholder="Tháng"
                                                        onChange={(date) => {
                                                            setFieldValue("timeSelected", date || null)
                                                            setSelectedTime(date)
                                                        }}
                                                        value={field.value ? dayjs(field.value) : null}
                                                    />
                                                )}
                                            </Field>
                                            <Button type="submit" width={40} backgroundColor={"rgba(198,251,228,255)"}>
                                                Lọc
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Skeleton>

                                <Skeleton isLoaded={!loadingStatistic}>
                                    <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
                                        <Table variant="simple">
                                            <Thead backgroundColor='#115363'>
                                                <Tr>
                                                    <Th color="white" width={'10px'} borderRight="1px solid #ddd">STT</Th>
                                                    <Th color="white" borderRight="1px solid #ddd">Chi tiêu</Th>
                                                    <Th color="white" borderRight="1px solid #ddd">Số lượng</Th>
                                                    <Th color="white" borderRight="1px solid #ddd">Mã số</Th>
                                                    <Th color="white" borderRight="1px solid #ddd">Thành tiền</Th>
                                                    <Th color="white" width="50px">
                                                        <Button colorScheme="green" onClick={handleExportExcel}>
                                                            <FaRegFileExcel />
                                                        </Button>
                                                    </Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody backgroundColor={'white'}>
                                                <Tr backgroundColor={'#c6fbe4'}>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">A.</Td>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">Doanh thu sân</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>
                                                {dataDetail?.bookingDetails.map((booking, index) => (
                                                    <Tr key={index}>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                        <Td borderRight="1px solid #ddd">{booking.courtName}</Td>
                                                        <Td borderRight="1px solid #ddd">{booking.hoursBooked}</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">{formatPrice(booking.totalPrice)}</Td>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                    </Tr>
                                                ))}
                                                <Tr>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">Tổng</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">(1)</Td>
                                                    <Td borderRight="1px solid #ddd">{formatPrice(totalPriceBooking)}</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>

                                                <Tr backgroundColor={'#c6fbe4'}>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">B.</Td>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">Doanh thu bán hàng</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>
                                                {dataDetail?.orderProductDetails.map((product, index) => (
                                                    <Tr key={index}>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                        <Td borderRight="1px solid #ddd">{product.productName}</Td>
                                                        <Td borderRight="1px solid #ddd">{product.quantity}</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">{formatPrice(product.totalPrice)}</Td>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                    </Tr>
                                                ))}
                                                <Tr>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">Tổng</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">(2)</Td>
                                                    <Td borderRight="1px solid #ddd">{formatPrice(totalPriceProduct)}</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>

                                                <Tr backgroundColor={'#c6fbe4'}>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">C.</Td>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">Doanh thu dịch vụ</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>
                                                {dataDetail?.orderServiceDetails.map((service, index) => (
                                                    <Tr key={index}>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                        <Td borderRight="1px solid #ddd">{service.serviceName}</Td>
                                                        <Td borderRight="1px solid #ddd">{service.quantity}</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">{formatPrice(service.totalPrice)}</Td>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                    </Tr>
                                                ))}
                                                <Tr>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">Tổng</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">(3)</Td>
                                                    <Td borderRight="1px solid #ddd">{formatPrice(totalPriceService)}</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>

                                                <Tr backgroundColor={'#c6fbe4'}>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">D.</Td>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">Chi phí & Quản lý</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>
                                                <Tr>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">
                                                        <Input
                                                            placeholder="Tên chi phí"
                                                            value={expenseName}
                                                            onChange={(e) => setExpenseName(e.target.value)}
                                                        />
                                                    </Td>
                                                    <Td borderRight="1px solid #ddd">-</Td>
                                                    <Td borderRight="1px solid #ddd">-</Td>
                                                    <Td borderRight="1px solid #ddd">
                                                        <Input
                                                            placeholder="Số tiền"
                                                            type="number"
                                                            value={expenseAmount}
                                                            onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </Td>
                                                    <Td
                                                        borderRight="1px solid #ddd"
                                                    >
                                                        <Flex gap={5}>
                                                            <Button colorScheme="orange" onClick={handleUpdateExpense} width={20}>
                                                                {isEditing !== null ? 'Cập nhật' : 'Thêm'}
                                                            </Button>
                                                            <Button colorScheme="green" width={20} onClick={handleSaveExpense}>
                                                                {'Lưu'}
                                                            </Button>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                                {/* {dataDetail?.expenseDetails.map((expense, index) => (
                                                    <Tr key={index}>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                        <Td borderRight="1px solid #ddd">{expense.expenseName}</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">{formatPrice(expense.totalPrice)}</Td>
                                                        <Td borderRight="1px solid #ddd">
                                                            <Flex gap={5}>
                                                                <Button colorScheme="blue" size={'sm'} width={20} onClick={() => handleEditExpense(expense)}>
                                                                    Sửa
                                                                </Button>
                                                                <Button colorScheme="red" size={'sm'} width={20} onClick={() => handleDeleteExpense(expense)}>
                                                                    Xóa
                                                                </Button>
                                                            </Flex>
                                                        </Td>
                                                    </Tr>
                                                ))} */}
                                                {expenses.map((expense, index) => (
                                                    <Tr key={index}>
                                                        <Td borderRight="1px solid #ddd"></Td>
                                                        <Td borderRight="1px solid #ddd">{expense.expenseName}</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">-</Td>
                                                        <Td borderRight="1px solid #ddd">{formatPrice(expense.totalPrice)}</Td>
                                                        <Td borderRight="1px solid #ddd">
                                                            <Flex gap={5}>
                                                                <Button colorScheme="blue" size={'sm'} width={20} onClick={() => handleEditExpense(index)}>
                                                                    Sửa
                                                                </Button>
                                                                <Button colorScheme="red" size={'sm'} width={20} onClick={() => handleDeleteExpense(index)}>
                                                                    Xóa
                                                                </Button>
                                                            </Flex>
                                                        </Td>
                                                    </Tr>
                                                ))}

                                                <Tr>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">Tổng</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">(4)</Td>
                                                    <Td borderRight="1px solid #ddd">{formatPrice(totalExpenses)}</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>

                                                <Tr backgroundColor={'#c6fbe4'}>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">E.</Td>
                                                    <Td style={{ fontSize: '20px', color: '#126945' }} borderRight="1px solid #ddd">Lợi nhuận</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                    <Td borderRight="1px solid #ddd">(5) = (1) + (2) + (3) - (4)</Td>
                                                    <Td borderRight="1px solid #ddd">{formatPrice(totalProfit)}</Td>
                                                    <Td borderRight="1px solid #ddd"></Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Skeleton>
                            </Box>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
});

export default RevenuePage;
