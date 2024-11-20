import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Heading, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateProductPage from './CreateProductPage';
import { debounce } from 'lodash';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import ProductTableComponent from './components/ProductTableComponent';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';
import Select from 'react-select';
import CategoryPopUp from '../category/CategoryPopUp';
import ProductLogTableComponent from './components/ProductLogTableComponent';
import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';

const ProductPage = observer(() => {
  const { productStore, categoryStore, courtClusterStore } = useStore();
  const {
    loadProducts,
    setLoadingInitial,
    productPageParams,
    productRegistry,
    productLogRegistry,
    setSearchTerm,
    setSearchTermProductLog,
    loading,
    loadingLog,
    loadingCreate,
    productLogPageParams,
    filterByCategory,
    filterByCourtCluster,
    filterLogByCourtCluster,
    loadProductsLog,
    filterLogByLogType,
  } = productStore;
  const { loadCategories } = categoryStore;
  const [isPending, setIsPending] = useState(false);
  const [openProductList, setOpenProductList] = useState(true);
  const [openProductLog, setOpenProductLog] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCategoryOpen,
    onOpen: onCategoryOpen,
    onClose: onCategoryClose,
  } = useDisclosure();

  useEffect(() => {
    setLoadingInitial(true);
    Promise.all([
      loadProducts(),
      loadProductsLog(),
      loadCategories(),
      courtClusterStore.loadCourtClusterListAll(),
    ]).finally(() => setLoadingInitial(false));
  }, [courtClusterStore, loadCategories, loadProducts, setLoadingInitial, loadProductsLog]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      if (openProductList) {
        productPageParams.skip = productRegistry.size;
        if (productPageParams.totalElement > productRegistry.size) {
          loadProducts();
        }
      } else if (openProductLog) {
        productLogPageParams.skip = productLogRegistry.size;
        if (productLogPageParams.totalElement > productLogRegistry.size) {
          loadProductsLog();
        }
      }
    }
  }, [
    openProductList,
    openProductLog,
    loadProducts,
    loadProductsLog,
    productPageParams,
    productRegistry.size,
    productLogPageParams,
    productLogRegistry,
  ]);

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setSearchTerm(e.target.value);
    }, 500);
  }, [setIsPending, setSearchTerm]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  const handleSearchProductLog = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setSearchTermProductLog(e.target.value);
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
  const handleChangeCategory = async ({ value }: { value: number; label: string }) => {
    await filterByCategory(value);
  };
  const handleChangeCourtCluster = async ({ value }: { value: number; label: string }) => {
    await filterByCourtCluster(value);
  };

  const handleChangeCourtClusterLog = async ({ value }: { value: number; label: string }) => {
    await filterLogByCourtCluster(value);
  };

  const handleChangeLogType = async ({ value }: { value: number; label: string }) => {
    await filterLogByLogType(value);
  };

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await productStore.filterLogByDate(
        value1.startOf('day').format('DD/MM/YYYY HH:mm:ss'),
        value2.endOf('day').format('DD/MM/YYYY HH:mm:ss'),
      );
    } else {
      await productStore.filterLogByDate(null, null);
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
                if (openProductList && !openProductLog) {
                  await handleChangeCourtCluster({ value: e.value, label: e.label });
                } else {
                  await handleChangeCourtClusterLog({ value: e.value, label: e.label });
                }
              }
            }}
            isSearchable={true}
            defaultValue={{
              value: productPageParams.courtCluster ?? 0,
              label:
                courtClusterStore.courtClusterListAllRegistry.get(
                  Number(productPageParams.courtCluster),
                )?.courtClusterName ?? 'Tất cả',
            }}
          ></Select>
          {openProductLog && (
            <Select
              options={[
                { value: 0, label: 'Tất cả' },
                { value: 1, label: 'Nhập hàng' },
                { value: 2, label: 'Cập nhật hàng' },
                { value: 3, label: 'Đặt hàng' },
                { value: 4, label: 'Xóa hàng' },
              ]}
              placeholder="Loại log"
              className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
              onChange={async (e) => {
                if (e) {
                  await handleChangeLogType({ value: e.value, label: e.label });
                }
              }}
              isSearchable={true}
            ></Select>
          )}

          {openProductList && (
            <Select
              options={[{ value: 0, label: 'Tất cả' }, ...categoryStore.categoryOption]}
              placeholder="Thể loại"
              className="w-56 rounded border-[0.5px solid #ADADAD] shadow-none hover:border-[0.5px solid #ADADAD]"
              onChange={async (e) => {
                if (e) {
                  await handleChangeCategory({ value: e.value, label: e.label });
                }
              }}
              isSearchable={true}
            ></Select>
          )}
        </Flex>
        {openProductList && (
          <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
            <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
            <ButtonPrimaryAtoms
              className="bg-primary-900"
              handleOnClick={onOpen}
              loading={loadingCreate}
            >
              <Center gap={1}>
                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                Thêm mới
              </Center>
            </ButtonPrimaryAtoms>
            <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onCategoryOpen}>
              <Center gap={1}>Danh sách thể loại</Center>
            </ButtonPrimaryAtoms>
          </Flex>
        )}
        {openProductLog && (
          <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
            <DatePicker.RangePicker
              format={'DD/MM/YYYY'}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              style={{ border: '0.5px solid #ADADAD' }}
              onChange={(value) => {
                if (value && value.length === 2) {
                  handleDateRangeChange(value[0], value[1]);
                } else {
                  handleDateRangeChange(null, null);
                }
              }}
            />
            <InputSearchBoxAtoms handleChange={onSearchChangeProductLog} isPending={isPending} />
          </Flex>
        )}
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
            openProductList
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            setOpenProductList(true);
            setOpenProductLog(false);
          }}
        >
          <Center gap={1}>Danh sách hàng hóa</Center>
        </Button>
        <Button
          style={
            openProductLog
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            setOpenProductList(false);
            setOpenProductLog(true);
          }}
        >
          <Center gap={1}>Danh sách log</Center>
        </Button>
      </Flex>
      {openProductList && (
        <>
          <ProductTableComponent />

          <LoadMoreButtonAtoms
            handleOnClick={() => {
              productPageParams.skip = productRegistry.size;
              loadProducts();
            }}
            hidden={productRegistry.size >= productPageParams.totalElement}
            loading={loading}
          />
        </>
      )}

      {openProductLog && (
        <>
          <ProductLogTableComponent />

          <LoadMoreButtonAtoms
            handleOnClick={() => {
              productLogPageParams.skip = productLogRegistry.size;
              loadProductsLog();
            }}
            hidden={productLogRegistry.size >= productLogPageParams.totalElement}
            loading={loadingLog}
          />
        </>
      )}

      <CreateProductPage isOpen={isOpen} onClose={onClose} />
      <CategoryPopUp isOpen={isCategoryOpen} onClose={onCategoryClose} />
    </>
  );
});

export default ProductPage;
