import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Center, Heading, Button, InputProps, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import '../style.scss';
import { debounce } from 'lodash';
import Select from 'react-select';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useStore } from '@/app/stores/store';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import ServiceLogTableComponent from '../components/ServiceLogTableComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

interface IProps extends InputProps {
    setOpenServiceTab: (value: boolean) => void;
    openServiceTab?: boolean;
}

const ServiceTab = observer((props:IProps) => {
    const { serviceStore, courtClusterStore } = useStore();

    const {
        loadServices,
        loadServicesLog,
        filterLogByLogType,
        servicePageParams,
        serviceLogRegistry,
        serviceRegistry,
        serviceLogPageParams,
        setLoadingInitial,
        loading,
    } = serviceStore;
    const [isPending, setIsPending] = useState(false);
    const { courtClusterListAllOptions } = courtClusterStore;

    const logOption = [
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'Thêm dịch vụ' },
        { value: 2, label: 'Cập nhật dịch vụ' },
        { value: 3, label: 'Đặt dịch vụ' },
        { value: 4, label: 'Xóa dịch vụ' },
    ]

    const toast = useToast();

    useEffect(() => {
        if (serviceRegistry.size <= 1) {
            setLoadingInitial(true);
            loadServicesLog(toast);
            loadServices(toast).finally(() => setLoadingInitial(false));
        }
    }, [serviceRegistry, loadServicesLog, loadServices, setLoadingInitial, serviceLogRegistry,toast]);

    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
        if (scrollPosition >= documentHeight - 50) {
            serviceLogPageParams.skip = serviceLogRegistry.size;
            if (serviceLogPageParams.totalElement > serviceLogRegistry.size) {
                loadServicesLog(toast);
            }
        }
    }, [
        loadServicesLog,
        serviceLogPageParams,
        serviceLogRegistry,
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

    const handleSearchLog = useMemo(() => {
        return debounce(async (e) => {
            setIsPending(false); // Tắt loading
            await serviceStore.setSearchLogTerm(e.target.value,toast);
        }, 500);
    }, [setIsPending, serviceStore]);

    const onSearchLogChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            setIsPending(true);
            handleSearchLog(e);
        },
        [handleSearchLog, setIsPending],
    );


    const handleChangeLogType = async ({ value }: { value: number; label: string }) => {
        await filterLogByLogType(value,toast);
    };

    const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
        if (value1 && value2) {
            await serviceStore.filterLogByDate(
                value1.startOf('day').format('DD/MM/YYYY HH:mm:ss'),
                value2.endOf('day').format('DD/MM/YYYY HH:mm:ss'),
                toast
            );
        } else {
            await serviceStore.filterLogByDate(null, null,toast);
        }
    };

    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Dịch vụ', to: '/dich-vu' }]} />
            <Heading className="mb-4 mt-2">Danh sách dịch vụ</Heading>

            <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
                <Flex alignItems="center">

                    <Flex gap={3}>
                        <Select
                            options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
                            placeholder="Cụm sân"
                            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                            onChange={async (e) => {
                                if (e) {
                                    await serviceStore.setFilterTermLog(e.value.toString(),toast);
                                }
                            }}
                            defaultValue={{
                                value: serviceLogPageParams.courtCluster ?? 0,
                                label:
                                    courtClusterStore.courtClusterListAllRegistry.get(
                                        Number(serviceLogPageParams.courtCluster),
                                    )?.courtClusterName ?? 'Tất cả',
                            }}
                            isSearchable={true}
                        ></Select>
                        <Select
                            options={logOption}
                            placeholder="Loại log"
                            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                            onChange={async (e) => {
                                if (e) {
                                    await handleChangeLogType({ value: e.value, label: e.label });
                                }
                            }}
                            defaultValue={{
                                value: serviceLogPageParams.LogType ?? 0,
                                label:
                                    logOption.find(option => option.value === serviceLogPageParams.LogType)?.label ?? 'Tất cả',
                            }}
                            isSearchable={true}
                        ></Select>
                    </Flex>
                </Flex>

                <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
                    <DatePicker.RangePicker
                        format={'DD/MM/YYYY'}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        style={{ border: '0.5px solid #ADADAD' }}
                        onChange={(value) => {
                            if (value && value.length === 2) {
                                handleDateRangeChange(value[0], value[1]);
                            } else {
                                handleDateRangeChange(null, null);
                            }
                        }}
                        defaultValue={
                            serviceLogPageParams.fromDate && serviceLogPageParams.toDate
                                ? [dayjs(serviceLogPageParams.fromDate, 'DD/MM/YYYY'), dayjs(serviceLogPageParams.fromDate, 'DD/MM/YYYY')]
                                : undefined
                        }
                    />
                    <InputSearchBoxAtoms value={serviceLogPageParams.searchTerm} isPending={isPending} handleChange={onSearchLogChange} />
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
                        props.setOpenServiceTab(true);
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
            <ServiceLogTableComponent />

            <LoadMoreButtonAtoms
                handleOnClick={() => {
                    servicePageParams.skip = serviceRegistry.size;
                    loadServices(toast);
                }}
                hidden={serviceRegistry.size >= servicePageParams.totalElement}
                loading={loading}
            />
        </>
    );
});

export default ServiceTab;
