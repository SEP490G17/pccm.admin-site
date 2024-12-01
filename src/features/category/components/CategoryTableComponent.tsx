import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Box,
    Input,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { Category } from '../../../app/models/category.model';

interface CategoryTableProps {
    categoryArray: Category[];
    loadingInitial: boolean;
    onEdit: (id: number, newName: string) => void;
    onDelete: (id: number) => void;
}

const CategoryTableComponent: React.FC<CategoryTableProps> = ({
    categoryArray,
    loadingInitial,
    onEdit,
    onDelete,
}) => {
    const [editId, setEditId] = React.useState<number | null>(null);
    const [editName, setEditName] = React.useState<string>('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteId, setDeleteId] = React.useState<number | null>(null);

    const handleEditClick = (id: number, name: string) => {
        setEditId(id);
        setEditName(name);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        onOpen();
    };

    const handleConfirmDelete = () => {
        if (deleteId !== null) {
            onDelete(deleteId);
            setDeleteId(null);
        }
        onClose();
    };

    const handleSaveClick = (id: number) => {
        if (editName.trim() !== '') {
            onEdit(id, editName);
            setEditId(null);
        }
    };

    return (
        <>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th w="5rem">ID</Th>
                        <Th w="20rem">Tên thể loại</Th>
                        <Th w="10rem" textAlign="center">
                            Tùy chọn
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {loadingInitial ? (
                        <SkeletonTableAtoms numOfColumn={3} pageSize={5} />
                    ) : categoryArray.length > 0 ? (
                        categoryArray.map((category, index) => (
                            <Tr key={category.id}>
                                <Td>{index + 1}</Td>
                                <Td>
                                    {editId === category.id ? (
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            size="sm"
                                        />
                                    ) : (
                                        category.categoryName
                                    )}
                                </Td>
                                <Td>
                                    <Flex gap={3}>
                                        {editId === category.id ? (
                                            <Button
                                                size="sm"
                                                colorScheme="teal"
                                                onClick={() => handleSaveClick(category.id)}
                                            >
                                                <FaSave />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                colorScheme="teal"
                                                onClick={() =>
                                                    handleEditClick(category.id, category.categoryName)
                                                }
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => handleDeleteClick(category.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={3}>
                                <Box textAlign="center" mt={4} color="red.500" fontSize={20}>
                                    Danh sách rỗng
                                </Box>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Xác nhận xóa</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <UnorderedList className="px-2">
                        <ListItem color={'red'}>
                            Bạn đã chắc chắn xóa thể loại này chưa ?
                        </ListItem>
                        <ListItem>
                            Bạn cần phải xóa các sản phẩm của thể loại này trước khi xóa.
                        </ListItem>
                    </UnorderedList>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onConfirm}>
                        Xóa
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Hủy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CategoryTableComponent;
