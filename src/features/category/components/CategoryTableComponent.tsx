import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input } from '@chakra-ui/react';
import { FaEdit, FaSave } from 'react-icons/fa';
import SkeletonTableAtoms from '@/features/atoms/SkeletonTableAtoms';
import { Category } from '../../../app/models/category.model';


import React from 'react';

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
}) => {
    const [editId, setEditId] = React.useState<number | null>(null);
    const [editName, setEditName] = React.useState<string>('');

    const handleEditClick = (id: number, name: string) => {
        setEditId(id);
        setEditName(name);
    };

    const handleSaveClick = (id: number) => {
        if (editName.trim() !== '') {
            onEdit(id, editName);
            setEditId(null);
        }
    };

    return (
        <Table className="chakra-table app-table css-ij7hfx" variant="simple" padding={0}>
            <Thead>
                <Tr>
                    <Th w="5rem" py="1rem">ID</Th>
                    <Th w="20rem">Tên thể loại</Th>
                    <Th w="10rem" textAlign="center">Tùy chọn</Th>
                </Tr>
            </Thead>
            <Tbody>
                {loadingInitial ? (
                    <SkeletonTableAtoms numOfColumn={3} pageSize={5} />
                ) : categoryArray.length > 0 ? (
                    categoryArray.map((category, index) => (
                        <Tr key={index}>
                            <Td>{category.id}</Td>
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
                            <Td textAlign="center" >
                                {editId === category.id ? (
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        marginRight={'5px'}
                                        onClick={() => handleSaveClick(category.id)}
                                    >
                                        <FaSave />
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        marginRight={'5px'}
                                        onClick={() => handleEditClick(category.id, category.categoryName)}
                                    >
                                        <FaEdit />
                                    </Button>
                                )}
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
    );
};

export default CategoryTableComponent;
