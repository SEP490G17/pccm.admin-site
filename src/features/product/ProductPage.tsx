import { useCallback, useEffect, useState } from 'react';
import { Flex, useDisclosure, Center } from '@chakra-ui/react';
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

const ProductPage = observer(() => {
    const { productStore, categoryStore, courtClusterStore } = useStore();
    const {
        loadProducts,
        setLoadingInitial,
        productPageParams,
        productRegistry,
        setSearchTerm,
        loading,
        loadingInitial,
        filterByCategory,
        filterByCourtCluster
    } = productStore;
    const { loadCategories } = categoryStore;
    const [isPending, setIsPending] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        setLoadingInitial(true);
        Promise.all([loadProducts(), loadCategories(), courtClusterStore.loadCourtClusterListAll()]).then(() =>
            setLoadingInitial(false),
        );
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
    const handleChangeCategory = async ({ value }: { value: number, label: string }) => {
        await filterByCategory(value);
    }
    const handleChangeCourtCluster = async ({ value }: { value: number, label: string }) => {
        await filterByCourtCluster(value);

    }
    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách sản phẩm', to: '/hang-hoa' }]} />

            <Flex
                width="100%"
                justifyContent="space-between"
                alignItems={'center'}
                mb="1.5rem"
                flexWrap={'wrap'}
            >
                <Flex flexWrap={'wrap'} gap={'1rem'}>
                    <Select
                        options={[{ value: 0, label: 'Tất cả' }, ...courtClusterStore.courtClusterListAllOptions]}
                        placeholder="Cụm sân"
                        className='w-56 p-2 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]'
                        onChange={async (e) => {
                            if (e) {
                                await handleChangeCourtCluster({ value: e.value, label: e.label });
                            }
                        }}
                        isSearchable={true}
                    >
                    </Select>
                    <Select
                        options={[{ value: 0, label: 'Tất cả' }, ...categoryStore.categoryOption]}
                        placeholder="Thể loại"
                        className='w-56 p-2 rounded border-[0.5px solid #ADADAD] shadow-none hover:border-[0.5px solid #ADADAD]'
                        onChange={async (e) => {
                            if (e) {
                                await handleChangeCategory({ value: e.value, label: e.label });
                            }
                        }}
                        isSearchable={true}
                    >
                    </Select>

                    {/* <Select
            size={'md'}
            borderRadius="4px"
            w={'10rem'}
            border="1px solid #ADADAD"
            bg="#FFF"
            color="#03301F"
          >
            <option value="">Thể loại</option>
            {categoryArray.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </Select> */}
                </Flex>

                <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
                    <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
                    {/* <Button
            colorScheme="teal"
            variant={'outline'}
            size="md"
            leftIcon={<FaEdit />}
            bg={'white'}
            border="1px solid #ADADAD"
            onClick={onOpen}
          >
            Thêm mới
          </Button> */}
                    <ButtonPrimaryAtoms
                        className="bg-primary-900"
                        handleOnClick={onOpen}
                        loading={loadingInitial}
                        children={
                            <Center gap={1}>
                                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                                Thêm mới
                            </Center>
                        }
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
        </>
    );
});

export default ProductPage;
