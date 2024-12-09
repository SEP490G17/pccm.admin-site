import React, { useCallback, useEffect, useState } from 'react';
import {
    Flex,
    Heading,
} from '@chakra-ui/react';
import Select from 'react-select';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import './style/style.scss';
import { debounce } from 'lodash';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import UserTableComponents from './components/UserTableComponents';
import InputSearchBoxAtoms from '../atoms/InputSearchBoxAtoms';
import LoadMoreButtonAtoms from '../atoms/LoadMoreButtonAtoms';
import CreateUserComponent from './components/CreateUserComponent';

const UserManagerPage = observer(() => {
    const { userStore } = useStore();
    const {
        loadUsers,
        userPageParams,
        userRegistry
    } = userStore;
    const [isPending, setIsPending] = useState(false);
    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        // Kiểm tra nếu cuộn gần đến cuối (có thể điều chỉnh giá trị 100 theo nhu cầu)
        if (scrollPosition >= documentHeight - 50) {
            userPageParams.skip = userRegistry.size;
            if (userPageParams.totalElement > userRegistry.size) {
                loadUsers();
            }
        }
    }, [
        loadUsers,
        userPageParams,
        userRegistry.size,
    ]);
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = useCallback(
        debounce(async (e) => {
            setIsPending(false); // Bật loading khi người dùng bắt đầu nhập
            await userStore.setSearchTerm(e.target.value);
        }, 500), // Debounce với thời gian 1 giây
        [],
    );

    const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPending(true); // Bật loading khi người dùng bắt đầu nhập
        await handleSearch(e); // Gọi hàm debounce
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Cleanup listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const statusOption = [
        { value: -1, label: 'Tất cả' },
        { value: 0, label: 'Hoạt động' },
        { value: 1, label: 'Không hoạt động' },
    ]

    return (
        <>
            <PageHeadingAtoms breadCrumb={[{ title: 'Danh sách người dùng', to: '/users' }]} />
            <Heading className="mb-4 mt-2">Danh sách người dùng</Heading>
            <Flex width="100%" justifyContent={'space-between'} gap="1.5rem" mb="1.5rem">
                <Flex gap="30px" alignItems="center">
                    <Select
                        options={statusOption}
                        placeholder="Cụm sân"
                        className="w-56 rounded border-[1px solid #ADADAD] shadow-none hover:border-[1px solid #ADADAD]"
                        onChange={async (e) => {
                            if (e) {
                                await userStore.setStatusTerm(e.value.toString());
                            }
                        }}
                        defaultValue={{
                            value: userPageParams.sort ?? 0,
                            label:
                                statusOption.find(option => option.value.toString() === userPageParams.sort)?.label ?? 'Tất cả',
                        }}
                        isSearchable={true}
                    ></Select>

                    <CreateUserComponent/>


                </Flex>
                <Flex gap="30px" alignItems="center">
                    <InputSearchBoxAtoms value={userStore.userPageParams.searchTerm} handleChange={onSearchChange} isPending={isPending} />
                </Flex>
            </Flex>


            <UserTableComponents />

            <LoadMoreButtonAtoms
                handleOnClick={() => {
                    userStore.userPageParams.skip = userStore.userRegistry.size;
                }}
                hidden={userStore.userRegistry.size >= userStore.userPageParams.totalElement}
                loading={userStore.loading}
            />
        </>
    );
});

export default UserManagerPage;
