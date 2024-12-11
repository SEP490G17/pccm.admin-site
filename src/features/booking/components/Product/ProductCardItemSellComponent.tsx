import { Flex, Grid, GridItem, Heading, Spacer, Text } from '@chakra-ui/react';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import { observer } from 'mobx-react-lite';
import { Product } from '@/app/models/product.model.ts';
import { useStore } from '@/app/stores/store';
import { PaymentStatus } from '@/app/models/payment.model';

interface Iprops {
  product: Product;
  isEdit?: boolean;
}
const ProductCardItemSellComponent = observer(({ product, isEdit = false }: Iprops) => {
  const { bookingStore } = useStore();
  const {
    addProductToOrder,
    selectedProductItems,
    selectedOrder,
    orderOfBooking,
    addProductToOrderUpdate,
    updateProductItems,
  } = bookingStore;

  const checkIsPaymentSuccess = () => {
    return (
      selectedOrder &&
      orderOfBooking.find((o) => o.id == selectedOrder.id)?.paymentStatus === PaymentStatus.Success
    );
  };
  const handleAddProductToOrder = (productId: number) => {
    
    if (!isEdit) {
      addProductToOrder(productId);
    }else{
      if (!checkIsPaymentSuccess()) {
        addProductToOrderUpdate(productId);
      } 
    }
  };
  const isSelected = isEdit
    ? updateProductItems.get(product.id) !== undefined
    : selectedProductItems.get(product.id) !== undefined;

  return (
    <GridItem key={product.id} colSpan={{ base: 2, xl: 1 }}>
      <Grid
        templateColumns={'repeat(24,1fr)'}
        className={`h-44  px-3 py-3 rounded-md cursor-pointer 
            ${isSelected && 'bg-green-200'} `}
        gap={4}
        onClick={() => handleAddProductToOrder(product.id)}
        style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}
      >
        <GridItem colSpan={12} className={'h-full flex items-center'}>
          <LazyImageAtom
            width={'14.5rem'}
            maxHeight={'9rem'}
            objectFit={'cover'}
            className={'rounded-md'}
            src={product.thumbnailUrl}
            alt={product.productName}
          />
        </GridItem>
        <GridItem colSpan={12}>
          <Flex className={'flex-col py-2 gap-2 h-full'}>
            <Heading
              fontSize={'1.2rem'}
              mb={1}
              fontWeight={'bold'}
              className="overflow-hidden text-ellipsis whitespace-nowrap w-full"
            >
              {product.productName}
            </Heading>
            <Text fontWeight={'medium'} fontSize={'0.9rem'}>
              Thể loại: {product.categoryName}
            </Text>
            <Text fontWeight={'medium'} fontSize={'0.9rem'}>
              Số lượng: {product.quantity}
            </Text>
            <Spacer />
            <Heading size={'sm'}>Giá tiền : {product.price.toLocaleString('vn')} VND</Heading>
          </Flex>
        </GridItem>
      </Grid>
    </GridItem>
  );
});

export default ProductCardItemSellComponent;
