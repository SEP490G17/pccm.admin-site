import { useCallback, useEffect, useState } from 'react';
import { Flex, useDisclosure, Center, Heading } from '@chakra-ui/react';
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

const ProductPage = observer(() => {
  const { productStore, categoryStore, courtClusterStore } = useStore();
  const {
    loadProducts,
    setLoadingInitial,
    productPageParams,
    productRegistry,
    setSearchTerm,
    loading,
    loadingCreate,
    filterByCategory,
    filterByCourtCluster,
    loadingInitial,
  } = productStore;
  const { loadCategories } = categoryStore;
  const [isPending, setIsPending] = useState(false);
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
      loadCategories(),
      courtClusterStore.loadCourtClusterListAll(),
    ]).finally(() => setLoadingInitial(false));
  }, [courtClusterStore, loadCategories, loadProducts, setLoadingInitial]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      productPageParams.skip = productRegistry.size;
      if (productPageParams.totalElement > productRegistry.size) {
        loadProducts();
      }
    }
  }, [loadProducts, productPageParams, productRegistry.size]);

  const handleSearch = useCallback(
    debounce(async (e) => {
      setIsPending(false); // Bật loading khi người dùng bắt đầu nhập
      await setSearchTerm(e.target.value);
    }, 500), // Debounce với thời gian 1 giây
    [],
  );
  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPending(true); // Bật loading khi người dùng bắt đầu nhập
    await handleSearch(e); // Gọi hàm debounce
  };
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
                await handleChangeCourtCluster({ value: e.value, label: e.label });
              }
            }}
            isSearchable={true}
          ></Select>
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
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
          <ButtonPrimaryAtoms
            className="bg-primary-900"
            handleOnClick={onOpen}
            loading={loadingCreate || loadingInitial}
            children={
              <Center gap={1}>
                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                Thêm mới
              </Center>
            }
          />
          <ButtonPrimaryAtoms
            className="bg-primary-900"
            handleOnClick={onCategoryOpen}
            children={<Center gap={1}>Danh sách thể loại</Center>}
          />
        </Flex>
      </Flex>
      <ProductTableComponent />

      <LoadMoreButtonAtoms
        handleOnClick={() => {
          productPageParams.skip = productRegistry.size;
          loadProducts();
        }}
        hidden={productRegistry.size >= productPageParams.totalElement}
        loading={loading}
      />
      <CreateProductPage isOpen={isOpen} onClose={onClose} />
      <CategoryPopUp isOpen={isCategoryOpen} onClose={onCategoryClose} />
    </>
  );
});

export default ProductPage;
