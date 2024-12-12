import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import LazyImageAtom from '@/features/atoms/LazyImageAtom.tsx';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom.tsx';
import { observer } from 'mobx-react-lite';
import { Product } from '@/app/models/product.model.ts';
import { useStore } from '@/app/stores/store.ts';
import EditProductPage from '@/features/product/EditProductPage';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';

interface Iprops {
  product: Product;
}

const ProductCardItemComponent = observer(({ product }: Iprops) => {
  const { productStore, commonStore } = useStore();
  const { detailProduct } = productStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleOpenEdit = async (id: number) => {
    onOpen();
    await detailProduct(id, toast);
  };
  const handleDelete = async (id: number) => {
    await productStore.deleteProduct(id, toast);
  };
  return (
    <>
      <GridItem height={'12rem'}>
        <Grid
          templateColumns={'repeat(24,1fr)'}
          className={'h-44 bg-white px-3 py-3 rounded-md'}
          gap={4}
        >
          <GridItem colSpan={8} className={'h-full flex items-center'}>
            <LazyImageAtom
              width={'14.5rem'}
              height={'9rem'}
              objectFit={'cover'}
              className={'rounded-md'}
              src={product.thumbnailUrl}
              alt={product.productName}
            />
          </GridItem>
          <GridItem colSpan={12}>
            <Flex className={'flex-col py-2 gap-2 h-full'}>
              <Heading fontSize={'1.5rem'} mb={1} fontWeight={'bold'}>
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
          <GridItem colSpan={4} className={'flex justify-end float-end'}>
            <Flex justifyContent="flex-end" className={'items-end gap-2'}>
              {commonStore.isEditSuppliesAble() ? (
                <>
                  <EditButtonAtom
                    onUpdate={async () => await handleOpenEdit(product.id)}
                    buttonSize={'md'}
                    buttonContent={'Sửa'}
                    name={'Hàng hoá'}
                    header="Chỉnh sửa"
                    buttonClassName="gap-2"
                  ></EditButtonAtom>
                  <DeleteButtonAtom
                    buttonSize={'md'}
                    name={'Hàng hóa'}
                    header={'Hàng hóa'}
                    loading={false}
                    buttonContent={'Xóa'}
                    buttonClassName={'gap-2 '}
                    onDelete={async () => await handleDelete(product.id)}
                  />
                </>
              ) : (
                <Tag size={'md'} colorScheme={product.quantity > 0 ? 'green' : 'red'}>
                  <TagLabel>Còn hàng</TagLabel>
                </Tag>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </GridItem>
      <EditProductPage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ProductCardItemComponent;
