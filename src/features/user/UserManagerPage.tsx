import React, { useEffect } from 'react';
import {
    Button,
    Flex,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    IconButton,
    Select,
    TableContainer,
    Checkbox,
    Switch,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaTrash, FaSearch, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';

const UserManagerPage = observer(() => {
    const { userStore } = useStore();
    const {
        mockLoadUsers,
        userArray,
        setCurrentPage: setPage,
        userPageParams,
        setPageSize,
        loading,
    } = userStore;

    useEffect(() => {
        mockLoadUsers();
    }, [mockLoadUsers]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        userStore.setSearchTerm(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        mockLoadUsers();
    };

    const renderStatus = (status: string) => {
        let color = '';
        switch (status) {
            case 'Hoạt động':
                color = 'green';
                break;
            case 'Không hoạt động':
                color = 'red';
                break;
            case 'Tạm thời khóa':
                color = 'gray';
                break;
            default:
                color = 'black';
        }
        return <Box color={color}>{status}</Box>;
    };
    const renderPaginationButtons = () => {
        const { pageIndex, totalPages } = userPageParams;
        const buttons = [];

        if (!totalPages || totalPages === 0) {
            return null;
        }

        // Nút về trang đầu tiên
        buttons.push(
            <IconButton
                key="first"
                aria-label="First Page"
                icon={<FaAngleDoubleLeft />}
                onClick={() => handlePageChange(1)}
                isDisabled={pageIndex === 1}
                mr={2}
            />
        );

        // Nút lùi 1 trang
        buttons.push(
            <IconButton
                key="previous"
                aria-label="Previous Page"
                icon={<FaAngleLeft />}
                onClick={() => handlePageChange(pageIndex - 1)}
                isDisabled={pageIndex === 1}
                mr={2}
            />
        );

        // Hiển thị trang
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <Button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination-button ${pageIndex === i ? 'active' : ''}`}
                    >
                        {i}
                    </Button>
                );
            }
        } else {
            buttons.push(
                <Button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`pagination-button ${pageIndex === 1 ? 'active' : ''}`}
                >
                    1
                </Button>
            );

            if (pageIndex > 2) {
                buttons.push(<span key="ellipsis1">...</span>);
            }

            if (pageIndex > 1 && pageIndex < totalPages) {
                buttons.push(
                    <Button
                        key={pageIndex}
                        onClick={() => handlePageChange(pageIndex)}
                        className="pagination-button active"
                    >
                        {pageIndex}
                    </Button>
                );
            }

            if (pageIndex < totalPages - 1) {
                buttons.push(<span key="ellipsis2">...</span>);
            }

            buttons.push(
                <Button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`pagination-button ${pageIndex === totalPages ? 'active' : ''}`}
                >
                    {totalPages}
                </Button>
            );
        }

        buttons.push(
            <IconButton
                key="next"
                aria-label="Next Page"
                icon={<FaAngleRight />}
                onClick={() => handlePageChange(pageIndex + 1)}
                isDisabled={pageIndex === totalPages}
                ml={2}
            />
        );

        buttons.push(
            <IconButton
                key="last"
                aria-label="Last Page"
                icon={<FaAngleDoubleRight />}
                onClick={() => handlePageChange(totalPages)}
                isDisabled={pageIndex === totalPages}
                ml={2}
            />
        );

        return buttons;
    };

    return (
        <Flex direction="column" p={8} bg="#F4F4F4">
            <PageHeadingAtoms breadCrumb={[{title:'Danh sách người dùng',to:'#'}]} />
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


            <TableContainer bg={'white'} borderRadius={'8px'} padding={0} border={'1px solid #000'} mb="1.5rem">
                <Table variant="simple" cellPadding={'1rem'} padding={0}>
                    <Thead backgroundColor={'#03301F'}>
                        <Tr>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                #
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                STT
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Tên đăng nhập
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Email
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Vai trò
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Ngày tạo
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Ngày đăng nhập cuối
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Trạng thái
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Kích hoạt
                            </Th>
                            <Th color={'white'}>Tùy chọn</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            <SkeletonTableAtoms numOfColumn={9} pageSize={userPageParams.pageSize} />
                        ) : (
                            userArray.map((user, index) => (
                                <Tr key={user.id}>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        <Checkbox />
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {(userPageParams.pageIndex - 1) * userPageParams.pageSize + index + 1}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {user.username}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {user.email}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {user.role}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {user.createdDate}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {user.lastLoginDate}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {renderStatus(user.status)}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        <Switch
                                            isChecked={user.isActivated}
                                            onChange={() => userStore.toggleUserActivation(user.id)}
                                            colorScheme={user.isActivated ? 'blue' : 'gray'}
                                        />
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'}>
                                        <IconButton
                                            icon={<FaEdit />}
                                            aria-label="Edit"
                                            colorScheme="teal"
                                            size="sm"
                                            mr={2}
                                        />
                                        <IconButton
                                            icon={<FaTrash />}
                                            aria-label="Delete"
                                            colorScheme="red"
                                            size="sm"
                                        />
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            </TableContainer>

            <Flex justifyContent="space-between" alignItems="center" mb="1rem">
                <Box display="flex" alignItems="center">
                    Hiển thị
                    <Select
                        width="70px"
                        height="35px"
                        value={userPageParams.pageSize}
                        onChange={handlePageSizeChange}
                        marginLeft="10px"
                        marginRight="10px"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </Select>
                    tài liệu
                </Box>
                <Flex justifyContent={'flex-end'}>
                    {renderPaginationButtons()}
                </Flex>
            </Flex>
        </Flex>
    );
});

export default UserManagerPage;
