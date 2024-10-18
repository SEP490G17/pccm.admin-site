import { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Select, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateProductPage from './CreateProductPage';
import { debounce } from 'lodash';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import ProductTableComponent from './components/ProductTableComponent';

const ProductPage = observer(() => {
  const { productStore } = useStore();
  const { loadProducts, setLoadingInitial, productPageParams, productRegistry, setSearchTerm, loading } =
    productStore;

  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLoadingInitial(true);

    loadProducts().finally(() => setLoadingInitial(false));
  }, []);

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
  }, []);
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

  return (
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách sản phẩm', to: '/hang-hoa' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            width="149px"
            height="35px"
            borderRadius="4px"
            border="1px solid #ADADAD"
            bg="#FFF"
            color="#03301F"
          >
            <option value="">Cụm sân</option>
          </Select>
          <Select
            width="149px"
            height="35px"
            borderRadius="4px"
            border="1px solid #ADADAD"
            bg="#FFF"
            color="#03301F"
          >
            <option value="">Thể loại</option>
            
          </Select>
          <CreateProductPage />
        </Flex>

        <Box textAlign="right">
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
        </Box>
      </Flex>
      <ProductTableComponent />
      {productPageParams.totalElement > productRegistry.size && (
        <Flex justifyContent="end" alignItems="center" mb="1rem">
          <Button
            colorScheme="gray"
            isLoading={loading}
            onClick={() => {
              productPageParams.skip = productRegistry.size;
              loadProducts();
            }}
          >
            Xem thêm
          </Button>
        </Flex>
      )}
    </Flex>
  );
});

export default ProductPage;
