import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, FormControl, Skeleton } from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
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
  ChartData,
} from 'chart.js';
import MixedChart from './components/MixChart';
// import DoughNutChart from "./components/DoughNutChart"
import HeaderStatistic from './components/HeaderStatistic';
import { useStore } from '@/app/stores/store';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FilterDataDTO } from '@/app/models/statistic.model';
import OrderActivity from './components/OrderActivity';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  LineController,
  BarController,
);

const StatisticPage = observer(() => {
  const { courtClusterStore, statisticStore } = useStore();
  const { courtClusterListAllOptions } = courtClusterStore;
  const {
    loadDataFilter,
    setLoadingData,
    loadingData,
    years,
    dataFilter,
    setLoadingDataFilter,
    loadingDataFilter,
    dataTotal,
    setLoadingDataTotal,
    loadingDataTotal,
  } = statisticStore;
  const month = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Tháng ${i + 1}`,
  }));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const year =
    years.length === 0
      ? [{ value: `${currentYear}`, label: `Năm ${currentYear}` }]
      : years.map((values) => ({
          value: values.toString(),
          label: `Năm ${values}`,
        }));
  useEffect(() => {
    setLoadingDataFilter(true);
    setLoadingData(true);
    setLoadingDataTotal(true);

    courtClusterStore
      .loadCourtClusterListAll()
      .then(() => {
        const dataInit = new FilterDataDTO({
          courtClusterId: 0,
          month: currentMonth,
          year: currentYear,
        });

        return Promise.all([
          statisticStore.getBookingRecent(),
          statisticStore.loadYears(),
          loadDataFilter(dataInit),
          statisticStore.loadDataTotal(),
          statisticStore.loadExpense(dataInit),
          statisticStore.loadTop(dataInit),
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
  }, [
    courtClusterStore,
    currentMonth,
    currentYear,
    loadDataFilter,
    setLoadingData,
    setLoadingDataFilter,
    setLoadingDataTotal,
    statisticStore,
  ]);

  const labels = dataFilter.map((values) => values.date);

  const data: ChartData<'bar' | 'line'> = {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: 'Lượt đặt',
        fill: false,
        data: dataFilter.map((values) => values.totalBooking),
        borderColor: '#ffc415',
        backgroundColor: '#ffc415',
        tension: 0.5,
        cubicInterpolationMode: 'monotone',
        yAxisID: 'y1',
      },

      {
        type: 'bar',
        label: 'Doanh thu',
        data: dataFilter.map((values) => values.totalAmount),
        backgroundColor: '#15adff',
        borderColor: '#15adff',
        borderWidth: 1,
        yAxisID: 'y2',
      },
    ],
  };

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Thống kê', to: '/thong-ke' }]} />
      <Formik
        initialValues={{
          court_cluster: courtClusterListAllOptions[0]?.value ?? 0,
          month: currentMonth,
          year: currentYear,
        }}
        onSubmit={async (values) => {
          const dataFilter = new FilterDataDTO({
            courtClusterId: values.court_cluster,
            month: values.month,
            year: values.year,
          });
          await loadDataFilter(dataFilter);
        }}
      >
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
              <Skeleton isLoaded={!loadingDataTotal}>
                <HeaderStatistic data={dataTotal}></HeaderStatistic>
              </Skeleton>
              <Skeleton isLoaded={!loadingDataFilter}>
                <FormControl>
                  <Flex alignItems={'end'}>
                    <Flex alignItems={'end'} width={'50%'} gap={2}>
                      <SelectFieldAtoms
                        options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
                        name="court_cluster"
                        label="Cụm sân"
                        isRequired={true}
                      />
                      <SelectFieldAtoms
                        options={[{ value: 0, label: 'Tất cả' }, ...month]}
                        name="month"
                        label="Tháng"
                        isRequired={true}
                      />
                      <SelectFieldAtoms options={year} name="year" label="Năm" />
                      <Button type="submit" width={40} backgroundColor={'#126945'} color={'white'}>
                        Lọc
                      </Button>
                    </Flex>
                  </Flex>
                </FormControl>
              </Skeleton>

              <FormControl mt={10}>
                <Flex gap={10} justifyContent={'space-between'}>
                  <Box
                    width={'73%'}
                    border="1px solid #e2e8f0"
                    borderRadius="10px"
                    padding={4}
                    backgroundColor={'white'}
                  >
                    <Skeleton isLoaded={!loadingDataFilter && !loadingData}>
                      <MixedChart
                        data={data}
                        labelLeft="lượt"
                        labelRight="triệu đồng"
                        text="Doanh Thu Cụm Sân"
                      ></MixedChart>
                    </Skeleton>
                  </Box>
                  <Box width={'25rem'} backgroundColor={'white'} padding={5} borderRadius="10px">
                    <Skeleton height={'100%'} isLoaded={!statisticStore.loadingBookingRecent}>
                      <OrderActivity />
                    </Skeleton>
                  </Box>
                </Flex>
              </FormControl>
            </Form>
          );
        }}
      </Formik>
    </>
  );
});

export default StatisticPage;
