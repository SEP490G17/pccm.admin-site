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
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { FaEdit, FaTrash, FaSearch, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import './style.scss';
import { router } from '@/app/router/Routes';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import SkeletonTableAtoms from '../atoms/SkeletonTableAtoms';

const StaffPage = observer(() => {
    const { staffStore } = useStore();
    const {
        mockLoadStaffs,
        staffArray,
        setCurrentPage: setPage,
        staffPageParams,
        loading,
        setPageSize,
    } = staffStore;

    useEffect(() => {
        mockLoadStaffs();
    }, [mockLoadStaffs]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        staffStore.setSearchTerm(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        mockLoadStaffs(); // Gọi lại hàm để tải dữ liệu với số lượng mới
    };

    const renderPaginationButtons = () => {
        const { pageIndex, totalPages } = staffPageParams;
        const buttons = [];

        if (!totalPages || totalPages === 0) {
            return null;
        }

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
            <PageHeadingAtoms title={'Danh sách nhân viên'} />
            <Flex width="100%" justifyContent="space-between" alignItems="flex-end" mb="1.5rem">
                <Flex gap="30px" alignItems="center">
                    <Select width="149px" height="35px" borderRadius="4px" border="1px solid #ADADAD" bg="#FFF" color="#03301F">
                        <option value="all">Tất cả</option>
                    </Select>

                    <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={() => router.navigate('/nhan-vien/tao')}>
                        Thêm mới
                    </Button>
                </Flex>

                <Box textAlign="right">
                    <Box color="#00423D" fontFamily="Roboto" fontSize="12px" mb="0.5rem">
                        Tìm kiếm nâng cao
                    </Box>

                    <Flex padding="3px 10px" alignItems="center" gap="16px" borderRadius="4px" border="0.5px solid #ADADAD" background="#FFF">
                        <Input placeholder="Nhập từ khóa tìm kiếm" onChange={handleSearch} border="none" height="30px" outline="none" />
                        <Button>
                            <FaSearch />
                        </Button>
                    </Flex>
                </Box>
            </Flex>

            <TableContainer bg={'white'} borderRadius={'8px'} padding={0} border={'1px solid #000'} mb="1.5rem">
                <Table variant="simple" cellPadding={'1rem'} padding={0} >
                    <Thead backgroundColor={'#03301F'}>
                        <Tr>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                STT
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Tên nhân viên
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                CMND
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Số điện thoại
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Chức vụ
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Quyền hạn
                            </Th>
                            <Th borderRight={'0.923px solid #BDBDBD'} color={'white'}>
                                Ca làm
                            </Th>
                            <Th color={'white'}>Tùy chọn</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            <SkeletonTableAtoms numOfColumn={8} pageSize={staffPageParams.pageSize} />
                        ) : (
                            staffArray.map((staff, index) => (
                                <Tr key={staff.id}>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {(staffPageParams.pageIndex - 1) * staffPageParams.pageSize + index + 1}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.name}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.identityCard}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.phoneNumber}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.position}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.permission}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
                                        {staff.shift}
                                    </Td>
                                    <Td borderBottom={'0.923px solid #BDBDBD'} display={'flex'} gap={'0.5rem'}>
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
                        value={staffPageParams.pageSize}
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

                {/* Phần phân trang */}
                <Flex justifyContent={'flex-end'}>
                    {renderPaginationButtons()}
                </Flex>
            </Flex>

        </Flex>
    );
});

export default StaffPage;
