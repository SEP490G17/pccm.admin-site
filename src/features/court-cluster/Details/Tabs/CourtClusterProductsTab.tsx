import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import ProductCardItemComponent from '@/features/court-cluster/Details/components/ProductTab/ProductCardItemComponent';
import { useStore } from '@/app/stores/store.ts';
import { useEffect } from 'react';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import CreateProductPage from '@/features/product/CreateProductPage';
import Select from 'react-select';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

const CourtClusterProductsTab = observer(() => {
  const { courtClusterStore, categoryStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    loadProductsOfCourtCluster,
    productOfCourtClusterArray,
    productOfClusterRegistry,
    loadingProductsPage,
    selectedCourtCluster,
    filterProductByCategory,
    productCourtClusterPageParams,
    loadingInitialProductPage,
    setLoadingInitialProductPage
  } = courtClusterStore;
  if (!selectedCourtCluster) return;
  const { loadCategories, categoryOption } = categoryStore;
  const toast = useToast();
  useEffect(() => {
    loadCategories(toast);
    if (productOfClusterRegistry.size <= 1) {
      setLoadingInitialProductPage(true);
      loadProductsOfCourtCluster(selectedCourtCluster.id, toast).then(()=>{
        setLoadingInitialProductPage(false);
      });
    }
    
  }, [
    loadCategories,
    loadProductsOfCourtCluster,
    productOfClusterRegistry.size,
    toast,
    selectedCourtCluster,
    setLoadingInitialProductPage
  ]);

  const handleChangeCategory = async ({ value }: { value: number; label: string }) => {
    await filterProductByCategory(value, selectedCourtCluster.id, toast);
  };

  return (
    <Box>
      <Heading as={'h5'} size={'md'} className={'mb-5'}>
        Danh sách hàng hóa thuộc cụm sân
      </Heading>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems={'center'}
        mb="1.5rem"
        flexWrap={'wrap'}
      >
        <Flex flexWrap={'wrap'} gap={'1rem'}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...categoryOption]}
            placeholder="Thể loại"
            className="w-56 rounded border-[0.5px solid #ADADAD] shadow-none hover:border-[0.5px solid #ADADAD] bg-white"
            onChange={async (e) => {
              if (e) {
                await handleChangeCategory({ value: e.value, label: e.label });
              }
            }}
            defaultValue={
              productCourtClusterPageParams.category
                ? {
                    value: productCourtClusterPageParams.category,
                    label:
                      categoryOption.find((x) => x.value === productCourtClusterPageParams.category)
                        ?.label ?? '',
                  }
                : null
            }
          ></Select>
        </Flex>
        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
            <Center gap={1}>
              <PlusIcon color="white" height="1.5rem" width="1.5rem" />
              Thêm mới
            </Center>
          </ButtonPrimaryAtoms>
        </Flex>
      </Flex>
      {!loadingInitialProductPage && (
        <>
          <Grid templateColumns={{ base: 'repeat(1,1fr)', xl: 'repeat(2,1fr)' }} gap={4}>
            {productOfCourtClusterArray.map((product) => (
              <ProductCardItemComponent key={product.id} product={product} />
            ))}
          </Grid>
          <Flex className='float-end'>
            <LoadMoreButtonAtoms hidden={productOfClusterRegistry.size >= productCourtClusterPageParams.totalElement} loading={loadingProductsPage} handleOnClick={()=>{loadProductsOfCourtCluster(selectedCourtCluster.id, toast)}}/>
          </Flex>
        </>
      )}
      {loadingProductsPage && (
        <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
          {Array.from({ length: 6 }, (_, index) => (
            <GridItem key={index}>
              <Skeleton height="11rem" />
            </GridItem>
          ))}
        </Grid>
      )}
      <CreateProductPage isOpen={isOpen} onClose={onClose} selectedCourtClusterId={selectedCourtCluster.id}/>
    </Box>
  );
});

export default CourtClusterProductsTab;
