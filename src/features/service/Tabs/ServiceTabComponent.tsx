import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Heading, Button, InputProps, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import '../style.scss';
import { debounce } from 'lodash';
import Select from 'react-select';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import ServiceTableComponent from '../components/ServiceTableComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';
import CreateServicePage from '../CreateServicePage';

interface IProps extends InputProps {
    setOpenServiceTab: (value: boolean) => void;
    openServiceTab?: boolean;
}

const ServiceLogTab = observer((props: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { serviceStore, courtClusterStore } = useStore();

    const {
        loadServices,
        loadServicesLog,
        servicePageParams,
        serviceLogRegistry,
        serviceRegistry,
        setLoadingInitial,
        loading,
    } = serviceStore;
    const [isPending, setIsPending] = useState(false);
    const { courtClusterListAllOptions } = courtClusterStore;
    const toast = useToast();
    useEffect(() => {
        if (serviceRegistry.size <= 1) {
            setLoadingInitial(true);
            loadServicesLog(toast);
            loadServices(toast).finally(() => setLoadingInitial(false));
        }
    }, [serviceRegistry, loadServicesLog, loadServices, setLoadingInitial, serviceLogRegistry, toast]);

    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
        if (scrollPosition >= documentHeight - 50) {
            servicePageParams.skip = serviceRegistry.size;
            if (servicePageParams.totalElement > serviceRegistry.size) {
                loadServices(toast);
            }
        }
    }, [
        loadServices,
        servicePageParams,
        serviceRegistry.size,
        toast
    ]);

    // Gắn sự kiện cuộn
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Cleanup listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleSearchDebounced = useMemo(() => {
        return debounce(async (e) => {
            setIsPending(false); // Tắt loading
            await serviceStore.setSearchTerm(e.target.value,toast);
        }, 500);
    }, [setIsPending, serviceStore, toast]);

    const onSearchChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            setIsPending(true);
            handleSearchDebounced(e);
        },
        [handleSearchDebounced, setIsPending],
    );

    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Dịch vụ', to: '/dich-vu' }]} />
            <Heading className="mb-4 mt-2">Danh sách dịch vụ</Heading>

            <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
                <Flex alignItems="center">

                    <Select
                        options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
                        placeholder="Cụm sân"
                        className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                        onChange={async (e) => {
                            if (e) {
                                await serviceStore.setFilterTerm(e.value.toString(),toast);
                            }
                        }}
                        isSearchable={true}
                        defaultValue={{
                            value: Number(servicePageParams.filter ?? 0),

                            label:
                                courtClusterStore.courtClusterListAllRegistry.get(
                                    Number(servicePageParams.filter),
                                )?.courtClusterName ?? 'Tất cả',
                        }}
                    ></Select>


                </Flex>

                <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
                    <InputSearchBoxAtoms value={servicePageParams.searchTerm} isPending={isPending} handleChange={onSearchChange} />
                    <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
                        <Center gap={1}>
                            <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                            Thêm mới
                        </Center>
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
                        props.openServiceTab
                            ? { backgroundColor: '#115363', color: 'white' }
                            : { backgroundColor: '#b7b7b7', color: 'white' }
                    }
                    onClick={() => {
                        props.setOpenServiceTab(true)
                    }}
                >
                    <Center gap={1}>Danh sách dịch vụ</Center>
                </Button>
                <Button
                    style={
                        !props.openServiceTab
                            ? { backgroundColor: '#115363', color: 'white' }
                            : { backgroundColor: '#b7b7b7', color: 'white' }
                    }
                    onClick={() => {
                        props.setOpenServiceTab(false)
                    }}
                >
                    <Center gap={1}>Danh sách log</Center>
                </Button>
            </Flex>
            <ServiceTableComponent />

            <LoadMoreButtonAtoms
                handleOnClick={() => {
                    servicePageParams.skip = serviceRegistry.size;
                    loadServices(toast);
                }}
                hidden={serviceRegistry.size >= servicePageParams.totalElement}
                loading={loading}
            />
            <CreateServicePage isOpen={isOpen} onClose={onClose} />
        </>
    );
});

export default ServiceLogTab;
