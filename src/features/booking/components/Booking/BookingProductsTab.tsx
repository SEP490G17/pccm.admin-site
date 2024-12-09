import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Skeleton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/stores/store.ts';
import ProductCardItemSellComponent from '../Product/ProductCardItemSellComponent';
import Select from 'react-select';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';
import { TfiReload } from 'react-icons/tfi';

interface IProps {
  courtClusterId: number;
  isEdit?: boolean;
}
const BookingProductTab = observer(({ courtClusterId, isEdit = false }: IProps) => {
  const { courtClusterStore, categoryStore } = useStore();
  const {
    loadProductsOfCourtCluster,
    productOfCourtClusterArray,
    productOfClusterRegistry,
    loadingProductsPage,
    loadingInitialProductPage,
    productCourtClusterPageParams,
  } = courtClusterStore;
  const toast = useToast();
  const handleChangeCategory = async ({ value }: { value: number; label: string }) => {
    await courtClusterStore.filterProductByCategory(value, courtClusterId, toast);
  };

  const handleReset = async () => {
    productCourtClusterPageParams.reset();
    productCourtClusterPageParams.clearLazyPage();
    productOfClusterRegistry.clear();
    await loadProductsOfCourtCluster(courtClusterId, toast);
  };

  return (
    <Box>
      <Flex className="justify-between">
        <Heading as={'h5'} size={'md'} className={'mb-5'}>
          Danh sách hàng hóa thuộc cụm sân
        </Heading>
        <Flex gap={2}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...categoryStore.categoryOption]}
            placeholder="Thể loại"
            className="w-56 rounded border-[0.5px solid #ADADAD] shadow-none hover:border-[0.5px solid #ADADAD] bg-white"
            onChange={async (e) => {
              if (e) {
                await handleChangeCategory({ value: e.value, label: e.label });
              }
            }}
            value={
              productCourtClusterPageParams.category
                ? {
                    value: productCourtClusterPageParams.category,
                    label:
                      categoryStore.categoryOption.find(
                        (x) => x.value === productCourtClusterPageParams.category,
                      )?.label ?? '',
                  }
                : null
            }
          />

          <Tooltip label={'Tải lại'} placement="top">
            <IconButton
              icon={<TfiReload />}
              aria-label="Tải lại"
              onClick={handleReset}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Box className="h-[40rem] overflow-auto">
        {!loadingInitialProductPage && (
          <Grid templateColumns={'repeat(2,1fr)'} p={2} gap={4}>
            {productOfCourtClusterArray.map((product) => (
              <ProductCardItemSellComponent key={product.id} product={product} isEdit={isEdit} />
            ))}
            <Flex className="justify-end">
              <LoadMoreButtonAtoms
                loading={loadingProductsPage}
                hidden={productOfClusterRegistry.size >= productCourtClusterPageParams.totalElement}
                handleOnClick={() => loadProductsOfCourtCluster(courtClusterId, toast)}
              />
            </Flex>
          </Grid>
        )}
        {loadingProductsPage && (
          <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
            {Array.from({ length: 6 }, (_, index) => (
              <GridItem key={index} colSpan={{ base: 2, xl: 1 }}>
                <Skeleton height="11rem" />
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
});

export default BookingProductTab;
