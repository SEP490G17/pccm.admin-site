import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Button, Heading, InputProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import '../style.scss';
import { debounce } from 'lodash';
import Select from 'react-select';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import { useStore } from '@/app/stores/store';
import ProductTableComponent from '../components/ProductTableComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';
import CreateProductPage from '../CreateProductPage';
import CategoryPopUp from '@/features/category/CategoryPopUp';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';

interface IProps extends InputProps {
    setOpenProductTab: (value: boolean) => void;
    openProductTab?: boolean;
}
const ProductTab = observer((props: IProps) => {
    const { productStore, categoryStore, courtClusterStore } = useStore();
    const {
        loadProducts,
        setLoadingInitial,
        productPageParams,
        productRegistry,
        productLogRegistry,
        setSearchTerm,
        loading,
        loadingCreate,
        filterByCategory,
        filterByCourtCluster,
        loadProductsLog,
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
        if (productRegistry.size <= 1) {
            setLoadingInitial(true);
            Promise.all([
                loadProducts(),
                loadProductsLog(),
                loadCategories(),
                courtClusterStore.loadCourtClusterListAll(),
            ]).finally(() => setLoadingInitial(false));
        }
    }, [courtClusterStore, loadCategories, loadProducts, setLoadingInitial, loadProductsLog, productRegistry, productLogRegistry]);

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
    }, [
        loadProducts,
        productPageParams,
        productRegistry.size,
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
                        defaultValue={{
                            value: productPageParams.courtCluster ?? 0,
                            label:
                                courtClusterStore.courtClusterListAllRegistry.get(
                                    Number(productPageParams.courtCluster),
                                )?.courtClusterName ?? 'Tất cả',
                        }}
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
                        defaultValue={{
                            value: productPageParams.category ?? 0,
                            label:
                                categoryStore.categoryRegistry.get(Number(productPageParams.category))?.categoryName ??
                                'Tất cả',
                        }}
                    ></Select>
                </Flex>
                <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
                    <InputSearchBoxAtoms value={productPageParams.searchTerm} handleChange={onSearchChange} isPending={isPending} />
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

export default ProductTab;
