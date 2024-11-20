import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, useDisclosure, Center, Heading, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import ServiceTableComponent from './components/ServiceTableComponent';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import CreateServicePage from './CreateServicePage';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';
import Select from 'react-select';
import ServiceLogTableComponent from './components/ServiceLogTableComponent';
import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';

const ServicePage = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const [openServiceList, setOpenServiceList] = useState(true);
  const [openServiceLog, setOpenServiceLog] = useState(false);
  const { courtClusterListAllOptions } = courtClusterStore;

  useEffect(() => {
    setLoadingInitial(true);
    if (serviceRegistry.size <= 1) {
      loadServicesLog();
      loadServices().finally(() => setLoadingInitial(false));
    }
  }, [serviceRegistry, loadServicesLog, loadServices, setLoadingInitial]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      if (openServiceList) {
        servicePageParams.skip = serviceRegistry.size;
        if (servicePageParams.totalElement > serviceRegistry.size) {
          loadServices();
        }
      } else if (openServiceLog) {
        serviceLogPageParams.skip = serviceLogRegistry.size;
        if (serviceLogPageParams.totalElement > serviceLogRegistry.size) {
          loadServicesLog();
        }
      }
    }
  }, [
    openServiceList,
    openServiceLog,
    loadServices,
    loadServicesLog,
    servicePageParams,
    serviceRegistry.size,
    serviceLogPageParams,
    serviceLogRegistry,
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
      await serviceStore.setSearchLogTerm(e.target.value);
    }, 500);
  }, [setIsPending, serviceStore]);

  const onSearchLogChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchLog(e);
    },
    [handleSearchLog, setIsPending],
  );

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await serviceStore.setSearchTerm(e.target.value);
    }, 500);
  }, [setIsPending, serviceStore]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  const handleChangeLogType = async ({ value }: { value: number; label: string }) => {
    await filterLogByLogType(value);
  };

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await serviceStore.filterLogByDate(
        value1.startOf('day').format('DD/MM/YYYY HH:mm:ss'),
        value2.endOf('day').format('DD/MM/YYYY HH:mm:ss'),
      );
    } else {
      await serviceStore.filterLogByDate(null, null);
    }
  };

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Dịch vụ', to: '/dich-vu' }]} />
      <Heading className="mb-4 mt-2">Danh sách dịch vụ</Heading>

      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex alignItems="center">
          {openServiceList ? (
            <Select
              options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
              placeholder="Cụm sân"
              className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
              onChange={async (e) => {
                if (e) {
                  await serviceStore.setFilterTerm(e.value.toString());
                }
              }}
              isSearchable={true}
            ></Select>
          ) : (
            <Flex gap={3}>
              <Select
                options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
                placeholder="Cụm sân"
                className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                onChange={async (e) => {
                  if (e) {
                    await serviceStore.setFilterTermLog(e.value.toString());
                  }
                }}
                isSearchable={true}
              ></Select>
              <Select
                options={[
                  { value: 0, label: 'Tất cả' },
                  { value: 1, label: 'Thêm dịch vụ' },
                  { value: 2, label: 'Cập nhật dịch vụ' },
                  { value: 3, label: 'Đặt dịch vụ' },
                  { value: 4, label: 'Xóa dịch vụ' },
                ]}
                placeholder="Loại log"
                className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                onChange={async (e) => {
                  if (e) {
                    await handleChangeLogType({ value: e.value, label: e.label });
                  }
                }}
                isSearchable={true}
              ></Select>
            </Flex>
          )}
        </Flex>
        {openServiceList ? (
          <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
            <InputSearchBoxAtoms isPending={isPending} handleChange={onSearchChange} />
            <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
              <Center gap={1}>
                <PlusIcon color="white" height="1.5rem" width="1.5rem" />
                Thêm mới
              </Center>
            </ButtonPrimaryAtoms>
          </Flex>
        ) : (
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
            />
            <InputSearchBoxAtoms isPending={isPending} handleChange={onSearchLogChange} />
          </Flex>
        )}
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
            openServiceList
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            setOpenServiceList(true);
            setOpenServiceLog(false);
          }}
        >
          <Center gap={1}>Danh sách dịch vụ</Center>
        </Button>
        <Button
          style={
            openServiceLog
              ? { backgroundColor: '#115363', color: 'white' }
              : { backgroundColor: '#b7b7b7', color: 'white' }
          }
          onClick={() => {
            setOpenServiceList(false);
            setOpenServiceLog(true);
          }}
        >
          <Center gap={1}>Danh sách log</Center>
        </Button>
      </Flex>
      {openServiceList ? <ServiceTableComponent /> : <ServiceLogTableComponent />}

      <LoadMoreButtonAtoms
        handleOnClick={() => {
          servicePageParams.skip = serviceRegistry.size;
          loadServices();
        }}
        hidden={serviceRegistry.size >= servicePageParams.totalElement}
        loading={loading}
      />
      <CreateServicePage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ServicePage;
