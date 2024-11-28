import { Box, Grid, GridItem, Heading, Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/app/stores/store.ts';
import { useEffect } from 'react';
import ProductCardItemSellComponent from '../Product/ProductCardItemSellComponent';
import Select from 'react-select';

interface IProps {
  courtClusterId: number;
}
const BookingProductTab = observer(({ courtClusterId }: IProps) => {
  const { courtClusterStore, categoryStore } = useStore();
  const {
    loadProductsOfCourtCluster,
    productOfCourtClusterArray,
    productOfClusterRegistry,
    loadingProductsPage,
  } = courtClusterStore;
  const toast = useToast();
  useEffect(() => {
    if (productOfClusterRegistry.size <=1) {
      loadProductsOfCourtCluster(courtClusterId,toast);
    }
  }, [loadProductsOfCourtCluster, productOfClusterRegistry, courtClusterId, toast]);


  return (
    <Box>
      <Select
        options={[{ value: 0, label: 'Tất cả' }, ...categoryStore.categoryOption]}
        placeholder="Thể loại"
        className="w-56 rounded border-[0.5px solid #ADADAD] shadow-none hover:border-[0.5px solid #ADADAD]"

        isSearchable={true}
      ></Select>
      <Heading as={'h5'} size={'md'} className={'mb-5'}>
        Danh sách hàng hóa thuộc cụm sân
      </Heading>
      {!loadingProductsPage && (
        <Grid
          templateColumns={'repeat(2,1fr)'}
          p={2}
          gap={4}
          maxHeight={'40rem'}
          overflowY={'auto'}
        >
          {productOfCourtClusterArray.map((product) => (
            <ProductCardItemSellComponent key={product.id} product={product} />
          ))}
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
  );
});

export default BookingProductTab;
