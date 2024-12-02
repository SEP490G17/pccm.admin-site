import { observer } from 'mobx-react-lite';
import BookingTableComponent from './components/Booking/BookingTableComponent';
import { useStore } from '@/app/stores/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Heading, useToast } from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import Select from 'react-select';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';

const BookingsPage = observer(() => {
  const { bookingStore, courtClusterStore } = useStore();
  const toast = useToast();
  const { courtClusterListAllOptions, loadCourtClusterListAll } = courtClusterStore;
  const [isPending, setIsPending] = useState(false);
  const { loadBookingAll, filterByCourtCluster, filterByStatus, bookingPageParams, bookingRegistry, loading } = bookingStore;
  const statusOption = [
    { value: -1, label: 'Tất cả' },
    { value: 4, label: 'Đã hoàn thành' },
    { value: 0, label: 'Chờ xác thực' },
    { value: 1, label: 'Đã xác thực' },
    { value: 2, label: 'Đã từ chối' },
    { value: 3, label: 'Đã bị hủy' },
  ]

  useEffect(() => {
    if (bookingRegistry.size <= 1) {
      loadBookingAll(toast);
    }
    if (courtClusterListAllOptions.length <= 1) {
      loadCourtClusterListAll();
    }
  }, [loadBookingAll, loadCourtClusterListAll, bookingPageParams, bookingRegistry, toast, courtClusterListAllOptions]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      bookingPageParams.skip = bookingRegistry.size;
      if (bookingPageParams.totalElement > bookingRegistry.size) {
        loadBookingAll(toast);
      }
    }
  }, [
    loadBookingAll,
    bookingPageParams,
    bookingRegistry,
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

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await bookingStore.filterByDate(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast
      );
    } else {
      await bookingStore.filterByDate(null, null, toast);
    }
  };

  const handleCourtClusterChange = async (courtClusterId: number) => {
    await filterByCourtCluster(courtClusterId, toast);
  };

  const handleSearchLog = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await bookingStore.setSearchTerm(e.target.value, toast);
    }, 500);
  }, [setIsPending, bookingStore, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchLog(e);
    },
    [handleSearchLog, setIsPending],
  );

  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Booking', to: '/booking' }]} />
      <Heading className="mb-4 mt-2">Danh sách booking</Heading>

      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex textAlign="left" flexWrap={'wrap'} gap={'1rem'}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtClusterListAllOptions]}
            placeholder="Cụm sân"
            defaultValue={{
              value: bookingPageParams.courtClusterId ?? 0,
              label:
                courtClusterListAllOptions.find((x) => x.value == bookingPageParams.courtClusterId)
                  ?.label ?? 'Tất cả',
            }}
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await handleCourtClusterChange(e.value)
              }
            }}
            isSearchable={true}
          />
          <Select
            options={statusOption}
            placeholder="Loại đơn"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await filterByStatus(e.value, toast);
              }
            }}
            defaultValue={{
              value: bookingPageParams.status ?? 0,
              label:
                statusOption.find(option => option.value === bookingPageParams.status)?.label ?? 'Tất cả',
            }}
            isSearchable={true}
          ></Select>
        </Flex>

        <Flex textAlign="right" flexWrap={'wrap'} gap={'1rem'}>
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format={'DD/MM/YYYY HH:mm'}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            style={{ border: '0.5px solid #ADADAD', height: '40px' }}
            defaultValue={
              bookingPageParams.fromDate && bookingPageParams.toDate
                ? [dayjs(bookingPageParams.fromDate, 'DD/MM/YYYY'), dayjs(bookingPageParams.fromDate, 'DD/MM/YYYY')]
                : undefined
            }
            onChange={(value) => {
              if (value && value.length === 2) {
                handleDateRangeChange(value[0], value[1]);
              } else {
                handleDateRangeChange(null, null);
              }
            }}
          />
          <InputSearchBoxAtoms value={bookingPageParams.searchTerm} isPending={isPending} handleChange={onSearchChange} />
        </Flex>
      </Flex>
      <BookingTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          bookingPageParams.skip = bookingRegistry.size;
          loadBookingAll(toast);
        }}
        hidden={bookingRegistry.size >= bookingPageParams.totalElement}
        loading={loading}
      />
    </>
  );
});

export default BookingsPage;
