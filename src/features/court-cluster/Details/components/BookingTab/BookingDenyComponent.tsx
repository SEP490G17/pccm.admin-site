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

const BookingDenyComponent = observer(() => {
  const { bookingClusterStore, courtClusterStore } = useStore();
  const {
    bookingDenyArray,
    loadBookingDeny,
    loadingBookingDeny,
    bookingDenyPageParam,
    bookingDenyRegistry,
    filterBookingDenyByCourt,
    filterBookingDenyByDate,
    setBookingDenySearchTerm,
  } = bookingClusterStore;
  const toast = useToast();
  useEffect(() => {
    bookingDenyPageParam.clearLazyPage();
    loadBookingDeny(toast);
  }, [loadBookingDeny, toast, bookingDenyPageParam]);
  const { selectedCourtCluster } = courtClusterStore;

  if (!selectedCourtCluster) return;
  const [isPending, setIsPending] = useState(false);
  const courtOptions = selectedCourtCluster.courts.map((c) => {
    return {
      value: c.courtId,
      label: c.courtName,
    };
  });

  const handleDateRangeChange = async (value1: Dayjs | null, value2: Dayjs | null) => {
    if (value1 && value2) {
      await filterBookingDenyByDate(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast,
      );
    } else {
      await filterBookingDenyByDate(null, null, toast);
    }
  };

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setBookingDenySearchTerm(e.target.value, toast);
    }, 500);
  }, [setIsPending, setBookingDenySearchTerm, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const handleReset = async () => {
    bookingDenyRegistry.clear();
    bookingDenyPageParam.reset();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    await loadBookingDeny(toast);
  };
  return (
    <>
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex textAlign="left" flexWrap={'wrap'} gap={2}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtOptions]}
            placeholder="Sân"
            value={
              bookingDenyPageParam.courtId
                ? {
                    value: bookingDenyPageParam.courtId,
                    label: courtOptions.find((x) => x.value == bookingDenyPageParam.courtId)?.label,
                  }
                : null
            }
            onChange={async ({ value }: any) => {
              await filterBookingDenyByCourt(value, toast);
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
              bookingDenyPageParam.fromDate && bookingDenyPageParam.toDate
                ? [
                    dayjs(bookingDenyPageParam.fromDate, 'DD/MM/YYYY'),
                    dayjs(bookingDenyPageParam.toDate, 'DD/MM/YYYY'),
                  ]
                : undefined
            }
          />
        </Flex>
        <Flex gap={2}>
          <InputSearchBoxAtoms
            value={bookingDenyPageParam.searchTerm}
            isPending={isPending}
            handleChange={onSearchChange}
            ref={inputRef}
          />
          <Tooltip label={'Tải lại'} placement="top">
            <IconButton
              bg={'transparent'}
              icon={<TfiReload />}
              aria-label="Tải lại"
              onClick={async() => await handleReset()}
            />
          </Tooltip>
        </Flex>
      </Flex>
      {loadingBookingDeny && bookingDenyRegistry.size == 0 && (
        <Skeleton isLoaded={!loadingBookingDeny} h={'30rem'}></Skeleton>
      )}

      {bookingDenyRegistry.size > 0 && (
        <BookingGridTableComponent
          bookingArray={bookingDenyArray}
          totalElement={bookingDenyPageParam.totalElement}
          loadMore={async () => await loadBookingDeny(toast)}
        />
      )}
    </>
  );
});

export default BookingDenyComponent;
