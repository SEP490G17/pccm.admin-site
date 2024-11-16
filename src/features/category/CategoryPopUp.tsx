import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Center,
    Box,
    Input,
    Button,
    HStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import React, { useEffect, useState } from 'react';
import CategoryTableComponent from './components/CategoryTableComponent';

interface CategoryPopUpProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryPopUp: React.FC<CategoryPopUpProps> = ({ isOpen, onClose }) => {
    const { categoryStore } = useStore();
    const { categoryArray, loadingInitial, loadCategories, addCategory, updateCategory, deleteCategory } = categoryStore;
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen, loadCategories]);

    const handleAddCategory = async () => {
        if (newCategoryName.trim() === '') return;
        await addCategory({ categoryName: newCategoryName });
        setNewCategoryName('');
    };

    const handleEditCategory = async (id: number, newName: string) => {
        if (newName.trim() === '') return; 
        await updateCategory({ id, categoryName: newName });
    };

    const handleDeleteCategory = async (id: number) => {
        await deleteCategory(id);  
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Danh sách thể loại</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box mb={4}>
                        <Box className="slide-box" display="flex" alignItems="center">
                            <HStack spacing={2} align="center" w="100%" maxW="100%">
                                <Input
                                    placeholder="Nhập tên thể loại mới"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                                <Button colorScheme="teal" size="sm" onClick={handleAddCategory}>
                                    Thêm
                                </Button>
                            </HStack>
                        </Box>
                    </Box>

                    <Box maxH="300px" overflowY="auto">
                        <CategoryTableComponent
                            categoryArray={categoryArray}
                            loadingInitial={loadingInitial}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory} 
                        />
                    </Box>
                    <Center mt={4}>
                        <Button onClick={onClose} colorScheme="teal">
                            Đóng
                        </Button>
                    </Center>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default observer(CategoryPopUp);
