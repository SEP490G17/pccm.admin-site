import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Center, Heading, Button, InputProps, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import '../style.scss';
import { debounce } from 'lodash';
import Select from 'react-select';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ProductLogTableComponent from '../components/ProductLogTableComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

interface IProps extends InputProps {
  setOpenProductTab: (value: boolean) => void;
  openProductTab?: boolean;
}

const ProductLogTab = observer((props: IProps) => {
  const { productStore, categoryStore, courtClusterStore } = useStore();
  const {
    loadProducts,
    setLoadingInitial,
    productPageParams,
    productRegistry,
    productLogRegistry,
    setSearchTermProductLog,
    loadingLog,
    productLogPageParams,
    filterLogByCourtCluster,
    loadProductsLog,
    filterLogByLogType,
  } = productStore;
  const { loadCategories } = categoryStore;
  const [isPending, setIsPending] = useState(false);
  const toast = useToast();
  const logOption = [
    { value: 0, label: 'Tất cả' },
    { value: 1, label: 'Nhập hàng' },
    { value: 2, label: 'Cập nhật hàng' },
    { value: 3, label: 'Đặt hàng' },
    { value: 4, label: 'Xóa hàng' },
  ];

  useEffect(() => {
    if (productRegistry.size <= 1) {
      setLoadingInitial(true);
      Promise.all([
        loadProducts(toast),
        loadProductsLog(toast),
        loadCategories(toast),
        courtClusterStore.loadCourtClusterListAll(),
      ]).finally(() => setLoadingInitial(false));
    }
  }, [
    courtClusterStore,
    loadCategories,
    loadProducts,
    setLoadingInitial,
    loadProductsLog,
    productRegistry,
    productLogRegistry,
    toast
  ]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      productLogPageParams.skip = productLogRegistry.size;
      if (productLogPageParams.totalElement > productLogRegistry.size) {
        loadProductsLog(toast);
      }
    }
  }, [loadProductsLog, productLogPageParams, productLogRegistry]);

  const handleSearchProductLog = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setSearchTermProductLog(e.target.value, toast);
    }, 500);
  }, [setIsPending, setSearchTermProductLog]);

  const onSearchChangeProductLog = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchProductLog(e);
    },
    [handleSearchProductLog, setIsPending],
  );

  // Gắn sự kiện cuộn
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleChangeCourtClusterLog = async ({ value }: { value: number; label: string }) => {
    await filterLogByCourtCluster(value, toast);
  };

  const handleChangeLogType = async ({ value }: { value: number; label: string }) => {
    await filterLogByLogType(value, toast);
  };

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await productStore.filterLogByDate(
        value1.startOf('day').format('DD/MM/YYYY HH:mm:ss'),
        value2.endOf('day').format('DD/MM/YYYY HH:mm:ss'),
        toast,
      );
    } else {
      await productStore.filterLogByDate(null, null, toast);
    }
  };

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Hàng hoá', to: '/hang-hoa' }]} />

      <Heading className="mb-4 mt-2">Danh sách hàng hoá</Heading>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems={'center'}
        mb="1.5rem"
        flexWrap={'wrap'}
      >
        <Flex flexWrap={'wrap'} gap={'1rem'}>
          <Select
            options={[
              { value: 0, label: 'Tất cả' },
              ...courtClusterStore.courtClusterListAllOptions,
            ]}
            placeholder="Cụm sân"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await handleChangeCourtClusterLog({ value: e.value, label: e.label });
              }
            }}
            isSearchable={true}
            defaultValue={{
              value: productLogPageParams.courtCluster ?? 0,
              label:
                courtClusterStore.courtClusterListAllRegistry.get(
                  Number(productPageParams.courtCluster),
                )?.courtClusterName ?? 'Tất cả',
            }}
          ></Select>

          <Select
            options={logOption}
            placeholder="Loại log"
            defaultValue={{
              value: productLogPageParams.LogType ?? 0,
              label:
                logOption.find((option) => option.value === productLogPageParams.LogType)?.label ??
                'Tất cả',
            }}
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await handleChangeLogType({ value: e.value, label: e.label });
              }
            }}
            isSearchable={true}
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <DatePicker.RangePicker
            format={'DD/MM/YYYY'}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            style={{ border: '0.5px solid #ADADAD' }}
            defaultValue={
              productLogPageParams.fromDate && productLogPageParams.toDate
                ? [
                    dayjs(productLogPageParams.fromDate, 'DD/MM/YYYY'),
                    dayjs(productLogPageParams.fromDate, 'DD/MM/YYYY'),
                  ]
                : undefined
            }
            onChange={(value) => {
              if (value && value.length === 2) {
                handleDateRangeChange(value[0], value[1]);
              } else {
                handleDateRangeChange(null, null);
              }
            }}
          />
          <InputSearchBoxAtoms
            value={productLogPageParams.searchTerm}
            handleChange={onSearchChangeProductLog}
            isPending={isPending}
          />
        </Flex>
      </Flex>
      <Flex
        width="100%"
        justifyContent="flex-start"
        alignItems="center"
        mb="1.5rem"
        gap={4}
        flexWrap="wrap"
      >
        <Button
          style={
            props.openProductTab
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            props.setOpenProductTab(true);
          }}
        >
          <Center gap={1}>Danh sách hàng hóa</Center>
        </Button>
        <Button
          style={
            !props.openProductTab
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            props.setOpenProductTab(false);
          }}
        >
          <Center gap={1}>Danh sách log</Center>
        </Button>
      </Flex>

      <ProductLogTableComponent />

      <LoadMoreButtonAtoms
        handleOnClick={() => {
          productLogPageParams.skip = productLogRegistry.size;
          loadProductsLog(toast);
        }}
        hidden={productLogRegistry.size >= productLogPageParams.totalElement}
        loading={loadingLog}
      />
    </>
  );
});

export default ProductLogTab;
