import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Select, Heading, Divider } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style/style.scss';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CreateStaffPage from './CreateStaffPage';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import { debounce } from 'lodash';
import StaffTableComponent from './components/StaffTableComponent';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import StaffPositionTableComponent from './components/StaffPositionTableComponent';

const StaffPage = observer(() => {
  const { staffStore, staffPositionStore } = useStore();
  const { loadStaffs, setSearchTerm, staffPageParams, staffRegistry, loading, setLoadingInitial } =
    staffStore;

  const { loadRoles, loadStaffPosition } = staffPositionStore;
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setLoadingInitial(true);
    Promise.all([loadStaffs(), loadRoles(), loadStaffPosition()]).then(() => {
      setLoadingInitial(false);
    });
  }, [loadStaffs,loadRoles, loadStaffPosition,setLoadingInitial]);

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
    <>
      <PageHeadingAtoms breadCrumb={[{ title: 'Nhân viên', to: '/nhan-vien' }]} />

      <Heading className="mb-4 mt-2">Danh sách nhân viên</Heading>

      <Heading size={'md'}>Chức vụ</Heading>
      <Divider
        orientation="horizontal"
        marginBottom={'1rem'}
        background={'linear-gradient(90deg, #00423D 0%, #0A3351 100%)'}
        width={'3rem'}
        height={1}
      />
      <StaffPositionTableComponent />
      <Heading size={'md'} mt={5}>
        Nhân viên
      </Heading>
      <Divider
        orientation="horizontal"
        background={'linear-gradient(90deg, #00423D 0%, #0A3351 100%)'}
        width={'3rem'}
        height={1}
      />
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="flex-end"
        mb="1.5rem"
        mt={'1rem'}
      >
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
          <InputSearchBoxAtoms value={staffPageParams.searchTerm} handleChange={onSearchChange} isPending={isPending} />
        </Box>
      </Flex>
      <StaffTableComponent />
      <LoadMoreButtonAtoms
        handleOnClick={() => {
          staffPageParams.skip = staffRegistry.size;
        }}
        hidden={staffRegistry.size > staffPageParams.totalElement}
        loading={loading}
      />
    </>
  );
});

export default StaffPage;
