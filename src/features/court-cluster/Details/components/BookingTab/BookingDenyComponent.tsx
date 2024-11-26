import { useStore } from '@/app/stores/store';
import { Flex, Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BookingGridTableComponent from './BookingGridTableComponent';
import Select from 'react-select';
import { DatePicker } from 'antd';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import LoadMoreButtonAtoms from '@/features/atoms/LoadMoreButtonAtoms';

const BookingDenyComponent = observer(() => {
  const { bookingClusterStore, courtClusterStore } = useStore();
  const { bookingCancelArray, loadBookingDeny, loadingBookingCancel, bookingCancelPageParam, bookingCancelRegistry } = bookingClusterStore;
  const [isPending, setIsPending] = useState(false);
  const toast = useToast();
  useEffect(() => {
    loadBookingDeny(toast);
  }, [loadBookingDeny, toast]);

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
      bookingCancelPageParam.skip = bookingCancelRegistry.size;
      if (bookingCancelPageParam.totalElement > bookingCancelRegistry.size) {
        loadBookingDeny(toast);
      }
    }
  }, [
    loadBookingDeny,
    bookingCancelPageParam,
    bookingCancelRegistry,
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
      await bookingClusterStore.setSearchTermCancel(e.target.value, toast);
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
      await bookingClusterStore.setDateTermCancel(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast
      );
    } else {
      await bookingClusterStore.setDateTermCancel(null, null, toast);
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
                await bookingClusterStore.setFilterTermCancel(e.value.toString(), toast);
              }
            }}
            defaultValue={{
              value: bookingCancelPageParam.filter ?? 0,
              label:
                courtOption.find(option => option.value.toString() === bookingCancelPageParam.filter)?.label ?? 'Tất cả',
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
              bookingCancelPageParam.fromDate && bookingCancelPageParam.toDate
                ? [dayjs(bookingCancelPageParam.fromDate, 'DD/MM/YYYY'), dayjs(bookingCancelPageParam.fromDate, 'DD/MM/YYYY')]
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
          <InputSearchBoxAtoms value={bookingCancelPageParam.searchTerm} isPending={isPending} handleChange={onSearchChange} />

        </Flex>
      </Flex>
      <Skeleton isLoaded={!loadingBookingCancel} h={'30rem'}>
        <BookingGridTableComponent bookingArray={bookingCancelArray} />
        <LoadMoreButtonAtoms
        handleOnClick={() => {
          bookingCancelPageParam.skip = bookingCancelRegistry.size;
          loadBookingDeny(toast);
        }}
        hidden={bookingCancelRegistry.size >= bookingCancelPageParam.totalElement}
        loading={loadingBookingCancel}
      />
      </Skeleton>
    </>
  );
});

export default BookingDenyComponent;
