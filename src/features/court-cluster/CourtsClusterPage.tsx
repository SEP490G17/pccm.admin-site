import React, {useEffect} from 'react';
import {
    Button,
    Flex,
    Input,
    Box,
    Select,
} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/app/stores/store.ts';
import {FaEdit, FaSearch} from 'react-icons/fa';
import './style.scss';
import {router} from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import CourtClusterTableComponent from "@/features/court-cluster/components/CourtClusterTableComponent.tsx";

const CourtClusterPage = observer(() => {
    const {courtStore} = useStore();
    const {
        loadCourtsCluster,

    } = courtStore;

    useEffect(() => {
        loadCourtsCluster();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        courtStore.setSearchTerm(e.target.value);
    };


    return (
        <>
            <PageHeadingAtoms breadCrumb={[{title: 'Danh sách cụm sân', to: '/cum-san'}]}/>
            <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
                <Flex gap="30px" alignItems="center">
                    <Select width="149px" height="35px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF"
                            color="#03301F">
                        <option value="all">Tất cả</option>
                    </Select>

                    <Button colorScheme="teal" size="md" leftIcon={<FaEdit/>} width="149px" height="35px"
                            className='bg-white' color="black" border="1px solid #ADADAD"
                            onClick={() => router.navigate('/cum-san/tao')}>
                        Thêm mới
                    </Button>
                </Flex>

                <Box textAlign="right">
                    <Box color="#00423D" fontFamily="Roboto" fontSize="12px" mb="0.5rem">
                        Tìm kiếm nâng cao
                    </Box>

                    <Flex padding="3px 10px" alignItems="center" gap="16px" borderRadius="4px"
                          border="0.5px solid #ADADAD" background="#FFF">
                        <Input placeholder="Nhập từ khóa tìm kiếm" onChange={handleSearch} border="none" height="30px"
                               outline="none"/>
                        <Button>
                            <FaSearch/>
                        </Button>
                    </Flex>
                </Box>
            </Flex>
            <CourtClusterTableComponent/>


        </>
    );
});

export default CourtClusterPage;
