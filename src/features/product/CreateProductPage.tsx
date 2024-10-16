import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import SelectComponent from "@/app/common/input/Select";
import FileUpload from "@/app/common/input/FileUpload";
import { FaEdit } from "react-icons/fa";

const CreateProductPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={onOpen}>
                        Thêm mới
                    </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Hàng Hóa
                    </ModalHeader>
                    <ModalCloseButton color='#FFF' />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            <Formik
                                initialValues={{ name: "", description: "" }}
                                onSubmit={(values) => {
                                    // handleSubmit(values);
                                    console.log(values);
                                }}
                            >
                                {(props) => (
                                    <Form>

                                        <FormControl isRequired>
                                            <FormLabel className="title_label">
                                                Tên hàng hóa
                                            </FormLabel>
                                            <Input
                                                className="input_text"
                                                type="text"
                                                name="name"
                                                placeholder="Nhập"
                                            />
                                        </FormControl>
                                        <HStack>
                                            <FormControl>
                                                <FormLabel className="title_label">Thể loại</FormLabel>
                                                <SelectComponent
                                                    items={[
                                                        { id: 1, name: "Đồ ăn" },
                                                        { id: 2, name: "Nước uống" }
                                                    ]}
                                                    onSelectChange={(value) => console.log('Selected value:', value)}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Số lượng
                                                </FormLabel>
                                                <Input
                                                    name="quantity"
                                                    placeholder="xxxxxxx"
                                                    className="input_text"
                                                    type="number"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Giá cả
                                                </FormLabel>
                                                <Input
                                                    name="price"
                                                    placeholder="xxxxxxx"
                                                    className="input_text"
                                                    type="number"
                                                />
                                            </FormControl>
                                        </HStack>
                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Ảnh sản phẩm
                                            </FormLabel>
                                            <FileUpload></FileUpload>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Mô tả hàng hóa
                                            </FormLabel>
                                            <Input
                                                name="description"
                                                placeholder="Nhập mô tả"
                                                className="input_text"
                                                type="number"
                                            />
                                        </FormControl>
                                        <Stack direction='row' justifyContent='flex-end' mt={9}>
                                            <Button
                                                className="delete"
                                                isLoading={props.isSubmitting}
                                                type="submit"
                                            >
                                                Xóa
                                            </Button>
                                            <Button
                                                className="save"
                                                isLoading={props.isSubmitting}
                                                type="submit"
                                            >
                                                Lưu
                                            </Button>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ >
    );
};

export default CreateProductPage;
