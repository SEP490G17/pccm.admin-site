import React, { useEffect } from 'react';
import {
    Button,
    Flex,
    Input,
    Select,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaSearch } from 'react-icons/fa';
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import UserTableComponents from './components/UserTableComponents';

const UserManagerPage = observer(() => {
    const { userStore } = useStore();
    const {
        loadUsers,
     
    } = userStore;

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        userStore.setSearchTerm(e.target.value);
    };


    return (
        <>
            <PageHeadingAtoms breadCrumb={[{title:'Danh sách người dùng',to:'/users'}]} />
            <Flex width="100%" flexDirection="column" gap="1.5rem" mb="1.5rem">
                <Flex justifyContent="space-between" alignItems="center" gap="30px">
                    <Flex flex="1" padding="3px 10px" alignItems="center" gap="16px" borderRadius="4px" border="0.5px solid #ADADAD" background="#FFF" >
                        <Input placeholder="Nhập từ khóa tìm kiếm" onChange={handleSearch} border="none" height="30px" outline="none" />
                        <Button>
                            <FaSearch />
                        </Button>
                    </Flex>
                    <Select width="149px" height="38px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF" color="#03301F">
                        <option value="all">Trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </Select>
                </Flex>

                <Flex gap="30px" alignItems="center">
                    <Select width="149px" height="35px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF" color="#03301F">
                        <option value="all">Tất cả</option>
                    </Select>

                    <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={() => router.navigate('/nhan-vien/tao')}>
                        Thêm mới
                    </Button>
                </Flex>
            </Flex>


            <UserTableComponents />

           
        </>
    );
});

export default UserManagerPage;
