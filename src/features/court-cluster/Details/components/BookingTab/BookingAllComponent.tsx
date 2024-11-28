import { useStore } from '@/app/stores/store';
import { Flex, Skeleton, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';

import BookingGridTableComponent from './BookingGridTableComponent';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import { DatePicker } from 'antd';

const BookingAllComponent = observer(() => {
  const { bookingClusterStore, courtClusterStore } = useStore();
  const toast = useToast();
  const {
    bookingAllArray,
    loadBookingAll,
    loadingBookingAll,
    bookingAllPageParam,
    filterBookingAllByCourt,
    filterBookingAllByDate,
    filterBookingAllByStatus,
    setBookingAllSearchTerm,
    bookingAllRegistry,
  } = bookingClusterStore;
  useEffect(() => {
    bookingAllPageParam.clearLazyPage();
    bookingAllPageParam.searchTerm = '';
    loadBookingAll(toast);
  }, []);
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
      await filterBookingAllByDate(
        value1.format('DD/MM/YYYY HH:mm:ss'),
        value2.format('DD/MM/YYYY HH:mm:ss'),
        toast,
      );
    } else {
      await filterBookingAllByDate(null, null, toast);
    }
  };

  const handleSearchDebounced = useMemo(() => {
    return debounce(async (e) => {
      setIsPending(false); // Tắt loading
      await setBookingAllSearchTerm(e.target.value, toast);
    }, 500);
  }, [setIsPending, setBookingAllSearchTerm, toast]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );

  const statusOption = [
    { value: -1, label: 'Tất cả' },
    { value: 4, label: 'Đã hoàn thành' },
    { value: 0, label: 'Chờ xác thực' },
    { value: 1, label: 'Đã xác thực' },
    { value: 2, label: 'Đã từ chối' },
    { value: 3, label: 'Đã bị hủy' },
  ];
  return (
    <>
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex textAlign="left" flexWrap={'wrap'} gap={2}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtOptions]}
            placeholder="Sân"
            defaultValue={
              bookingAllPageParam.courtId
                ? {
                    value: bookingAllPageParam.courtId,
                    label: courtOptions.find((x) => x.value == bookingAllPageParam.courtId)?.label,
                  }
                : null
            }
            onChange={async ({ value }) => {
              await filterBookingAllByCourt(value, toast);
            }}
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            isSearchable={true}
          />
          <Select
            options={statusOption}
            placeholder="Loại đơn"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            onChange={async (e) => {
              if (e) {
                await filterBookingAllByStatus(e.value, toast);
              }
            }}
            defaultValue={
              bookingAllPageParam.status
                ? {
                    value: statusOption.find((x) => x.value == bookingAllPageParam.status)?.value,
                    label: statusOption.find((x) => x.value == bookingAllPageParam.status)?.label,
                  }
                : null
            }
            isSearchable={true}
          ></Select>
        </Flex>
        <Flex gap={2}>
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
            defaultValue={
              bookingAllPageParam.fromDate && bookingAllPageParam.toDate
                ? [
                    dayjs(bookingAllPageParam.fromDate, 'DD/MM/YYYY'),
                    dayjs(bookingAllPageParam.fromDate, 'DD/MM/YYYY'),
                  ]
                : undefined
            }
          />
          <InputSearchBoxAtoms
            value={bookingAllPageParam.searchTerm}
            isPending={isPending}
            handleChange={onSearchChange}
          />
        </Flex>
      </Flex>
      {loadingBookingAll && bookingAllRegistry.size == 0 && (
        <Skeleton isLoaded={!loadingBookingAll} h={'30rem'}></Skeleton>
      )}

      {bookingAllRegistry.size > 0 && (
        <BookingGridTableComponent
          bookingArray={bookingAllArray}
          totalElement={bookingAllPageParam.totalElement}
          loadMore={async () => await loadBookingAll(toast)}
        />
      )}
    </>
  );
});

export default BookingAllComponent;
