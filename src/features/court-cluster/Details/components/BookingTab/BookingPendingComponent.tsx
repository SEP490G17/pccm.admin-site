import { useStore } from '@/app/stores/store';
import { Flex, IconButton, Skeleton, Tooltip, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';

import BookingGridTableComponent from './BookingGridTableComponent';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import { DatePicker } from 'antd';
import { TfiReload } from 'react-icons/tfi';

const BookingPendingComponent = observer(() => {
  // initial store
  const { bookingClusterStore, courtClusterStore } = useStore();

  // get store function
  const {
    bookingPendingArray,
    loadBookingPending,
    loadingBookingPending,
    bookingPendingPageParam,
    filterBookingPendingByCourt,
    filterBookingPendingByDate,
    setBookingPendingSearchTerm,
    bookingPendingRegistry,
  } = bookingClusterStore;
  const toast = useToast();

  useEffect(() => {
    bookingPendingPageParam.clearLazyPage();
    loadBookingPending(toast);
  }, [loadBookingPending, bookingPendingPageParam, toast]);

  const { selectedCourtCluster } = courtClusterStore;

  // check selected court cluster
  if (!selectedCourtCluster) return;

  // pending for search
  const [isPending, setIsPending] = useState(false);

  // options for select
  const courtOptions = selectedCourtCluster.courts.map((c) => {
    return {
      value: c.courtId,
      label: c.courtName,
    };
  });

  // handler
  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await filterBookingPendingByDate(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast,
      );
    } else {
      await filterBookingPendingByDate(null, null, toast);
    }
  };

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setBookingPendingSearchTerm(e.target.value, toast);
    }, 500);
  }, [setIsPending, setBookingPendingSearchTerm, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const handleReset = async () => {
    bookingPendingRegistry.clear();
    bookingPendingPageParam.reset();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    await bookingClusterStore.loadBookingPending(toast);
  };

  return (
    <>
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex textAlign="left" flexWrap={'wrap'} gap={2}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtOptions]}
            placeholder="Sân"
            value={
              bookingPendingPageParam.courtId
                ? {
                    value: bookingPendingPageParam.courtId,
                    label: courtOptions.find((x) => x.value == bookingPendingPageParam.courtId)
                      ?.label,
                  }
                : null
            }
            onChange={async ({ value }: any) => {
              await filterBookingPendingByCourt(value, toast);
            }}
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            isSearchable={true}
          />
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format={'DD/MM/YYYY HH:mm'}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            style={{ border: '0.5px solid #ADADAD', height: '40px' }}
            onChange={(value) => {
              if (value && value.length === 2) {
                handleDateRangeChange(value[0], value[1]);
              } else {
                handleDateRangeChange(null, null);
              }
            }}
            value={
              bookingPendingPageParam.fromDate && bookingPendingPageParam.toDate
                ? [
                    dayjs(bookingPendingPageParam.fromDate, 'DD/MM/YYYY'),
                    dayjs(bookingPendingPageParam.toDate, 'DD/MM/YYYY'),
                  ]
                : undefined
            }
          />
        </Flex>
        <Flex gap={2}>
          <InputSearchBoxAtoms
            value={bookingPendingPageParam.searchTerm}
            isPending={isPending}
            handleChange={onSearchChange}
            ref={inputRef}
          />
          <Tooltip label={'Tải lại'} placement="top">
            <IconButton
              bg={'transparent'}
              icon={<TfiReload />}
              aria-label="Tải lại"
              onClick={handleReset}
            />
          </Tooltip>
        </Flex>
      </Flex>
      {loadingBookingPending && bookingPendingRegistry.size == 0 && (
        <Skeleton isLoaded={!loadingBookingPending} h={'30rem'}></Skeleton>
      )}
      {bookingPendingRegistry.size > 0 && (
        <BookingGridTableComponent
          bookingArray={bookingPendingArray}
          totalElement={bookingPendingPageParam.totalElement}
          loadMore={async () => await loadBookingPending(toast)}
        />
      )}
    </>
  );
});

export default BookingPendingComponent;
