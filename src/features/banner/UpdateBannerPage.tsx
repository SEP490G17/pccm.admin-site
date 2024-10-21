import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Box,
    useDisclosure,
    Select,
    Flex,
    VStack,
    HStack,
    Badge,
    IconButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const UpdateBannerPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [bannerData, setBannerData] = useState({
        title: '',
        description: '',
        image: null,
        link: '',
        startDate: '',
        endDate: '',
        status: '',
        position: '',
        destination: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBannerData({
            ...bannerData,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBannerData({
                ...bannerData,
                image: e.target.files[0],
            });
        }
    };

    return (
        <>
            <IconButton
                icon={<FaEdit />}
                aria-label="Edit"
                colorScheme="teal"
                size="sm"
                mr={2}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Banner
                    </ModalHeader>
                    <ModalCloseButton color='#FFF' />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            {/* Phần nhập tiêu đề */}
                            <FormControl isRequired>
                                <FormLabel>Tiêu đề bài viết</FormLabel>
                                <Input
                                    name="title"
                                    placeholder="Nhập tiêu đề"
                                    onChange={handleChange}
                                    height="40px"
                                    bg="#FFF"
                                />
                            </FormControl>

                            {/* Phần nhập mô tả */}
                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea
                                    name="description"
                                    placeholder="Nhập mô tả"
                                    onChange={handleChange}
                                    bg="#FFF"
                                />
                            </FormControl>

                            {/* Phần kéo hình ảnh vào */}
                            <FormControl>
                                <FormLabel>Ảnh banner</FormLabel>
                                <Box
                                    display="flex"
                                    padding="5px 8px"
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    gap="10px"
                                    alignSelf="stretch"
                                    borderRadius="16px"
                                    border="1px dashed rgba(51, 51, 51, 0.30)"
                                    bg="#FFF"
                                    color="#939393"
                                    fontFamily="Roboto"
                                    fontSize="16px"
                                    fontStyle="normal"
                                    fontWeight="400"
                                    lineHeight="normal"
                                >
                                    <Flex justifyContent="space-between" alignItems="center" alignSelf="stretch">
                                        <Box>Kéo hình ảnh hoặc upload hình ảnh tại đây</Box>
                                        <Input
                                            type="file"
                                            onChange={handleFileChange}
                                            display="none"
                                            id="upload-banner-image"
                                        />
                                        <Button as="label" htmlFor="upload-banner-image" bg="#E2E8F0" color="black">
                                            Upload file
                                        </Button>
                                    </Flex>
                                </Box>
                            </FormControl>

                            {/* Phần nhập đường link dẫn */}
                            <FormControl>
                                <FormLabel>Đường link dẫn</FormLabel>
                                <Input
                                    name="link"
                                    placeholder="Nhập đường link"
                                    onChange={handleChange}
                                    height="40px"
                                    bg="#FFF"
                                />
                            </FormControl>

                            {/* Phần nhập thời gian */}
                            <FormControl>
                                <FormLabel>Thời gian</FormLabel>
                                <HStack spacing="20px">
                                    <Badge colorScheme="green" fontSize="1em" padding="8px 16px">
                                        Giờ bắt đầu
                                    </Badge>
                                    <Input
                                        type="datetime-local"
                                        name="startDate"
                                        onChange={handleChange}
                                        bg="#FFF"
                                        width="200px"
                                    />

                                    <Badge colorScheme="red" fontSize="1em" padding="8px 16px">
                                        Giờ kết thúc
                                    </Badge>
                                    <Input
                                        type="datetime-local"
                                        name="endDate"
                                        onChange={handleChange}
                                        bg="#FFF"
                                        width="200px"
                                    />
                                </HStack>
                            </FormControl>

                            {/* Trang đích, Vị trí, Trạng thái */}
                            <Flex justifyContent="space-between" gap="100px">
                                <FormControl>
                                    <FormLabel>Trang đích</FormLabel>
                                    <Select name="destination" onChange={handleChange} bg="#FFF">
                                        <option value="Trang chủ">Trang chủ</option>
                                        <option value="Trang sản phẩm">Trang sản phẩm</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Vị trí</FormLabel>
                                    <Select name="position" onChange={handleChange} bg="#FFF">
                                        <option value="Đầu trang">Đầu trang</option>
                                        <option value="Cuối trang">Cuối trang</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <Select name="status" onChange={handleChange} bg="#FFF">
                                        <option value="Hiển thị">Hiển thị</option>
                                        <option value="Ẩn">Ẩn</option>
                                    </Select>
                                </FormControl>
                            </Flex>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Xóa
                        </Button>
                        <Button bg="#00423D" color="white" onClick={onClose}>
                            Lưu
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateBannerPage;
