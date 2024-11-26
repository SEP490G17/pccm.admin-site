import { useStore } from '@/app/stores/store';
import { Flex, Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import { DatePicker } from 'antd';
import Select from 'react-select';
import BookingGridTableComponent from './BookingGridTableComponent';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

const BookingAllComponent = observer(() => {
  const { bookingClusterStore, courtClusterStore } = useStore();
  const toast = useToast();
  const [isPending, setIsPending] = useState(false);
  const { bookingAllArray, loadBookingAll, loadingBookingAll, bookingAllPageParam, bookingAllRegistry } = bookingClusterStore;

  useEffect(() => {
    loadBookingAll(toast);
  }, [loadBookingAll, toast]);

  const courtOption = courtClusterStore.courtOfClusterArray.map((court) => {
    return {
      value: court.courtId,
      label: court.courtName
    }
  })

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
    if (scrollPosition >= documentHeight - 50) {
      bookingAllPageParam.skip = bookingAllRegistry.size;
      if (bookingAllPageParam.totalElement > bookingAllRegistry.size) {
        loadBookingAll(toast);
      }
    }
  }, [
    loadBookingAll,
    bookingAllPageParam,
    bookingAllRegistry,
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

  const handleSearch = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await bookingClusterStore.setSearchTermAll(e.target.value, toast);
    }, 500);
  }, [setIsPending, bookingClusterStore, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearch(e);
    },
    [handleSearch, setIsPending],
  );

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await bookingClusterStore.setDateTermAll(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast
      );
    } else {
      await bookingClusterStore.setDateTermAll(null, null, toast);
    }
  };

  return (
    <>
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex textAlign="left" flexWrap={'wrap'} gap={'1rem'}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtOption]}
            placeholder="Sân"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await bookingClusterStore.setFilterTermAll(e.value.toString(), toast);
              }
            }}
            defaultValue={{
              value: bookingAllPageParam.filter ?? 0,
              label:
                courtOption.find(option => option.value.toString() === bookingAllPageParam.filter)?.label ?? 'Tất cả',
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
              bookingAllPageParam.fromDate && bookingAllPageParam.toDate
                ? [dayjs(bookingAllPageParam.fromDate, 'DD/MM/YYYY'), dayjs(bookingAllPageParam.fromDate, 'DD/MM/YYYY')]
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
          <InputSearchBoxAtoms value={bookingAllPageParam.searchTerm} isPending={isPending} handleChange={onSearchChange} />

        </Flex>
      </Flex>
      <Skeleton isLoaded={!loadingBookingAll} h={'30rem'}>
        <BookingGridTableComponent bookingArray={bookingAllArray}/>
        <LoadMoreButtonAtoms
          handleOnClick={() => {
            bookingAllPageParam.skip = bookingAllRegistry.size;
            loadBookingAll(toast);
          }}
          hidden={bookingAllRegistry.size >= bookingAllPageParam.totalElement}
          loading={loadingBookingAll}
        />
      </Skeleton>

    </>
  );
});

export default BookingAllComponent;
