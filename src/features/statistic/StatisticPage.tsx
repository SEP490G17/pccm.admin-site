import SelectFieldAtoms from "@/app/common/form/SelectFieldAtoms"
import { Form, Formik } from "formik"
import { Avatar, Box, Button, Flex, FormControl, Skeleton, Text } from "@chakra-ui/react"
import PageHeadingAtoms from "../atoms/PageHeadingAtoms"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    LineController,
    BarController,
    ChartData
} from "chart.js";
import MixedChart from "./components/MixChart"
import DoughNutChart from "./components/DoughNutChart"
import HeaderStatistic from "./components/HeaderStatistic"
import { SiGooglesheets } from "react-icons/si";
import { useStore } from "@/app/stores/store";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { FilterDataDTO } from "@/app/models/filter.model";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    LineController,
    BarController
);

const StatisticPage = observer(() => {
    const { courtStore, statisticStore } = useStore()
    const { courtListAllOptions } = courtStore
    const { loadDataFilter, setLoadingData, loadingData, years,
        dataFilter, setLoadingDataFilter, loadingDataFilter, dataTotal,
        setLoadingDataTotal, loadingDataTotal, dataExpense, dataTop } = statisticStore
    const month = Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Tháng ${i + 1}`,
    }));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const m = 1000000;
    const year = years.length === 0 ? [{ value: `${currentYear}`, label: `Năm ${currentYear}` }] : years.map((values) => (
        {
            value: values.toString(),
            label: `Năm ${values}`
        }
    ))
    useEffect(() => {
        setLoadingDataFilter(true);
        setLoadingData(true);
        setLoadingDataTotal(true);

        courtStore.loadCourtClusterListAll()
            .then(() => {
                const dataInit = new FilterDataDTO({
                    courtClusterId: 0,
                    month: currentMonth,
                    year: currentYear
                });

                return Promise.all([
                    statisticStore.loadYears(),
                    loadDataFilter(dataInit),
                    statisticStore.loadDataTotal(),
                    statisticStore.loadExpense(dataInit),
                    statisticStore.loadTop(dataInit)
                ]);
            })
            .then(() => {
                setLoadingDataFilter(false);
                setLoadingData(false);
                setLoadingDataTotal(false);
            })
            .catch((error) => {
                console.error('Error loading initial data:', error);
                setLoadingDataFilter(false);
                setLoadingData(false);
                setLoadingDataTotal(false);
            });
    }, []);

    const labels = dataFilter.map((values) => values.date)

    const { totalAmount, totalBooking, totalFee } = dataFilter.reduce((accumulator, values) => {
        return {
            totalAmount: accumulator.totalAmount + values.totalAmount,
            totalBooking: accumulator.totalBooking + values.totalBooking,
            totalFee: accumulator.totalFee + values.totalImportFee
        };
    }, { totalAmount: 0, totalBooking: 0, totalFee: 0 });

    const data: ChartData<'bar' | 'line'> = {
        labels: labels,
        datasets: [
            {
                type: 'line',
                label: "Lượt đặt",
                fill: false,
                data: dataFilter.map((values) => values.totalBooking),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5,
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y1'
            },

            {
                type: 'bar',
                label: "Doanh thu",
                data: dataFilter.map((values) => values.totalAmount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                yAxisID: 'y2'
            },
        ],
    };

    const pieChartData: ChartData<'doughnut'> = {
        labels: ["Trả lương", "Hàng hóa"],
        datasets: [
            {
                data: [dataExpense?.totalStaffExpenditure ?? 0, dataExpense?.totalProductExpenditure ?? 0],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Thống kê', to: '/thong-ke' }]} />
            <Formik
                initialValues={{
                    court_cluster: courtListAllOptions[0]?.value ?? 0,
                    month: currentMonth,
                    year: currentYear,
                }}
                onSubmit={async (values) => {
                    const dataFilter = new FilterDataDTO(
                        {
                            courtClusterId: values.court_cluster,
                            month: values.month,
                            year: values.year
                        }
                    )
                    await Promise.all([loadDataFilter(dataFilter),
                    statisticStore.loadExpense(dataFilter),
                    statisticStore.loadTop(dataFilter)])
                }
                }
            >
                {({ handleSubmit, isValid, errors }) => {
                    console.log('Is Valid:', isValid);
                    console.log('Errors:', errors);
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Skeleton isLoaded={!loadingDataTotal}>
                                <HeaderStatistic data={dataTotal}></HeaderStatistic>
                            </Skeleton>
                            <Skeleton isLoaded={!loadingDataFilter}>
                                <FormControl>
                                    <Flex alignItems={"end"}>
                                        <Flex alignItems={"end"} width={'50%'} gap={2}>
                                            <SelectFieldAtoms
                                                options={[{ value: 0, label: "Tất cả" }, ...courtListAllOptions]}
                                                name="court_cluster"
                                                label="Cụm sân"
                                                isRequired={true}
                                            />
                                            <SelectFieldAtoms
                                                options={[{ value: 0, label: "Tất cả" }, ...month]}
                                                name="month"
                                                label="Tháng"
                                                isRequired={true}
                                            />
                                            <SelectFieldAtoms
                                                options={year}
                                                name="year"
                                                label="Năm"
                                            />
                                            <Button type="submit" width={40} backgroundColor={"rgba(198,251,228,255)"}>
                                                Lọc
                                            </Button>
                                        </Flex>

                                        <Box marginLeft="auto">
                                            <Button type="button" width={90} backgroundColor={"rgba(198,251,228,255)"}>
                                                <SiGooglesheets />&nbsp;&nbsp;Xuất file
                                            </Button>
                                        </Box>
                                    </Flex>
                                </FormControl>
                            </Skeleton>

                            <Skeleton isLoaded={!loadingDataFilter && !loadingData}>
                                <FormControl mt={10}>
                                    <Flex alignItems={"center"} gap={5}>
                                        <Flex gap="4" direction="column">
                                            <Box
                                                width={'15rem'}
                                                border="1px solid #e2e8f0"
                                                boxShadow="sm"
                                                borderRadius="md"
                                                padding={4}
                                                justifySelf={"center"}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection={"column"}
                                            >
                                                <Box fontWeight="bold" fontSize={'2xl'} color='green'>TỔNG DOANH THU</Box>
                                                <Box>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount * m)}
                                                </Box>
                                            </Box>
                                            <Box
                                                width={'15rem'}
                                                border="1px solid #e2e8f0"
                                                boxShadow="sm"
                                                borderRadius="md"
                                                padding={4}
                                                justifySelf={"center"}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection={"column"}
                                            >
                                                <Box fontWeight="bold" fontSize={'2xl'} color='green'>TỔNG CHI PHÍ</Box>
                                                <Box>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalFee * m)}
                                                </Box>
                                            </Box>
                                            <Box
                                                width={'15rem'}
                                                border="1px solid #e2e8f0"
                                                boxShadow="sm"
                                                borderRadius="md"
                                                padding={4}
                                                justifySelf={"center"}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection={"column"}
                                            >
                                                <Box fontWeight="bold" fontSize={'2xl'} color='green'>SỐ LƯỢT ĐẶT SÂN</Box>
                                                <Box>
                                                    {totalBooking} lượt
                                                </Box>
                                            </Box>
                                        </Flex>
                                        <Box
                                            width={'80%'}
                                            border="1px solid #e2e8f0"
                                            boxShadow="sm"
                                            borderRadius="md"
                                            padding={4}

                                        >
                                            <MixedChart data={data} labelLeft="lượt" labelRight="triệu đồng" text="Doanh Thu Cụm Sân"></MixedChart>
                                        </Box>
                                    </Flex>
                                </FormControl>
                                <FormControl>
                                    <Flex flexDirection="row" alignItems="center" justifyContent="center" gap={20} mt={20}>
                                        <Box
                                            width="30%"
                                            display="flex"
                                            height={'30rem'}
                                            border="1px solid #e2e8f0"
                                            boxShadow="sm"
                                            borderRadius="md"
                                            padding={4}
                                            alignItems="center"
                                            justifyContent="center">
                                            <DoughNutChart data={pieChartData} label="Chi phí" />
                                        </Box>

                                        <Box
                                            width="30%"
                                            height={'30rem'}
                                            display="flex"
                                            flexDirection="column"
                                            border="1px solid #e2e8f0"
                                            boxShadow="sm"
                                            borderRadius="md"
                                            padding={4}
                                        >
                                            {/* Tiêu đề cố định */}
                                            <Box fontWeight="bold" fontSize="2xl" color="green" textAlign="center" mb={3} position="sticky" top={0} zIndex={1} padding={2}>
                                                TOP 5 NHÂN VIÊN
                                            </Box>

                                            <Box overflowY="auto" flex="1">
                                                {dataTop?.topStaffs.map((staff, index) => (
                                                    <Flex key={index} align="center" justify="space-between" mb={3}>
                                                        <Flex align="center">
                                                            <Box textAlign="center">
                                                                <Text fontWeight="bold">{staff.fullName}</Text>
                                                            </Box>
                                                        </Flex>
                                                    </Flex>
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box
                                            width="30%"
                                            height={'30rem'}
                                            display="flex"
                                            flexDirection="column"
                                            border="1px solid #e2e8f0"
                                            boxShadow="sm"
                                            borderRadius="md"
                                            padding={4}
                                        >
                                            {/* Tiêu đề cố định */}
                                            <Box fontWeight="bold" fontSize="2xl" color="green" textAlign="center" mb={3} position="sticky" top={0} zIndex={1} padding={2}>
                                                TOP 5 SẢN PHẨM
                                            </Box>

                                            <Box overflowY="auto" flex="1">
                                                {dataTop?.topProducts.map((product, index) => (
                                                    <Flex key={index} align="center" justify="space-between" mb={3}>
                                                        <Flex align="center">
                                                            <Avatar size="md" mr={3} src={product.thumbnailUrl} />
                                                            <Box>
                                                                <Text fontWeight="bold">{product.productName}</Text>
                                                            </Box>
                                                        </Flex>
                                                    </Flex>
                                                ))}
                                            </Box>
                                        </Box>


                                    </Flex>
                                </FormControl>
                            </Skeleton>
                        </Form>
                    )
                }
                }
            </Formik>
        </>
    )
})

export default StatisticPage