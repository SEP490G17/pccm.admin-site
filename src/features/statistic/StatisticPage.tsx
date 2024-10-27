import SelectFieldAtoms from "@/app/common/form/SelectFieldAtoms"
import { Form, Formik } from "formik"
import { Avatar, Box, Button, Flex, FormControl, IconButton, Text } from "@chakra-ui/react"
import PageHeadingAtoms from "../atoms/PageHeadingAtoms"
import { ChartData } from "chart.js"
import MixedChart from "./components/MixChart"
import DoughNutChart from "./components/DoughNutChart"
import HeaderStatistic from "./components/HeaderStatistic"
import { SiGooglesheets } from "react-icons/si";

const StatisticPage = () => {
    const data: ChartData<'bar' | 'line'> = {
        labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
        ],
        datasets: [
            {
                type: 'line',
                label: "Doanh thu cụm sân 1",
                fill: false,
                data: [49, 64, 21, 73, 51, 52, 30, 86, 66, 94, 11, 84],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5,
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: "Doanh thu cụm sân 2",
                fill: false,
                data: [28, 57, 59, 22, 87, 91, 19, 4, 7, 13, 4, 18],
                borderColor: 'red',
                tension: 0.5,
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: "Doanh thu cụm sân 3",
                fill: false,
                data: [19, 86, 87, 83, 5, 32, 64, 29, 75, 97, 81, 63],
                borderColor: 'orange',
                tension: 0.5,
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y1'
            },

            {
                type: 'bar',
                label: "Lượt đặt sân 1",
                data: [8, 15, 22, 29, 3, 18, 27, 10, 12, 5, 25, 17],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                yAxisID: 'y2'
            },
            {
                type: 'bar',
                label: "Lượt đặt sân 2",
                data: [2, 14, 19, 30, 7, 24, 9, 11, 4, 16, 20, 28],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'red',
                borderWidth: 1,
                yAxisID: 'y2'
            },
            {
                type: 'bar',
                label: "Lượt đặt sân 3",
                data: [6, 26, 1, 23, 13, 21, 15, 8, 29, 3, 10, 5],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'orange',
                borderWidth: 1,
                yAxisID: 'y2'
            },
        ],
    };

    const clients = [
        { name: "Jo Stark", company: "JS Technologies", image: "path/to/image1" },
        { name: "Derrick Stones", company: "DS Holdings", image: "path/to/image2" },
        { name: "Kelly Price", company: "KP Holdings", image: "path/to/image3" },
        { name: "Jin Kwok", company: "JK Investments", image: "path/to/image4" },
    ];

    const pieChartData: ChartData<'doughnut'> = {
        labels: ["Hàng hóa", "Trả lương", "Bảo trì"],
        datasets: [
            {
                data: [120, 60, 30],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
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
                    service_name: '',
                    description: '',
                    price: 1,
                    courtclusters: [],
                }}
                onSubmit={(values) => console.log(values)}
            >
                {({ handleSubmit, isValid, errors }) => {
                    console.log('Is Valid:', isValid);
                    console.log('Errors:', errors);
                    return (
                        <Form onSubmit={handleSubmit}>
                            <HeaderStatistic></HeaderStatistic>
                            <FormControl>
                                <Flex alignItems={"end"}>
                                    <Flex alignItems={"end"} width={'50%'} gap={2}>
                                        <SelectFieldAtoms
                                            options={[
                                                { value: "all", label: "Tất cả" },
                                                { value: "1", label: "Cụm sân 1" },
                                                { value: "2", label: "Cụm sân 2" }
                                            ]}
                                            name="court_cluster"
                                            label="Cụm sân"
                                        />
                                        <SelectFieldAtoms
                                            options={[
                                                { value: "all", label: "Tất cả" },
                                                { value: "1", label: "Tháng 1" },
                                                { value: "2", label: "Tháng 2" },
                                                { value: "3", label: "Tháng 3" },
                                                { value: "4", label: "Tháng 4" },
                                                { value: "5", label: "Tháng 5" },
                                                { value: "6", label: "Tháng 6" },
                                                { value: "7", label: "Tháng 7" },
                                                { value: "8", label: "Tháng 8" },
                                                { value: "9", label: "Tháng 9" },
                                                { value: "10", label: "Tháng 10" },
                                                { value: "11", label: "Tháng 11" },
                                                { value: "12", label: "Tháng 12" },
                                            ]}
                                            name="month"
                                            label="Tháng"
                                        />
                                        <SelectFieldAtoms
                                            options={[
                                                { value: "all", label: "Tất cả" },
                                                { value: "2024", label: "Năm 2024" },
                                            ]}
                                            name="year"
                                            label="Năm"
                                        />
                                        <Button type="submit" width={40} backgroundColor={"rgba(198,251,228,255)"}>
                                            Lọc
                                        </Button>
                                    </Flex>

                                    <Box marginLeft="auto">
                                        <Button type="submit" width={90} backgroundColor={"rgba(198,251,228,255)"}>
                                            <SiGooglesheets />&nbsp;&nbsp;Xuất file
                                        </Button>
                                    </Box>
                                </Flex>
                            </FormControl>

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
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(200000)}
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
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(200000)}
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
                                                20 lượt
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
                                        <MixedChart data={data} labelLeft="triệu đồng" labelRight="lượt" text="Doanh Thu Cụm Sân"></MixedChart>
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
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                        border="1px solid #e2e8f0"
                                        boxShadow="sm"
                                        borderRadius="md"
                                        padding={4}
                                    >
                                        <Box fontWeight="bold" fontSize="2xl" color="green" mb={3}>
                                            TOP 5 NHÂN VIÊN
                                        </Box>

                                        {clients.map((client, index) => (
                                            <Flex key={index} align="center" justify="space-between" mb={3}>
                                                <Flex align="center">
                                                    <Avatar src={client.image} name={client.name} size="md" mr={3} />
                                                    <Box>
                                                        <Text fontWeight="bold">{client.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {client.company}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                                <IconButton
                                                    aria-label="More options"
                                                    variant="ghost"
                                                    size="sm"
                                                />
                                            </Flex>
                                        ))}
                                    </Box>

                                    <Box
                                        width="30%"
                                        height={'30rem'}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                        border="1px solid #e2e8f0"
                                        boxShadow="sm"
                                        borderRadius="md"
                                        padding={4}
                                    >
                                        <Box fontWeight="bold" fontSize="2xl" color="green" mb={3}>
                                            TOP 5 NHÂN VIÊN
                                        </Box>

                                        {clients.map((client, index) => (
                                            <Flex key={index} align="center" justify="space-between" mb={3}>
                                                <Flex align="center">
                                                    <Avatar src={client.image} name={client.name} size="md" mr={3} />
                                                    <Box>
                                                        <Text fontWeight="bold">{client.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {client.company}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                                <IconButton
                                                    aria-label="More options"
                                                    variant="ghost"
                                                    size="sm"
                                                />
                                            </Flex>
                                        ))}
                                    </Box>
                                </Flex>
                            </FormControl>

                        </Form>
                    )
                }
                }
            </Formik>
        </>
    )
}

export default StatisticPage