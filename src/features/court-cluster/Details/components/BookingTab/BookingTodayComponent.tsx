import { useStore } from '@/app/stores/store';
import { observer } from 'mobx-react-lite';
import BookingGridTableComponent from './BookingGridTableComponent';
import { Flex, IconButton, Skeleton, Tooltip, useToast } from '@chakra-ui/react';
import Select from 'react-select';
import InputSearchBoxAtoms from '@/features/atoms/InputSearchBoxAtoms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { TfiReload } from 'react-icons/tfi';

const BookingTodayComponent = observer(() => {
  const { bookingClusterStore: bookingStore, courtClusterStore } = useStore();
  const {
    bookingTodayArray,
    bookingTodayPageParam,
    bookingTodaySetSearchTerm,
    bookingTodaySetFilterTerm,
    bookingTodaySetCategoryTerm,
  } = bookingStore;
  const { selectedCourtCluster } = courtClusterStore;
  if (!selectedCourtCluster) return;
  const [isPending, setIsPending] = useState(false);

  const courtOptions = selectedCourtCluster.courts.map((c) => {
    return {
      value: c.courtId,
      label: c.courtName,
    };
  });
  useEffect(() => {
    bookingStore.loadBookingTodayArray();
  }, [bookingStore.loadBookingTodayArray, bookingStore]);

  const handleSearchDebounced = useMemo(() => {
    return debounce((e) => {
      setIsPending(false); // Tắt loading
      bookingTodaySetSearchTerm(e.target.value);
    }, 500);
  }, [setIsPending, bookingTodaySetSearchTerm]);

  const onSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      handleSearchDebounced(e);
    },
    [handleSearchDebounced, setIsPending],
  );
  const categories = [
    { value: 1, label: 'Đơn ngày' },
    { value: 2, label: 'Đơn tháng' },
  ];
  const toast = useToast();
  return (
    <>
      <Flex direction={'row'} className="mb-8 justify-between">
        <Flex gap={2}>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...courtOptions]}
            placeholder="Sân"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            isSearchable={true}
            onChange={(e: any) => {
              bookingTodaySetFilterTerm(e.value);
            }}
            defaultValue={
              bookingTodayPageParam.filter
                ? {
                    value: Number(bookingTodayPageParam.filter),
                    label: courtOptions.find((c) => c.value == Number(bookingTodayPageParam.filter))
                      ?.label,
                  }
                : null
            }
          ></Select>
          <Select
            options={[{ value: 0, label: 'Tất cả' }, ...categories]}
            placeholder="Loại"
            className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
            isSearchable={true}
            onChange={(e: any) => {
              bookingTodaySetCategoryTerm(e.value);
            }}
            defaultValue={
              bookingTodayPageParam.category
                ? {
                    value: Number(bookingTodayPageParam.category),
                    label: categories.find((c) => c.value == Number(bookingTodayPageParam.category))
                      ?.label,
                  }
                : null
            }
          ></Select>
        </Flex>
        <Flex gap={2}>
          <InputSearchBoxAtoms
            value={bookingTodayPageParam.searchTerm}
            handleChange={onSearchChange}
            isPending={isPending}
          />
          <Tooltip label={'Tải lại'} placement="top">
            <IconButton
              bg={'transparent'}
              icon={<TfiReload />}
              aria-label="Tải lại"
              onClick={() => bookingStore.loadBookingForSchedule(toast)}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Skeleton isLoaded={!bookingStore.loadingBookingForSchedule} h={'30rem'}>
        <BookingGridTableComponent bookingArray={bookingTodayArray} />
      </Skeleton>
    </>
  );
});

export default BookingTodayComponent;
