import React, { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Select,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateStaffPage from './CreateStaffPage';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import StaffTableComponent from './components/StaffTableComponent';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';

const StaffPage = observer(() => {
  const { staffStore } = useStore();
  const {
    mockLoadStaffs,
    loadStaffArray,
    setSearchTerm,
    staffPageParams,
    staffRegistry,loading
  } = staffStore;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    mockLoadStaffs();
  }, [mockLoadStaffs]);

  const handleSearch = useCallback(
    debounce(async (e) => {
      setIsPending(false); // Bật loading khi người dùng bắt đầu nhập
      await setSearchTerm(e.target.value);
    }, 500), // Debounce với thời gian 1 giây
    [],
  );
  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPending(true); // Bật loading khi người dùng bắt đầu nhập
    await handleSearch(e); // Gọi hàm debounce
  };

  return (
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách nhân viên', to: '/nhan-vien' }]} />
      <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
        <Flex gap="30px" alignItems="center">
          <Select
            width="149px"
            height="35px"
            borderRadius="4px"
            border="1px solid #ADADAD"
            bg="#FFF"
            color="#03301F"
          >
            <option value="all">Tất cả</option>
          </Select>

          <CreateStaffPage />
        </Flex>

        <Box textAlign="right">
          <InputSearchBoxAtoms handleChange={onSearchChange} isPending={isPending} />
        </Box>
      </Flex>
      <StaffTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          staffPageParams.skip = staffRegistry.size;
          loadStaffArray();
        }}
        hidden={staffRegistry.size > staffPageParams.totalElement}
        loading={loading}
      />
    </Flex>
  );
});

export default StaffPage;
